import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getSorobanServer,
    SOROBAN_NETWORKS,
    NetworkConfig,
    getContractStorage,
    getContractDetails,
    simulateContractCall,
    ContractParam,
} from '@/lib/soroban/utils';
import Server from "stellar-sdk";

export type ContractMethod = {
    name: string;
    params: string[];
    type: 'read' | 'write';
};

export type DebugLogType = 'info' | 'success' | 'error' | 'debug';

export type DebugLog = {
    type: DebugLogType;
    message: string;
    timestamp: Date;
};

export type NetworkLog = {
    direction: 'request' | 'response';
    message: string;
    timestamp: Date;
    status?: string;
};

export type ContractDebugContextType = {
    currentNetwork: NetworkConfig;
    setCurrentNetwork: (network: NetworkConfig) => void;
    sorobanServer: Server | null;

    contractId: string;
    setContractId: (id: string) => void;
    contractDetails: any;

    readMethods: ContractMethod[];
    writeMethods: ContractMethod[];
    setContractMethods: (read: ContractMethod[], write: ContractMethod[]) => void;

    debugLogs: DebugLog[];
    addDebugLog: (type: DebugLogType, message: string) => void;
    clearDebugLogs: () => void;

    networkLogs: NetworkLog[];
    addNetworkLog: (direction: 'request' | 'response', message: string, status?: string) => void;
    clearNetworkLogs: () => void;

    storageData: { key: string; value: string }[];
    refreshStorageData: () => Promise<void>;

    accountPublicKey: string;
    setAccountPublicKey: (publicKey: string) => void;
    accountBalance: string;

    executeContractMethod: (
        method: string,
        params: ContractParam[],
        type: 'read' | 'write'
    ) => Promise<any>;

    isLoading: boolean;
    executionResult: any | null;
};

const ContractDebugContext = createContext<ContractDebugContextType | undefined>(undefined);

export function ContractDebugProvider({ children }: { children: ReactNode }) {
    const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(SOROBAN_NETWORKS.TESTNET);
    const [sorobanServer, setSorobanServer] = useState<Server | null>(null);

    const [contractId, setContractId] = useState<string>('');
    const [contractDetails, setContractDetails] = useState<any>(null);

    const [readMethods, setReadMethods] = useState<ContractMethod[]>([
        { name: 'balance_of', params: ['account'], type: 'read' },
        { name: 'allowance', params: ['owner', 'spender'], type: 'read' },
        { name: 'name', params: [], type: 'read' },
        { name: 'symbol', params: [], type: 'read' },
        { name: 'decimals', params: [], type: 'read' },
        { name: 'total_supply', params: [], type: 'read' },
    ]);

    const [writeMethods, setWriteMethods] = useState<ContractMethod[]>([
        { name: 'transfer', params: ['recipient', 'amount'], type: 'write' },
        { name: 'approve', params: ['spender', 'amount'], type: 'write' },
        { name: 'transfer_from', params: ['sender', 'recipient', 'amount'], type: 'write' },
    ]);

    const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
    const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([]);

    const [storageData, setStorageData] = useState<{ key: string; value: string }[]>([]);

    const [accountPublicKey, setAccountPublicKey] = useState<string>('');
    const [accountBalance, setAccountBalance] = useState<string>('0.0000000');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [executionResult, setExecutionResult] = useState<any | null>(null);

    useEffect(() => {
        const server = getSorobanServer(currentNetwork);
        setSorobanServer(server);

        clearDebugLogs();
        clearNetworkLogs();
        setStorageData([]);
        setExecutionResult(null);

        addDebugLog('info', `Connected to ${currentNetwork.networkName}`);
    }, [currentNetwork]);

    useEffect(() => {
        if (contractId && sorobanServer) {
            fetchContractDetails();
            refreshStorageData();
        }
    }, [contractId, sorobanServer]);

    useEffect(() => {
        if (accountPublicKey && sorobanServer) {
            fetchAccountBalance();
        }
    }, [accountPublicKey, sorobanServer]);

    const addDebugLog = (type: DebugLogType, message: string) => {
        setDebugLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
    };

    const clearDebugLogs = () => {
        setDebugLogs([]);
    };

    const addNetworkLog = (direction: 'request' | 'response', message: string, status?: string) => {
        setNetworkLogs(prev => [...prev, {
            direction,
            message,
            timestamp: new Date(),
            status
        }]);
    };

    const clearNetworkLogs = () => {
        setNetworkLogs([]);
    };

    const setContractMethods = (read: ContractMethod[], write: ContractMethod[]) => {
        setReadMethods(read);
        setWriteMethods(write);
    };

    const fetchContractDetails = async () => {
        if (!contractId || !sorobanServer) return;

        setIsLoading(true);
        addNetworkLog('request', `Fetching contract details for: ${contractId}`);

        try {
            const details = await getContractDetails(contractId, sorobanServer);
            setContractDetails(details);

            if (details) {
                addDebugLog('success', `Contract details fetched successfully`);
                addNetworkLog('response', `Contract details fetched`, 'Success (200)');
            } else {
                addDebugLog('error', `Failed to fetch contract details`);
                addNetworkLog('response', `Failed to fetch contract details`, 'Error (400)');
            }
        } catch (error) {
            console.error('Error fetching contract details:', error);
            addDebugLog('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
            addNetworkLog('response', `Error fetching contract details`, 'Error (500)');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshStorageData = async () => {
        if (!contractId || !sorobanServer) return;

        setIsLoading(true);
        addNetworkLog('request', `Fetching contract storage for: ${contractId}`);

        try {
            const storage = await getContractStorage(contractId, sorobanServer);
            setStorageData(storage);

            addDebugLog('info', `Contract storage fetched (${storage.length} entries)`);
            addNetworkLog('response', `Contract storage fetched`, 'Success (200)');
        } catch (error) {
            console.error('Error fetching contract storage:', error);
            addDebugLog('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
            addNetworkLog('response', `Error fetching contract storage`, 'Error (500)');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAccountBalance = async () => {
        if (!accountPublicKey || !sorobanServer) return;

        try {
            const account = await sorobanServer.getAccount(accountPublicKey);
            const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');

            if (xlmBalance) {
                setAccountBalance(xlmBalance.balance);
            }
        } catch (error) {
            console.error('Error fetching account balance:', error);
            addDebugLog('error', `Error fetching account balance: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const executeContractMethod = async (
        method: string,
        params: ContractParam[],
        type: 'read' | 'write'
    ) => {
        if (!contractId || !sorobanServer || !accountPublicKey) {
            addDebugLog('error', 'Missing contract ID, server, or account public key');
            return null;
        }

        setIsLoading(true);
        setExecutionResult(null);

        const logParams = params.map(p =>
            typeof p === 'object' ? JSON.stringify(p) : String(p)
        ).join(', ');

        addDebugLog('info', `Executing ${method}(${logParams})`);
        addNetworkLog('request', `${type === 'read' ? 'Reading' : 'Writing'}: ${method}(${logParams})`);

        try {
            const result = await simulateContractCall(
                contractId,
                method,
                params,
                accountPublicKey,
                sorobanServer,
                currentNetwork.networkPassphrase
            );

            if (result.success) {
                addDebugLog('success', `Method ${method} executed successfully`);
                addNetworkLog('response', `Success: ${method} executed`, 'Success (200)');

                if (result.logs && result.logs.length > 0) {
                    result.logs.forEach((log: any) => {
                        addDebugLog('debug', `Event: ${JSON.stringify(log)}`);
                    });
                }


                setExecutionResult(result);
                return result;
            } else {
                addDebugLog('error', `Error executing ${method}: ${result.error}`);
                addNetworkLog('response', `Error: ${result.error}`, 'Error (400)');
                setExecutionResult({ error: result.error });
                return { error: result.error };
            }
        } catch (error) {
            console.error(`Error executing ${method}:`, error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            addDebugLog('error', `Exception: ${errorMessage}`);
            addNetworkLog('response', `Exception: ${errorMessage}`, 'Error (500)');
            setExecutionResult({ error: errorMessage });
            return { error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const value: ContractDebugContextType = {
        currentNetwork,
        setCurrentNetwork,
        sorobanServer,

        contractId,
        setContractId,
        contractDetails,

        readMethods,
        writeMethods,
        setContractMethods,

        debugLogs,
        addDebugLog,
        clearDebugLogs,

        networkLogs,
        addNetworkLog,
        clearNetworkLogs,

        storageData,
        refreshStorageData,

        accountPublicKey,
        setAccountPublicKey,
        accountBalance,

        executeContractMethod,

        isLoading,
        executionResult,
    };

    return (
        <ContractDebugContext.Provider value={value}>
            {children}
        </ContractDebugContext.Provider>
    );
}

export function useContractDebug() {
    const context = useContext(ContractDebugContext);
    if (context === undefined) {
        throw new Error('useContractDebug must be used within a ContractDebugProvider');
    }
    return context;
}
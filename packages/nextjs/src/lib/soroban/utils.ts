import { Soroban, Networks, Server, TransactionBuilder, Operation, Asset, Contract, xdr } from 'stellar-sdk';

export type NetworkConfig = {
    networkPassphrase: string;
    sorobanRpcUrl: string;
    networkName: string;
};

export const SOROBAN_NETWORKS = {
    TESTNET: {
        networkPassphrase: Networks.TESTNET,
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
        networkName: 'TESTNET',
    },
    FUTURENET: {
        networkPassphrase: Networks.FUTURENET,
        sorobanRpcUrl: 'https://rpc-futurenet.stellar.org',
        networkName: 'FUTURENET',
    },
    LOCALNET: {
        networkPassphrase: Networks.STANDALONE,
        sorobanRpcUrl: 'http://localhost:8000/soroban/rpc',
        networkName: 'LOCALNET',
    },
} as const;

export function getSorobanServer(network: NetworkConfig = SOROBAN_NETWORKS.TESTNET): Server {
    return new Server(network.sorobanRpcUrl, { allowHttp: true });
}

export type ContractParam =
    | string
    | number
    | boolean
    | bigint
    | ContractParam[]
    | { [key: string]: ContractParam };

export function parseContractParam(param: ContractParam): xdr.ScVal {
    if (typeof param === 'string') {
        if (param.startsWith('0x')) {
            return xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeContract(Buffer.from(param.slice(2), 'hex')));
        }
        return xdr.ScVal.scvString(param);
    }

    if (typeof param === 'number') {
        return xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString(param.toString()),
            hi: new xdr.Int64(0),
        }));
    }

    if (typeof param === 'boolean') {
        return param ? xdr.ScVal.scvBool(true) : xdr.ScVal.scvBool(false);
    }

    if (typeof param === 'bigint') {
        return xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString((param % BigInt(2 ** 64)).toString()),
            hi: xdr.Int64.fromString((param / BigInt(2 ** 64)).toString()),
        }));
    }

    if (Array.isArray(param)) {
        const vec = param.map(parseContractParam);
        return xdr.ScVal.scvVec(vec);
    }

    if (typeof param === 'object') {
        const map: xdr.ScMapEntry[] = [];
        for (const [key, value] of Object.entries(param)) {
            map.push(new xdr.ScMapEntry({
                key: xdr.ScVal.scvString(key),
                val: parseContractParam(value),
            }));
        }
        return xdr.ScVal.scvMap(map);
    }

    throw new Error(`Unsupported parameter type: ${typeof param}`);
}

export function parseXdrValue(value: xdr.ScVal): any {
    switch (value.switch()) {
        case xdr.ScValType.scvBool():
            return value.b();
        case xdr.ScValType.scvString():
            return value.str().toString();
        case xdr.ScValType.scvI128(): {
            const i128 = value.i128();
            const hi = i128.hi().toString();
            const lo = i128.lo().toString();
            if (hi === '0') return Number(lo);
            // For larger numbers, return as string to preserve precision
            return `${hi}${lo.padStart(20, '0')}`;
        }
        case xdr.ScValType.scvU128(): {
            const u128 = value.u128();
            const hi = u128.hi().toString();
            const lo = u128.lo().toString();
            if (hi === '0') return Number(lo);
            // For larger numbers, return as string to preserve precision
            return `${hi}${lo.padStart(20, '0')}`;
        }
        case xdr.ScValType.scvVec(): {
            const vec = value.vec();
            if (!vec) return [];
            return vec.map(parseXdrValue);
        }
        case xdr.ScValType.scvMap(): {
            const map = value.map();
            if (!map) return {};
            const result: Record<string, any> = {};
            for (const entry of map) {
                const key = parseXdrValue(entry.key()).toString();
                result[key] = parseXdrValue(entry.val());
            }
            return result;
        }
        case xdr.ScValType.scvAddress(): {
            const address = value.address();
            switch (address.switch()) {
                case xdr.ScAddressType.scAddressTypeAccount(): {
                    const accountId = new xdr.PublicKey({ type: xdr.PublicKeyType.publicKeyTypeEd25519(), ed25519: address.accountId().ed25519() });
                    return accountId.toXDRBase64();
                }
                case xdr.ScAddressType.scAddressTypeContract(): {
                    return `0x${address.contractId().toString('hex')}`;
                }
            }
            break;
        }
        default:
            return `<Unknown: ${value.switch().name}>`;
    }
}

export async function getContractStorage(
    contractId: string,
    server: Server,
): Promise<{ key: string; value: string }[]> {
    try {
        const contractInstance = new Contract(contractId);
        const ledgerKey = xdr.LedgerKey.contractData(new xdr.LedgerKeyContractData({
            contract: xdr.ScAddress.scAddressTypeContract(Buffer.from(contractId.slice(2), 'hex')),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent(),
        }));

        const response = await server.getLedgerEntries([ledgerKey]);

        if (!response.entries || response.entries.length === 0) {
            return [];
        }

        return response.entries.map(entry => {
            const data = entry.val.contractData();
            const key = parseXdrValue(data.key());
            const value = parseXdrValue(data.val());
            return {
                key: typeof key === 'object' ? JSON.stringify(key) : String(key),
                value: typeof value === 'object' ? JSON.stringify(value) : String(value),
            };
        });
    } catch (error) {
        console.error('Error fetching contract storage:', error);
        return [];
    }
}

export async function getContractDetails(contractId: string, server: Server) {
    try {
        const contractInstance = new Contract(contractId);
        const response = await server.getContractCode(contractId);

        return {
            id: contractId,
            wasmId: response.wasmId,
            ledgerFootprint: response.ledgerFootprint,
        };
    } catch (error) {
        console.error('Error fetching contract details:', error);
        return null;
    }
}

export async function simulateContractCall(
    contractId: string,
    method: string,
    params: ContractParam[],
    sourceAccount: string,
    server: Server,
    networkPassphrase: string,
) {
    try {
        const contract = new Contract(contractId);

        const xdrParams = params.map(parseContractParam);

        const account = await server.getAccount(sourceAccount);
        const transaction = new TransactionBuilder(account, {
            fee: '100',
            networkPassphrase,
        })
            .addOperation(
                Operation.invokeHostFunction({
                    func: xdr.HostFunction.hostFunctionTypeInvokeContract(
                        new xdr.InvokeContractArgs({
                            contractAddress: xdr.ScAddress.scAddressTypeContract(Buffer.from(contractId.slice(2), 'hex')),
                            functionName: method,
                            args: xdrParams,
                        })
                    ),
                    auth: [],
                })
            )
            .setTimeout(30)
            .build();

        const response = await server.simulateTransaction(transaction);

        if (response.results && response.results.length > 0) {
            const result = response.results[0];

            if (result.auth) {
                return {
                    success: true,
                    requiresAuth: true,
                    result: null,
                    logs: response.events || [],
                    cost: response.cost,
                    rawResult: result,
                };
            }

            if (result.xdr) {
                const parsed = parseXdrValue(xdr.ScVal.fromXDR(result.xdr, 'base64'));
                return {
                    success: true,
                    requiresAuth: false,
                    result: parsed,
                    logs: response.events || [],
                    cost: response.cost,
                    rawResult: result,
                };
            }
        }

        return {
            success: false,
            error: 'No results returned from simulation',
            logs: response.events || [],
            cost: response.cost,
        };
    } catch (error) {
        console.error('Error simulating contract call:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
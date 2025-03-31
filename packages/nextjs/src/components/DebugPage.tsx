// packages/nextjs/src/app/components/DebugPage.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContractDebug, ContractParam } from "@/context/ContractDebugContext";
import { Terminal, Play, Bug, Copy, RefreshCw, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { SOROBAN_NETWORKS } from "@/lib/soroban/utils";


export function DebugPage() {
    const {
        currentNetwork,
        setCurrentNetwork,
        contractId,
        setContractId,
        readMethods,
        writeMethods,
        debugLogs,
        clearDebugLogs,
        networkLogs,
        clearNetworkLogs,
        storageData,
        refreshStorageData,
        accountPublicKey,
        setAccountPublicKey,
        accountBalance,
        executeContractMethod,
        isLoading,
        executionResult,
    } = useContractDebug();

    const [mode, setMode] = useState<"read" | "write">("read");
    const [inputContract, setInputContract] = useState<string>("");
    const [inputAccount, setInputAccount] = useState<string>("");
    const [methodParams, setMethodParams] = useState<Record<string, Record<string, string>>>({});
    const [debugOutput, setDebugOutput] = useState<string>("");

    // Initialize methodParams object
    useEffect(() => {
        const params: Record<string, Record<string, string>> = {};

        readMethods.forEach(method => {
            params[method.name] = {};
            method.params.forEach(param => {
                params[method.name][param] = "";
            });
        });

        writeMethods.forEach(method => {
            params[method.name] = {};
            method.params.forEach(param => {
                params[method.name][param] = "";
            });
        });

        setMethodParams(params);
    }, [readMethods, writeMethods]);

    useEffect(() => {
        if (debugLogs.length > 0) {
            const formattedLogs = debugLogs.map(log => {
                const timestamp = log.timestamp.toLocaleTimeString();
                const prefix = `[${log.type.toUpperCase()}][${timestamp}]`;
                return `${prefix} ${log.message}`;
            }).join("\n");

            setDebugOutput(formattedLogs);
        } else {
            setDebugOutput("");
        }
    }, [debugLogs]);

    const handleConnectContract = () => {
        if (inputContract) {
            setContractId(inputContract);
            toast.success(`Connected to contract: ${inputContract}`);
        } else {
            toast.error("Please enter a contract ID");
        }
    };

    const handleConnectAccount = () => {
        if (inputAccount) {
            setAccountPublicKey(inputAccount);
            toast.success(`Connected to account: ${inputAccount}`);
        } else {
            toast.error("Please enter an account public key");
        }
    };

    const handleParamChange = (methodName: string, paramName: string, value: string) => {
        setMethodParams(prev => ({
            ...prev,
            [methodName]: {
                ...prev[methodName],
                [paramName]: value,
            },
        }));
    };

    // Handle method execution
    const handleExecuteMethod = async (methodName: string) => {
        const methodType = mode;
        const params: ContractParam[] = [];

        // Get the method definition from the appropriate list
        const methodDef = methodType === "read"
            ? readMethods.find(m => m.name === methodName)
            : writeMethods.find(m => m.name === methodName);

        if (!methodDef) {
            toast.error(`Method ${methodName} not found`);
            return;
        }

        // Collect the parameters
        methodDef.params.forEach(paramName => {
            const value = methodParams[methodName][paramName];

            // Convert value to appropriate type
            if (value.startsWith("0x")) {
                // Address parameter
                params.push(value);
            } else if (value === "true" || value === "false") {
                // Boolean parameter
                params.push(value === "true");
            } else if (!isNaN(Number(value)) && value !== "") {
                // Numeric parameter
                if (value.includes(".")) {
                    params.push(parseFloat(value));
                } else {
                    // Check if it fits in a regular number or needs bigint
                    const num = parseInt(value);
                    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
                        params.push(BigInt(value));
                    } else {
                        params.push(num);
                    }
                }
            } else if (value.startsWith("{") && value.endsWith("}")) {
                // JSON object parameter
                try {
                    params.push(JSON.parse(value));
                } catch (e) {
                    toast.error(`Invalid JSON in parameter ${paramName}`);
                    return;
                }
            } else if (value.startsWith("[") && value.endsWith("]")) {
                // JSON array parameter
                try {
                    params.push(JSON.parse(value));
                } catch (e) {
                    toast.error(`Invalid JSON in parameter ${paramName}`);
                    return;
                }
            } else {
                // String parameter
                params.push(value);
            }
        });

        // Execute the method
        await executeContractMethod(methodName, params, methodType);
    };

    // Handle copying to clipboard
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(debugOutput || "[DEBUG] No output to copy.");
            toast.success("Debug output copied!");
        } catch (error) {
            toast.error("Failed to copy debug output!");
        }
    };

    // Format network log entry
    const formatNetworkLog = (log: any) => {
        const timestamp = log.timestamp.toLocaleTimeString();
        const direction = log.direction === 'request' ? '→' : '←';
        const status = log.status ? ` (${log.status})` : '';
        return `[${timestamp}] ${direction} ${log.message}${status}`;
    };

    // Format execution result for display
    const formatExecutionResult = () => {
        if (!executionResult) return null;

        if (executionResult.error) {
            return (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 font-semibold">Error</p>
                    <p className="font-mono text-sm">{executionResult.error}</p>
                </div>
            );
        }

        return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 font-semibold">Result</p>
                <pre className="font-mono text-sm overflow-auto max-h-40">
                    {typeof executionResult.result === 'object'
                        ? JSON.stringify(executionResult.result, null, 2)
                        : String(executionResult.result)}
                </pre>
                {executionResult.cost && (
                    <div className="mt-2 text-xs text-gray-500">
                        <p>Transaction Cost: {executionResult.cost.cpuInsns} CPU instructions</p>
                        <p>Memory: {executionResult.cost.memBytes} bytes</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Network Selection */}
                <div className="flex space-x-3 mb-6">
                    {Object.entries(SOROBAN_NETWORKS).map(([name, network]) => (
                        <Button
                            key={name}
                            variant={currentNetwork.networkName === network.networkName ? "default" : "outline"}
                            onClick={() => setCurrentNetwork(network)}
                        >
                            {network.networkName}
                        </Button>
                    ))}
                </div>

                {/* Connection Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter Contract ID"
                            value={inputContract}
                            onChange={(e) => setInputContract(e.target.value)}
                        />
                        <Button onClick={handleConnectContract}>
                            Connect Contract
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter Account Public Key"
                            value={inputAccount}
                            onChange={(e) => setInputAccount(e.target.value)}
                        />
                        <Button onClick={handleConnectAccount}>
                            Connect Account
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    {/* Contract Info Panel */}
                    <div className="col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <p className="text-xl font-semibold">Account Balance</p>
                                    <p className="text-2xl font-bold">{accountBalance} XLM</p>
                                </div>
                                <div className="text-center border-t pt-4">
                                    <p className="text-sm text-gray-500">Connected Network:</p>
                                    <p className="text-lg font-semibold">{currentNetwork.networkName}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Contract ID</p>
                                    <p className="text-sm font-mono text-gray-900 break-all">{contractId || "Not connected"}</p>
                                </div>
                                {contractId && (
                                    <>
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-500">Contract Details</p>
                                            {contractDetails ? (
                                                <div className="space-y-2 mt-2">
                                                    <p className="text-xs font-mono">WASM ID: {contractDetails.wasmId}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm">Loading details...</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contract Methods Panel */}
                    <div className="col-span-4">
                        <div className="flex justify-between p-2 border border-black rounded-lg mb-6">
                            {["read", "write"].map((m) => (
                                <Button
                                    key={m}
                                    className="flex-1"
                                    variant={mode === m ? "default" : "outline"}
                                    onClick={() => setMode(m as "read" | "write")}
                                >
                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                </Button>
                            ))}
                        </div>

                        <Card>
                            <CardContent className="p-4">
                                {(mode === "read" ? readMethods : writeMethods).map(
                                    (method, index) => (
                                        <div key={index} className="pb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {method.name}
                                            </h3>
                                            <div className="space-y-3">
                                                {method.params.map((param, paramIndex) => (
                                                    <div key={paramIndex}>
                                                        <label className="block text-sm text-gray-600 mb-1">
                                                            {param}
                                                        </label>
                                                        <Input
                                                            placeholder={`Enter ${param}`}
                                                            value={methodParams[method.name]?.[param] || ""}
                                                            onChange={(e) => handleParamChange(method.name, param, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-3">
                                                <Button
                                                    variant="default"
                                                    disabled={isLoading || !contractId || !accountPublicKey}
                                                    onClick={() => handleExecuteMethod(method.name)}
                                                >
                                                    {isLoading ? "Processing..." : mode === "read" ? "Read" : "Execute"}
                                                </Button>
                                            </div>
                                            {executionResult &&
                                                index === (mode === "read" ? readMethods : writeMethods)
                                                    .findIndex(m => m.name === method.name) && (
                                                    <div className="mt-4">
                                                        {formatExecutionResult()}
                                                    </div>
                                                )}
                                            {index !==
                                                (mode === "read" ? readMethods : writeMethods).length -
                                                1 && (
                                                    <div className="w-full h-[1px] bg-black mt-4"></div>
                                                )}
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Debug Console */}
                <div className="mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <Tabs defaultValue="console" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="console">Console</TabsTrigger>
                                    <TabsTrigger value="network">Network</TabsTrigger>
                                    <TabsTrigger value="storage">Storage</TabsTrigger>
                                </TabsList>

                                {/* Console Tab */}
                                <TabsContent value="console" className="space-y-4">
                                    <div className="rounded-md bg-muted p-4 relative">
                                        <SyntaxHighlighter language="bash" style={materialDark} className="text-sm">
                                            {debugOutput || "// Debug output will appear here"}
                                        </SyntaxHighlighter>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-2 right-2"
                                            onClick={handleCopyToClipboard}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button size="sm" variant="outline" onClick={clearDebugLogs}>
                                            <X className="mr-2 h-4 w-4" />
                                            Clear Console
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Network Tab */}
                                <TabsContent value="network">
                                    <div className="rounded-md bg-muted p-4">
                                        <h3 className="text-lg font-semibold">Network Logs</h3>
                                        <pre className="text-sm mt-2 max-h-60 overflow-auto">
                                            {networkLogs.length > 0
                                                ? networkLogs.map(log => formatNetworkLog(log)).join("\n")
                                                : "[INFO] No network activity yet."}
                                        </pre>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <Button size="sm" variant="outline" onClick={clearNetworkLogs}>
                                            <X className="mr-2 h-4 w-4" />
                                            Clear Network Logs
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Storage Tab */}
                                <TabsContent value="storage">
                                    <div className="rounded-md bg-muted p-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Storage Data</h3>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={refreshStorageData}
                                                disabled={!contractId || isLoading}
                                            >
                                                <Refresh className="mr-2 h-4 w-4" />
                                                Refresh
                                            </Button>
                                        </div>
                                        {storageData.length > 0 ? (
                                            <ul className="mt-4 space-y-2 max-h-60 overflow-auto">
                                                {storageData.map(({ key, value }, index) => (
                                                    <li key={index} className="flex justify-between border-b pb-2">
                                                        <span className="font-mono text-sm break-all">{key}</span>
                                                        <span className="text-sm ml-4 text-right break-all">{value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-4 text-sm text-gray-500">
                                                {contractId
                                                    ? "No storage data available or contract not found"
                                                    : "Connect to a contract to view storage data"}
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Play, Bug, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import Link from "next/link";

export function DebugContracts() {
  const [debugOutput, setDebugOutput] = useState<string>("");
  const [networkLogs, setNetworkLogs] = useState<string[]>([]);
  const [storageData, setStorageData] = useState<
    { key: string; value: string }[]
  >([
    { key: "contract_owner", value: "0x123..." },
    { key: "balance", value: "1000 XLM" },
  ]);

  const handleRun = () => {
    setDebugOutput(
      `[INFO] Running contract...\n[SUCCESS] Contract executed successfully.`
    );
    setNetworkLogs((prev) => [
      ...prev,
      `[REQUEST] Contract execution started`,
      `[RESPONSE] Success (200)`,
    ]);
  };

  const handleDebug = () => {
    setDebugOutput(
      `[DEBUG] Debugging contract...\n[ERROR] Stack trace:\n - Function: execute()\n - Line: 42`
    );
    setNetworkLogs((prev) => [
      ...prev,
      `[REQUEST] Debugging contract`,
      `[RESPONSE] Error (500)`,
    ]);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        debugOutput || "[DEBUG] No output to copy."
      );
      toast.success("Code copied!!");
    } catch (error) {
      toast.error("Copying code failed!!");
    }
  };

  return (
    <section className="container py-16 lg:py-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Debug with Confidence
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Powerful debugging tools to help you build and test smart contracts.
        </p>
        <div className="mt-5">
          <Link href="/debug" className="outline-none border-none">
            <Button variant="outline" size="lg">
              <Bug className="mr-2 h-4 w-4" />
              Start debugging
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contract Debugger</CardTitle>
          <CardDescription>
            Inspect and debug your smart contracts in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="console" className="w-full">
            <TabsList>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>

            {/* Console Tab */}
            <TabsContent value="console" className="space-y-4">
              <div className="rounded-md bg-muted p-4 relative">
                <SyntaxHighlighter
                  language="rust"
                  style={materialDark}
                  className="text-sm"
                >
                  {debugOutput ||
                    `// Example contract debugging output\n[DEBUG] Initializing contract...\n[INFO] Contract deployed at: 0x123...\n[DEBUG] Processing transaction...\n[SUCCESS] Transaction completed`}
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
                <Button size="sm" onClick={handleRun}>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </Button>
                <Button size="sm" variant="secondary" onClick={handleDebug}>
                  <Bug className="mr-2 h-4 w-4" />
                  Debug
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDebugOutput("")}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </TabsContent>

            {/* Network Monitoring Tab */}
            <TabsContent value="network">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold">Network Logs</h3>
                <pre className="text-sm mt-2">
                  {networkLogs.length > 0
                    ? networkLogs.join("\n")
                    : "[INFO] No network activity yet."}
                </pre>
              </div>
            </TabsContent>

            {/* Storage Inspector Tab */}
            <TabsContent value="storage">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold">Storage Data</h3>
                <ul className="mt-2 space-y-2">
                  {storageData.map(({ key, value }) => (
                    <li key={key} className="flex justify-between">
                      <span className="font-mono text-sm">{key}</span>
                      <span className="text-sm">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}

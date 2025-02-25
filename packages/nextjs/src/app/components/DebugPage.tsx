"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Utility for conditional class merging

type Mode = "read" | "write";
type Token = "ETH" | "STRK";

export function DebugPage() {
  const [mode, setMode] = useState<Mode>("read");
  const [token, setToken] = useState<Token>("ETH");

  const readMethods = [
    { name: "balance_of", params: ["account"] },
    { name: "allowance", params: ["owner", "spender"] },
    { name: "balanceOf", params: ["account"] },
  ];

  const writeMethods = [
    { name: "transfer", params: ["recipient", "amount"] },
    { name: "approve", params: ["spender", "amount"] },
    { name: "transferFrom", params: ["sender", "recipient", "amount"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Token Switcher */}
        <div className="flex space-x-3 mb-4">
          {["ETH", "STRK"].map((t) => (
            <Button
              key={t}
              variant={token === t ? "default" : "outline"}
              onClick={() => setToken(t as Token)}
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Contract Info Panel */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✔️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">0x0471...9338D</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">
                        Balance: 0.2281 {token}
                      </p>
                      {token === "ETH" && (
                        <p className="text-sm text-gray-500">388.9996 STRK</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Network: Starknet Sepolia testnet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                {[
                  { label: "name", value: "0x53746172726b6e657420546f6b656e" },
                  { label: "symbol", value: "0x5354524b" },
                  { label: "decimals", value: "18" },
                  {
                    label: "totalSupply",
                    value: "443309.56638079884268519472",
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-sm font-mono text-gray-900">{value}</p>
                  </div>
                ))}
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
                  onClick={() => setMode(m as Mode)}
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
                            <Input placeholder={`Enter ${param}`} />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="default">
                          {mode === "read" ? "Read" : "Execute"}
                        </Button>
                      </div>
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
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";

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
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => setToken("ETH")}
            className={`px-4 py-2 border border-black rounded-full text-sm font-medium transition-colors ${
              token === "ETH"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ETH
          </button>
          <button
            onClick={() => setToken("STRK")}
            className={`px-4 py-2 border border-black rounded-full text-sm font-medium transition-colors ${
              token === "STRK"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            STRK
          </button>
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Contract Info Panel */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white border border-black rounded-lg shadow-sm p-6">
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
            </div>

            <div className="bg-white border border-black rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">name</p>
                  <p className="text-sm font-mono text-gray-900">
                    0x53746172726b6e657420546f6b656e
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">symbol</p>
                  <p className="text-sm font-mono text-gray-900">0x5354524b</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">decimals</p>
                  <p className="text-sm text-gray-900">18</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">totalSupply</p>
                  <p className="text-sm font-mono text-gray-900">
                    443309.56638079884268519472
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Methods Panel */}
          <div className="col-span-4">
            <div className="flex justify-between space-x-2 p-2 border border-black rounded-lg mb-6">
              <button
                onClick={() => setMode("read")}
                className={`px-10 flex-1 rounded-lg text-sm font-medium transition-colors ${
                  mode === "read"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setMode("write")}
                className={`px-6 flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === "write"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Write
              </button>
            </div>
            <div className="bg-white border border-black rounded-lg shadow-sm">
              <div className="p-4 ">
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
                            <input
                              type="text"
                              placeholder={`Enter ${param}`}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <button className="bg-black hover:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors">
                          {mode === "read" ? "Read" : "Execute"}
                        </button>
                      </div>
                      {index !==
                        (mode === "read" ? readMethods : writeMethods).length -
                          1 && (
                        <div className="w-full h-[1px] bg-black mt-4"></div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

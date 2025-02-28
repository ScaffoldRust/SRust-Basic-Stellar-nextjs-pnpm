"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export function WalletConnectButton() {
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    walletAddress, 
    walletName,
    isConnecting 
  } = useWallet();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setErrorMessage(null);
    const result = await connectWallet();
    if (!result.success && result.error) {
      setErrorMessage(result.error);
      console.error(result.error);
    }
  };

  const handleDisconnect = async () => {
    setErrorMessage(null);
    const result = await disconnectWallet();
    if (!result.success && result.error) {
      setErrorMessage(result.error);
      console.error(result.error);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="text-xs gap-2"
          onClick={handleDisconnect}
        >
          <span>{truncateAddress(walletAddress)}</span>
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isConnecting}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}

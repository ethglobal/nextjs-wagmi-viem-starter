"use client";

import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";

export default function Wallet() {
  const [copied, setCopied] = React.useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="max-w-2xl flex flex-col gap-2 mx-auto p-48">
      <h2 className="text-xl font-bold text-center">Connect your wallet</h2>
      {address && (
        <div className="my-4">
          <pre className="bg-gray-200 rounded text-xs p-2">{`${address.slice(
            0,
            16
          )}...${address.slice(address.length - 16, address.length)}`}</pre>
          <div className="flex justify-between mt-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={copied}
              onClick={() => {
                navigator.clipboard.writeText(address);
                setCopied(true);

                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </Button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}

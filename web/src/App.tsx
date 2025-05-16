import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clusterApiUrl, Cluster } from '@solana/web3.js';
import { LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { solanaNetwork, solanaRpcUrl } from '@/constants';
import '@solana/wallet-adapter-react-ui/styles.css';

import InnerApp from './InnerApp';

const queryClient = new QueryClient();

export default function App() {
  let endpoint: any;
  if (solanaNetwork === 'localnet') {
    endpoint = 'http://localhost:8899'
  } else if (solanaNetwork === 'custom') {
    endpoint = solanaRpcUrl
  } else {
    endpoint = clusterApiUrl(solanaNetwork as Cluster)
  }

  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new TorusWalletAdapter(),
          new LedgerWalletAdapter(),
      ],
      [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <InnerApp />
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

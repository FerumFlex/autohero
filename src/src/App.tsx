import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { clusterApiUrl, Cluster } from '@solana/web3.js';
import { LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { HeroStoreContext } from './store/context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

// pages
import { HomePage } from './pages/Home.page';
import { FaqPage } from './pages/Faq.page';
import { AboutPage } from './pages/About.page';

import '@solana/wallet-adapter-react-ui/styles.css';
import { HeroStore } from '@/store/Hero';
import { Layout } from '@/pages/Layout';
import { NotFoundImage } from '@/components/NotFound/NotFound';
import { solanaNetwork } from '@/constants';

let heroStore = new HeroStore();
const queryClient = new QueryClient()

export default function App() {
  // initialise all the wallets you want to use
  const endpoint = clusterApiUrl(solanaNetwork as Cluster)
  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new TorusWalletAdapter(),
          new LedgerWalletAdapter(),
      ],
      [endpoint],
  );

  setInterval(() => {
    heroStore.loadInfo();
  }, 5000);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFoundImage />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/faq',
          element: <FaqPage />,
        },
        {
          path: '/about',
          element: <AboutPage />,
        },
      ]
    }
  ]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <HeroStoreContext.Provider value={heroStore}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
              </QueryClientProvider>
            </HeroStoreContext.Provider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MantineProvider>
  );
}


import { Layout } from "@/components/layout/Layout";
import { HeroSelection } from "@/components/heroes/HeroSelection";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';


const HeroesPage = () => {
  const { publicKey } = useWallet();

  return (
    <Layout showSidebar={false}>
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-fantasy-light mb-6">Hero Selection</h1>
        {publicKey ? (
          <>
            <p className="text-fantasy-light/80 mb-8">
              Select one of your existing heroes to continue your adventure, or create a new one.
            </p>
            <HeroSelection />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-fantasy-light/80 mb-4">
              Please connect your wallet to view your heroes.
            </div>
            <WalletMultiButton />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HeroesPage;

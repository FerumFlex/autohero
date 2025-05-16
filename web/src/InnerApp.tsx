import { useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { HeroStoreContext } from '@/store/context';

import StorylinePage from "./pages/StorylinePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CharacterCreationPage from "./pages/CharacterCreationPage";
import NotFound from "./pages/NotFound";
import JourneyPage from "./pages/Journey";
import HeroesPage from "./pages/HeroesPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import { runInAction } from "mobx";


export default function InnerApp() {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const heroStore = useContext(HeroStoreContext);

  useEffect(() => {
    async function loadInfo() {
      if (!connection || !wallet) {
        return;
      }

      await heroStore.setConnectionParams(connection, wallet);
      heroStore.loadHero();
      await heroStore.loadInfo();

      const slot = await connection.getSlot();
      setBlockNumber(slot);
      heroStore.setCurrentUnixTimestamp();
    };
    loadInfo();
  },
    [connection, wallet, heroStore]
  );

  useEffect(() => {
    let isRunning = false;

    const interval = setInterval(() => {
      if (isRunning) return;
      isRunning = true;

      (async () => {
        try {
          runInAction(async () => {
            await heroStore.loadInfo();
            heroStore.setCurrentUnixTimestamp();
          });
          const slot = await connection.getSlot();
          setBlockNumber(slot);
        } finally {
          isRunning = false;
        }
      })();
    }, 10000);

    return () => clearInterval(interval);
  }, [connection, heroStore]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JourneyPage />} />
          <Route path="/profile/heroes" element={<HeroesPage />} />
          <Route path="/storyline" element={<StorylinePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/create-character" element={<CharacterCreationPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
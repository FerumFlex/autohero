import React from "react";

import { Layout } from "@/components/layout/Layout";


const TermsOfService = () => {
  return (
    <Layout showSidebar={false}>
      <div className="max-w-4xl mx-auto p-6 text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

        <p className="mb-4 text-sm text-gray-400">Last updated: May 9, 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AutoHeroRPG (“the Game”, “we”, “our”), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Description of the Game</h2>
          <p>
            AutoHeroRPG is a blockchain-based game where users mint and own unique NFT-based heroes and participate in AI-generated events. Player progress, rewards, and stats are stored on the Solana blockchain.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Eligibility</h2>
          <p>
            You must be at least 18 years old and legally capable of entering into a binding agreement in your jurisdiction to use AutoHeroRPG.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Blockchain & NFTs</h2>
          <p>
            All in-game assets such as heroes, artifacts, and rewards are minted as NFTs on the Solana blockchain. You are responsible for securing your wallet and private keys. We do not store or control your assets.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. AI-Generated Content</h2>
          <p>
            Game events and narratives are generated using AI and are provided for entertainment purposes only. We make no guarantees regarding accuracy, fairness, or outcomes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Rewards and Earnings</h2>
          <p>
            Players may receive tokens, NFTs, or other rewards for successful participation. These may carry real-world value but are not guaranteed. AutoHeroRPG is not an investment platform and does not promise returns.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Prohibited Conduct</h2>
          <ul className="list-disc ml-6">
            <li>Attempting to exploit or manipulate smart contracts or AI systems</li>
            <li>Using bots or automation not approved by the game</li>
            <li>Engaging in illegal, harmful, or fraudulent activity</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to AutoHeroRPG for any reason, including breach of these terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
          <p>
            These Terms may be updated from time to time. Continued use of the Game after changes are made constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
          <p>
            For questions or concerns, please contact us at <a href="mailto:support@autoherorpg.com" className="text-blue-400">support@autoherorpg.com</a>.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default TermsOfService;

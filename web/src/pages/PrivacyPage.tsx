import React from "react";

import { Layout } from "@/components/layout/Layout";

const PrivacyPage = () => {
  return (
    <Layout showSidebar={false}>
      <div className="max-w-4xl mx-auto p-6 text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p className="mb-4 text-sm text-gray-400">Last updated: May 9, 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            AutoHeroRPG (“we”, “our”, or “the Game”) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li><strong>Wallet Address:</strong> When you connect your wallet, we collect your public wallet address.</li>
            <li><strong>On-Chain Activity:</strong> We may analyze activity associated with your wallet (e.g., NFT ownership, transactions).</li>
            <li><strong>Gameplay Data:</strong> In-game actions, event participation, and rewards earned are logged for game progression and analytics.</li>
            <li><strong>Device Info:</strong> Basic device/browser metadata may be collected to improve performance and security.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc ml-6">
            <li>To provide and maintain the Game</li>
            <li>To display your NFT heroes and assets</li>
            <li>To generate personalized or eligible AI events</li>
            <li>To prevent fraud, exploits, or abuse</li>
            <li>To analyze usage trends and improve gameplay</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Cookies & Local Storage</h2>
          <p>
            We may use cookies or local storage to remember preferences, session state, and UI settings. We do not track users across other websites.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
          <p>
            We may use third-party services (e.g., analytics providers, blockchain explorers) to support functionality. These services may collect data in accordance with their own privacy policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
          <p>
            We take reasonable measures to protect your data. However, as we do not control the blockchain or your wallet, you are responsible for securing your private keys and wallet access.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
          <p>
            AutoHeroRPG is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from minors.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have questions or concerns about your privacy, please contact us at{" "}
            <a href="mailto:privacy@autoherorpg.com" className="text-blue-400">
              privacy@autoherorpg.com
            </a>.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyPage;

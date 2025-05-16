
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CharacterSidebar } from "./CharacterSidebar";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-fantasy-dark">
      <Header />

      <div className="flex-grow flex">
        {showSidebar && <CharacterSidebar />}

        <main className="flex-grow py-6 px-4 overflow-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

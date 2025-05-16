import { useContext } from 'react';
import { HeroStoreContext } from '@/store/context';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export function Footer() {
  const heroStore = useContext(HeroStoreContext);

  return (
    <footer className="border-t border-fantasy-cosmic/30 py-6 bg-fantasy-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-fantasy-primary">
              AutoHero<span className="text-solana-secondary">RPG</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              AI-Powered RPG Game Master on Solana
            </p>
          </div>

          <div className="flex space-x-8">
            <div>
              <h4 className="text-sm font-medium text-solana-secondary mb-2">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-fantasy-primary">Documentation</Link></li>
                <li><Link to="/support" className="text-sm text-muted-foreground hover:text-fantasy-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-solana-secondary mb-2">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-fantasy-primary">Terms</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-fantasy-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-fantasy-cosmic/20">
          <p className="text-xs text-muted-foreground mb-2 md:mb-0">
            © 2025 AutoHero. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-fantasy-primary"
            >
              <Github size={18} />
            </a>
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-solana-secondary mr-1"></div>
              <span className="text-xs text-muted-foreground">Solana Network: Connected</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

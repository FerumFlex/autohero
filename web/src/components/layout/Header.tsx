
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Shield, Trophy, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatAddressShort } from '@/utils';


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { publicKey } = useWallet();

  return (
    <header className="sticky top-0 z-50 py-4 border-b border-fantasy-cosmic/30 backdrop-blur-md bg-fantasy-dark/80">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-fantasy-primary mr-2 hover:text-fantasy-light transition">
            AutoHero<span className="text-solana-secondary">RPG</span>
          </Link>
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-solana-primary to-solana-secondary animate-pulse-glow" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" label="Home" currentPath={location.pathname} />
          <NavLink to="/storyline" label="Storyline" currentPath={location.pathname} />
          <NavLink to="/create-character" label="Create Character" currentPath={location.pathname} />
          <NavLink to="/profile/heroes" label="Heroes" currentPath={location.pathname} />
          <NavLink to="/leaderboard" label="Leaderboard" currentPath={location.pathname} />
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <WalletMultiButton />
            {publicKey && (
              <UserMenu />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md text-fantasy-light"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-fantasy-dark border-b border-fantasy-cosmic/30">
          <div className="container mx-auto py-4 space-y-4">
            <MobileNavLink to="/" label="Home" icon={<Shield size={18} />} currentPath={location.pathname} />
            <MobileNavLink to="/storyline" label="Storyline" icon={<Shield size={18} />} currentPath={location.pathname} />
            <MobileNavLink to="/create-character" label="Create Character" icon={<User size={18} />} currentPath={location.pathname} />
            <MobileNavLink to="/heroes" label="Heroes" icon={<User size={18} />} currentPath={location.pathname} />
            <MobileNavLink to="/leaderboard" label="Leaderboard" icon={<Trophy size={18} />} currentPath={location.pathname} />
            <div className="pt-2 border-t border-fantasy-cosmic/20">
              <WalletMultiButton />
              {publicKey && (
                <UserMenu mobile />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, currentPath }: { to: string; label: string; currentPath: string }) {
  const isActive = currentPath === to;

  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors ${
        isActive
          ? "text-fantasy-primary"
          : "text-fantasy-light hover:text-fantasy-primary"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-fantasy-primary to-solana-secondary" />
      )}
    </Link>
  );
}

function MobileNavLink({ to, label, icon, currentPath }: { to: string; label: string; icon: React.ReactNode; currentPath: string }) {
  const isActive = currentPath === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-2 py-3 rounded-md ${
        isActive
          ? "bg-fantasy-cosmic/20 text-fantasy-primary"
          : "text-fantasy-light hover:bg-fantasy-cosmic/10"
      }`}
    >
      <span className={isActive ? "text-solana-secondary" : "text-fantasy-primary"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const { publicKey } = useWallet();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full ${mobile ? 'w-full justify-between mt-2 text-left' : ''}`}>
          {mobile ? (
            <>
              <span className="flex items-center">
                <User size={18} className="mr-2" />
                <span>{formatAddressShort(publicKey?.toBase58())}</span>
              </span>
              <span>▼</span>
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-fantasy-cosmic border-2 border-fantasy-primary flex items-center justify-center overflow-hidden">
              <User size={16} />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-fantasy-dark border-fantasy-cosmic">
        <DropdownMenuLabel className="text-fantasy-light">{formatAddressShort(publicKey?.toBase58())}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-fantasy-cosmic/30" />
        {/* <DropdownMenuItem className="text-fantasy-light hover:text-fantasy-primary hover:bg-fantasy-cosmic/20">
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-fantasy-light hover:text-fantasy-primary hover:bg-fantasy-cosmic/20">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem> */}
        <DropdownMenuSeparator className="bg-fantasy-cosmic/30" />
        <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

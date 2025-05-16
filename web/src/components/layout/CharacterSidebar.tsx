import { useContext, useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Sword, Heart, Zap, Flame, Crown } from "lucide-react";
import { HeroStoreContext } from '@/store/context';
import { capitalize } from '@/utils';
import { useConnection } from "@solana/wallet-adapter-react";
import { tokenId } from "@/constants";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Signer } from "@solana/web3.js";

// Mock character data
const character = {
  name: "Elyndra Nightsong",
  level: 23,
  experience: 78,
  class: "Shadow Mage",
  race: "Moon Elf",
  tokens: 642,
  stats: {
    strength: 14,
    dexterity: 18,
    constitution: 12,
    intelligence: 19,
    wisdom: 15,
    charisma: 16
  },
  buffs: [
    { id: 1, name: "Arcane Intellect", icon: <Zap size={16} />, duration: "2h" },
    { id: 2, name: "Fire Shield", icon: <Flame size={16} />, duration: "45m" }
  ],
  equipment: [
    { id: 1, name: "Shadowweave Robe", slot: "Chest", rarity: "Epic" },
    { id: 2, name: "Circlet of Focus", slot: "Head", rarity: "Rare" },
    { id: 3, name: "Boots of Haste", slot: "Feet", rarity: "Uncommon" }
  ]
};

// Stat mapping
const statIcons = {
  attack: <Sword className="h-4 w-4 text-red-400" />,
  defense: <Zap className="h-4 w-4 text-green-400" />,
  constitution: <Heart className="h-4 w-4 text-pink-400" />,
  intelligence: <Zap className="h-4 w-4 text-blue-400" />,
  wisdom: <Crown className="h-4 w-4 text-yellow-400" />,
  charisma: <Crown className="h-4 w-4 text-purple-400" />
};

export function CharacterSidebar() {
  const heroStore = useContext(HeroStoreContext);
  const [tokenBalance, setTokenBalance] = useState(0);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  async function getTokenBalanceWeb3(connection, tokenAccount) {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error('No balance found');
    return info.value.uiAmount;
  }

  const getHealthBarColor = (hitpointsPercentage: number) => {
    if (hitpointsPercentage > 66) return "from-green-500 to-green-400";
    if (hitpointsPercentage > 33) return "from-yellow-500 to-orange-400";
    return "from-red-600 to-red-500";
  };

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (connection && wallet) {
        const ata = await getOrCreateAssociatedTokenAccount(
          connection,
          wallet as unknown as Signer,
          tokenId,
          wallet.publicKey
        );

        try {
          const balance = await getTokenBalanceWeb3(connection, ata.address);
          setTokenBalance(balance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };
    fetchTokenBalance();
  }, [connection, wallet]);

  return (
    <>
      {heroStore.isReady && (
        <div className="h-full flex flex-col bg-fantasy-cosmic/30 border-r border-fantasy-cosmic/30 w-80">
          {/* Character Header */}
          <div className="p-4 text-center border-b border-fantasy-cosmic/30">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-fantasy-primary to-fantasy-cosmic border-2 border-fantasy-gold flex items-center justify-center overflow-hidden">
              {/* This would be your character avatar */}
              <span className="text-3xl">🧙</span>
            </div>

            <h2 className="text-xl font-bold text-white">{heroStore.name}</h2>
            <div className="flex justify-center items-center space-x-2 mt-1">
              <span className="text-fantasy-light text-sm">{capitalize(heroStore.race)}</span>
            </div>
          </div>

        {/* Hitpoints */}
        <div className="p-4 border-b border-fantasy-cosmic/30">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-fantasy-light">Hitpoints</span>
            </div>
            <span className="text-sm text-fantasy-light">{heroStore.hitpoints} / {heroStore.maxHitpoints}</span>
          </div>
          <Progress
            value={heroStore.hitpointsPercentage}
            className={`h-2.5 bg-fantasy-cosmic/50 [&>div]:bg-gradient-to-r ${getHealthBarColor(heroStore.hitpointsPercentage)}`}
            style={{
              ['--tw-gradient-from']: undefined,
              ['--tw-gradient-to']: undefined
            }}
          >
            <div className={`h-full rounded-md bg-gradient-to-r`}
                style={{width: `${heroStore.hitpointsPercentage}%`}} />
          </Progress>
        </div>
          {/* Level & Experience */}
          <div className="p-4 border-b border-fantasy-cosmic/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-fantasy-light">Level {heroStore.levelInt}</span>
              <span className="text-sm text-fantasy-light">{heroStore.percent}%</span>
            </div>
            <Progress value={heroStore.percent} className="h-2 bg-fantasy-cosmic [&>div]:bg-gradient-to-r [&>div]:from-fantasy-primary [&>div]:to-solana-primary" />

            {/* Tokens */}
            <div className="mt-4 bg-gradient-to-r from-solana-primary/20 to-solana-secondary/20 rounded-md p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-fantasy-light">RPG Tokens</span>
              <span className="text-sm font-bold text-solana-secondary">{tokenBalance} RPG</span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-fantasy-cosmic/30">
            <h3 className="text-sm font-medium text-fantasy-light mb-3">Character Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(heroStore.stats).map(([stat, value]) => (
                <div
                  key={stat}
                  className="flex items-center bg-fantasy-cosmic/20 p-2 rounded-md"
                >
                  <span className="mr-2">{statIcons[stat as keyof typeof statIcons]}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-fantasy-light capitalize">{stat}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buffs & Debuffs */}
          {/* <div className="p-4 border-b border-fantasy-cosmic/30">
            <h3 className="text-sm font-medium text-fantasy-light mb-3">Active Effects</h3>
            <div className="flex flex-wrap gap-2">
              {character.buffs.map(buff => (
                <TooltipProvider key={buff.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="h-10 w-10 rounded-md bg-gradient-to-br from-fantasy-cosmic to-fantasy-primary/40 flex items-center justify-center border border-fantasy-primary/30 animate-pulse-glow">
                        {buff.icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div>
                        <p className="font-medium">{buff.name}</p>
                        <p className="text-xs text-muted-foreground">Duration: {buff.duration}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div> */}

          {/* Equipment */}
          {/* <div className="p-4 flex-grow overflow-auto">
            <h3 className="text-sm font-medium text-fantasy-light mb-3">Equipment</h3>
            <div className="space-y-3">
              {character.equipment.map(item => (
                <div key={item.id} className="bg-fantasy-cosmic/20 p-3 rounded-md border border-fantasy-cosmic/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-fantasy-cosmic flex items-center justify-center mr-3">
                        <Shield size={16} className="text-fantasy-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.slot}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityClass(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}

// Utility function for rarity colors
function getRarityClass(rarity: string) {
  switch(rarity.toLowerCase()) {
    case 'common': return 'bg-gray-600/30 text-gray-300';
    case 'uncommon': return 'bg-green-600/30 text-green-300';
    case 'rare': return 'bg-blue-600/30 text-blue-300';
    case 'epic': return 'bg-purple-600/30 text-purple-300';
    case 'legendary': return 'bg-amber-600/30 text-amber-300';
    default: return 'bg-gray-600/30 text-gray-300';
  }
}

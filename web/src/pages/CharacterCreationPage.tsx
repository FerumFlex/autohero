
import { useState, useContext } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import type { Autohero } from "@/types/autohero";
import IDL from "@/idl/autohero.json";
import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { HeroStoreContext } from "@/store/context";
import { toast } from '@/components/ui/sonner';
import { solanaTxLink } from "@/utils";
import apiInstance from '@/API';
import { useNavigate } from 'react-router-dom';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { races, racesMap } from '@/constants';

const names = [
  // Human
  "Elysia Dawnshield",
  "Aelric the Brave",
  "Elara Swiftblade",
  "Thalion Swiftblade",
  "Elysia Steelheart",

  // Elf
  "Elandor Starwhisper",
  "Elandor the Swift",
  "Arannis Silverleaf",
  "Elandriel Moonshade",

  // Dwarf
  "Thrain Stonebreaker",
  "Thrain Stoneheart",
  "Brom Ironclad",
  "Throgar Ironfist",
  "Grom Ironfist",

  // Orc
  "Grulk Ironfist",
  "Grulak the Berserker",
  "Grom Ironforge",
  "Grom Thunderfist",
  "Gromthar Ironfist",

  // Dragon
  "Ignis Stormwing",
  "Emberwing the Fiery",
  "Emberwing the Flameborne",
  "Drakon Thornspire",
  "Aelthir Firewing",
]

function generateRandomUint64() {
  return new BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));;
}

export default function CharacterCreationPage() {
  const [name, setName] = useState(names[Math.floor(Math.random() * names.length)]);
  const [race, setRace] = useState(races[Math.floor(Math.random() * races.length)].value);
  const [isCreatingHero, setIsCreatingHero] = useState(false);
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const navigate = useNavigate();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  const program = new Program(IDL as Autohero, provider);
  const heroStore = useContext(HeroStoreContext);

  const onCreateHero = async () => {
    setIsCreatingHero(true);
    try {
      const heroNFT = web3.Keypair.generate();
      const seed = generateRandomUint64();

      // Derive the associated token address account for the mint and payer.
      const associatedTokenAccountAddress = getAssociatedTokenAddressSync(heroNFT.publicKey, wallet.publicKey);
      console.log("associatedTokenAccountAddress: ", associatedTokenAccountAddress.toString());

      const tx = await program.methods.mintNft(name, seed, race)
        .accounts({
          payer: wallet.publicKey,
          mintAccount: heroNFT.publicKey,
          associatedTokenAccount: associatedTokenAccountAddress
        })
        .signers([heroNFT])
        .rpc();

      console.log("Your transaction signature", tx);
      console.log("creating heroNFT: ", heroNFT.publicKey.toString());
      heroStore.setHeroAddress(heroNFT.publicKey.toString());

      toast.success(
        <div>
          Character ${name} created successfully, <a href={solanaTxLink(tx)} target="_blank">View transaction</a>
        </div>
      );

      await apiInstance.createHero(tx);

      navigate('/storyline');
    } finally {
      setIsCreatingHero(false)
    }
  }

  const onGenerateHeroName = async () => {
    setIsGeneratingName(true);
    try {
      const newName: string = await apiInstance.generateHeroName(racesMap.get(race)?.id)
      setName(newName)
    } finally {
      setIsGeneratingName(false);
    }
  }

  return (
    <Layout showSidebar={false}>
      <div className="container max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-fantasy-primary mb-8">Create Your Hero</h1>

        <div className="space-y-8">
          {/* Character Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
              Hero Name
            </label>
            <div className="flex items-center gap-2 text-black">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your hero's name"
                maxLength={32}
                required={true}
                className="w-full"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isGeneratingName}
                onClick={() => onGenerateHeroName()}
                aria-label="Generate random name"
              >
                {isGeneratingName ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <span>🎲 Generate</span>
                )}
              </Button>
            </div>
          </div>

          {/* Race Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Choose Your Race
            </label>
            <Select value={race} onValueChange={setRace}>
              <SelectTrigger>
                <SelectValue placeholder="Select a race" />
              </SelectTrigger>
              <SelectContent>
                {races.map((raceOption) => (
                  <SelectItem key={raceOption.id} value={raceOption.value}>
                    <span className="flex items-center gap-2 text-black">
                      {raceOption.icon} {raceOption.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          {!wallet ? (
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={onCreateHero}
              disabled={isCreatingHero}
            >
              {isCreatingHero ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Character...</span>
                </div>
              ) : (
                "Create Character"
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}

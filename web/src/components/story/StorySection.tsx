import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { HeroStoreContext } from "@/store/context";
import { useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import type { Autohero } from "@/types/autohero";
import IDL from "@/idl/autohero.json";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { toast } from "sonner";
import { firstByte, firstByteBN, secondByteBN, countBits } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import apiInstance from "@/API";
import Markdown from "react-markdown";

interface StoryChoice {
  id: number;
  text: string;
  consequence?: string;
}

interface StorySectionProps {
  title: string;
  content: string;
  image?: string;
  choices: StoryChoice[];
  event: any;
}

export function StorySection({ title, content, image, choices, event }: StorySectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [heroEvent, setHeroEvent] = useState<any>(null);
  const [rewardsStatus, setRewardsStatus] = useState<"loading" | "success" | "error">("loading");

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  const program = new Program(IDL as Autohero, provider);
  const heroStore = useContext(HeroStoreContext);
  const message = new BN(event.message);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = async (choice: StoryChoice) => {
    setIsDialogOpen(true);
    setIsApplying(true);
    setHeroEvent(null);

    try {
      const tx = await program.methods.applyEvent(message)
        .accounts({
          payer: provider.wallet.publicKey,
          mintAccount: new PublicKey(heroStore.heroAddress),
          systemProgram: SystemProgram.programId
        })
        .rpc();
      console.log("Your transaction signature", tx);

      try {
        const result = await apiInstance.applyEvent(tx, event.id);
        console.log("Result", result);
        setRewardsStatus("success");
        setHeroEvent(result);
        toast.success('Event is applied');
      } catch (error) {
        console.error("Error applying event", error);
        toast.error('Event application failed');
      }
    } catch (error) {
      console.error("Error applying event", error);
      toast.error('Event application failed');
      setRewardsStatus("error");
    } finally {
      setIsApplying(false);
    }
  };

  let canApply = false;
  let heroSelector = 0;
  let eventSelector = 0;
  let eventNum = 0;
  let num = 0;
  let isApplied = false;
  if (heroStore.isReady) {
    isApplied = heroStore.isEventApplied(message);

    heroSelector = firstByte(heroStore.selector);
    eventSelector = firstByteBN(message);
    eventNum = secondByteBN(message) % 8;

    num = countBits(heroSelector ^ eventSelector);
    if (num === eventNum) {
      canApply = true;
    }
  }
  return (
    <div className="bg-fantasy-cosmic/20 rounded-lg border border-fantasy-cosmic/30 overflow-hidden mb-8 animate-fade-in">
      {/* Optional Image */}
      {image && (
        <div className="w-full h-48 md:h-64 bg-gradient-to-b from-fantasy-cosmic to-fantasy-dark flex items-center justify-center">
          <div className="text-4xl">🏰</div>
          {/* This would be your actual image: <img src={image} alt={title} className="w-full h-full object-cover" /> */}
        </div>
      )}

      {/* Story Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-fantasy-primary">{title}</h2>
        <div className="prose prose-sm prose-invert max-w-none mb-6">
          <p className="leading-relaxed text-fantasy-light">{content}</p>
        </div>

        {/* Story Choices */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-medium text-fantasy-gold flex items-center">
            <Sparkles size={18} className="mr-2" />
            What do you do?
          </h3>
          {choices && choices.map((choice, index) => (
            <Button
              key={`${choice.text}-${index}`}
              variant="outline"
              className="w-full justify-start text-left py-4 mb-2 bg-fantasy-cosmic/30 border-fantasy-cosmic/50 hover:bg-fantasy-primary/20 hover:border-fantasy-primary/50 transition-colors"
              onClick={() => openDialog(choice)}
              disabled={!canApply || isApplied}
            >
              <span className="flex-grow">{choice.text}</span>
              <ArrowRight size={16} />
              {canApply && (
                <span className="ml-2">
                  {isApplied ? "Participated" : "Participate"}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-fantasy-cosmic/90 border-fantasy-primary text-fantasy-light max-w-md">
          <DialogHeader>
            <DialogTitle className="text-fantasy-primary text-xl">Adventure Choice</DialogTitle>
            <DialogDescription className="text-fantasy-light/90">
              {isApplying ? "Processing your choice..." : "Determining the outcome of your choice..."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {rewardsStatus == "loading" ? (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="h-16 w-16 rounded-full border-4 border-t-fantasy-primary border-fantasy-cosmic/30 animate-spin"></div>
                <p className="mt-4 text-fantasy-light/80">Determining the outcome of your choice...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${rewardsStatus == "success" ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
                  {rewardsStatus == "success" ? (
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg flex items-center gap-2 text-fantasy-light">
                        <span className="text-xl">✨</span> Rewards
                      </h3>
                      <div className="space-y-1">
                        <Markdown>{heroEvent.message}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <p>Your attempt failed. Try making a different choice.</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={closeDialog}
                    className="bg-fantasy-primary hover:bg-fantasy-primary/80"
                  >
                    {rewardsStatus == "success" ? "Continue Adventure" : "Try Again"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

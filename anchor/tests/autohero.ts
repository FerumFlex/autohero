import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Autohero } from "../target/types/autohero";

describe("autohero", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const hero = anchor.web3.Keypair.generate();
  console.log('creating hero: ', hero.publicKey.toString());
  const seed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));;

  const storage = anchor.web3.Keypair.generate();
  console.log('creating storage: ', storage.publicKey.toString());

  const program = anchor.workspace.Autohero as Program<Autohero>;

  it("create hero!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize(seed)
      .accounts({newAccount: hero.publicKey})
      .signers([hero])
      .rpc();
    console.log("Your transaction signature", tx);

    const gameState = await program.account.hero.fetch(hero.publicKey);
    console.log('gameState: ', gameState);
  });

  it("create storage", async () => {
    // Add your test here.
    const tx = await program.methods.initializeStorage()
      .accounts({eventsStorage: storage.publicKey})
      .signers([storage])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});

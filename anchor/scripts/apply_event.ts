import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Autohero } from "../target/types/autohero";
import { delay } from "./utils";
import { PublicKey } from "@solana/web3.js";
const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // const eventSeed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  // const eventSeed = new anchor.BN(33685775);
  const eventSeed = new anchor.BN("117897088429263920995143631409219928880");
  console.log("eventSeed: ", eventSeed.toString());

  const program = anchor.workspace.Autohero as Program<Autohero>;
  const tx_storage = await program.methods
    .addEvent(eventSeed)
    .rpc();
  console.log("Your storage signature", tx_storage);
  await delay(5000);

  // const seed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));;
  // const seed = new anchor.BN(33685791);
  const seed = new anchor.BN(6791442169801617);
  const hero = anchor.web3.Keypair.generate();
  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(hero.publicKey, provider.wallet.publicKey);

  const tx_hero = await program.methods
    .mintNft("Homer NFT", seed, 1)
    .accounts({
      payer: provider.wallet.publicKey,
      mintAccount: hero.publicKey,
      associatedTokenAccount: associatedTokenAccountAddress
    })
    .signers([hero])
    .rpc();
  console.log("Your hero signature", tx_hero);
  await delay(5000);

  const tx_apply = await program.methods
    .applyEvent(eventSeed)
    .accounts({
      payer: provider.wallet.publicKey,
      mintAccount: hero.publicKey,
    })
    .rpc();
  console.log("Your apply signature", tx_apply);
  await delay(5000);

  const [heroData, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("nft_data"), hero.publicKey.toBuffer()],
    new PublicKey(program.programId)
  );

  const gameState = await program.account.hero.fetch(heroData);
  console.log("heroData: ", heroData.toString());
  console.log("gameState: ", gameState);
};

main();

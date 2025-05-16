import { Program } from "@coral-xyz/anchor";
import { Autohero } from "../target/types/autohero";
import { MINT_SEED } from "./constants";
import { PublicKey } from "@solana/web3.js";


const anchor = require("@coral-xyz/anchor");


// Configure client to use the provider.
const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Autohero as Program<Autohero>;
  const payer = provider.wallet as anchor.Wallet;

  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED)],
    new PublicKey(program.programId)
  );

  const destination = await anchor.utils.token.associatedAddress({
    mint: mint,
    owner: payer.publicKey,
  });

  const tx = await program.methods
    .mintToken()
    .accounts({
      mint: mint,
      destination: destination
    })
    .rpc();

  console.log("Your transaction signature", tx);
};

main();

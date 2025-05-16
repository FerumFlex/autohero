import { Program } from "@coral-xyz/anchor";
import { Autohero } from "../target/types/autohero";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_METADATA_PROGRAM_ID, MINT_SEED, METADATA_SEED } from "./constants";


const anchor = require("@coral-xyz/anchor");


// Configure client to use the provider.
const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Autohero as Program<Autohero>;

  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED)],
    new PublicKey(program.programId)
  );

  const [metadataAddress] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_SEED),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        metadata: metadataAddress,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  } catch (error) {
    console.log("Error", error);
  }

  console.log("metadataAddress", metadataAddress.toString());
  console.log("mint", mint.toString());
};

main();

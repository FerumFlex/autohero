import { Autohero } from "../target/types/autohero";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
  let provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const eventSeed = new anchor.BN(
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  );
  console.log("eventSeed: ", eventSeed.toString());

  const program = anchor.workspace.Autohero as Program<Autohero>;
  const tx = await program.methods
    .addEvent(eventSeed)
    .rpc();
  console.log("Your transaction signature", tx);
};

main();

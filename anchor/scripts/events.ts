import { Autohero } from "../target/types/autohero";
import { PublicKey } from "@solana/web3.js";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Autohero as Program<Autohero>;

  const [storage, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("events_storage")],
    new PublicKey(program.programId)
  );

  const eventStorage = await program.account.eventStorage.fetch(storage);
  console.log("eventStorage: ", eventStorage);
};

main();

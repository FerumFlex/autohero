import { Autohero } from "../target/types/autohero";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Autohero as Program<Autohero>;
  const tx = await program.methods
    .info()
    .accounts({ hero: "C1K7fx1Tv5DcJJwXoWriLNijU2HaDAhbYYYviaT2WUwM" })
    .rpc();
  console.log("Your transaction signature", tx.logs);
};

main();

import { Autohero } from "../target/types/autohero";
import { writeStorageAddress } from "./utils";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const storage = anchor.web3.Keypair.generate();
    console.log('creating storage: ', storage.publicKey.toString());

    const program = anchor.workspace.Autohero as Program<Autohero>;
    const tx = await program.methods.initializeStorage()
        .accounts({eventsStorage: storage.publicKey})
        .signers([storage])
        .rpc();
    console.log("Your transaction signature", tx);

    // Save the storage public key to a file
    writeStorageAddress(storage.publicKey.toString());
};

main();
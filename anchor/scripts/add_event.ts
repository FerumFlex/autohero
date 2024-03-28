import { Autohero } from "../target/types/autohero";
import { readStorageAddress } from "./utils";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const storageAddress = readStorageAddress();
    const storage = new anchor.web3.PublicKey(storageAddress);
    const eventSeed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    console.log('eventSeed: ', eventSeed.toString());

    const program = anchor.workspace.Autohero as Program<Autohero>;
    const tx = await program.methods.addEvent(eventSeed)
        .accounts({eventsStorage: storage})
        .rpc();
    console.log("Your transaction signature", tx);
};

main();
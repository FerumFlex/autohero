import { Autohero } from "../target/types/autohero";
import { readStorageAddress } from "./utils";

const anchor = require("@coral-xyz/anchor");

// Configure client to use the provider.
const main = async () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const storageAddress = readStorageAddress();
    const storage = new anchor.web3.PublicKey(storageAddress);
    const program = anchor.workspace.Autohero as Program<Autohero>;
    const eventStorage = await program.account.eventStorage.fetch(storage);
    console.log('eventStorage: ', eventStorage);
};

main();
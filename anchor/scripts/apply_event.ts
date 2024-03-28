import { Autohero } from "../target/types/autohero";
import { readStorageAddress, delay } from "./utils";

const anchor = require("@coral-xyz/anchor");


// Configure client to use the provider.
const main = async () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const storageAddress = readStorageAddress();
    const storage = new anchor.web3.PublicKey(storageAddress);
    // const eventSeed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    // const eventSeed = new anchor.BN(33685775);
    const eventSeed = new anchor.BN("117897088429263920995143631409219928880");
    console.log('eventSeed: ', eventSeed.toString());

    const program = anchor.workspace.Autohero as Program<Autohero>;
    const tx_storage = await program.methods.addEvent(eventSeed)
        .accounts({eventsStorage: storage})
        .rpc();
    console.log("Your storage signature", tx_storage);
    await delay(5000);

    // const seed = new anchor.BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));;
    // const seed = new anchor.BN(33685791);
    const seed = new anchor.BN(6791442169801617);
    const hero = anchor.web3.Keypair.generate();
    const tx_hero = await program.methods.initialize(seed)
      .accounts({newAccount: hero.publicKey})
      .signers([hero])
      .rpc();
    console.log("Your hero signature", tx_hero);
    await delay(5000);

    const tx_apply = await program.methods.applyEvent(eventSeed)
        .accounts({
            eventsStorage: storage,
            hero: hero.publicKey
        })
        .rpc();
    console.log("Your apply signature", tx_apply);
    await delay(5000);

    const gameState = await program.account.hero.fetch(hero.publicKey);
    console.log('gameState: ', gameState);
};

main();
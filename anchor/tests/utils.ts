import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Autohero } from "../target/types/autohero";


const createHero = async (program: Program<Autohero>, provider: anchor.AnchorProvider) => {
  const hero = anchor.web3.Keypair.generate();
  const seed = new anchor.BN(
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  );
  await program.methods.initialize(seed, 1, "Test").accounts({ newAccount: hero.publicKey }).signers([hero]).rpc();
  return hero;
}

const createHeroes = async (program: Program<Autohero>, provider: anchor.AnchorProvider, count: number) => {
  const heroes = [];
  for (let i = 0; i < count; i++) {
    let newHero = await createHero(program, provider);
    heroes.push(newHero);
  }
  return heroes;
}

const createStorage = async (program: Program<Autohero>, provider: anchor.AnchorProvider) => {
  await program.methods.initialize().rpc();
  return storage;
}

const addEvent = async (program: Program<Autohero>, provider: anchor.AnchorProvider, storage: anchor.web3.Keypair) => {
  const eventSeed = new anchor.BN(
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  );
  await program.methods.addEvent(eventSeed).accounts({ eventsStorage: storage.publicKey, authority: provider.wallet.publicKey }).rpc();
  return eventSeed;
}

export { createHero, createHeroes, createStorage, addEvent };
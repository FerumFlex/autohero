// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Autohero } from "../target/types/autohero";
// import { expect } from "chai";
// import { createHero } from "./utils";


// describe("hero", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env()
//   anchor.setProvider(provider);

//   const signer = provider.wallet.publicKey;

//   const program = anchor.workspace.Autohero as Program<Autohero>;

//   it("create_hero", async () => {
//     const hero = await createHero(program, provider);
//     const gameState = await program.account.hero.fetch(hero.publicKey);
//     expect(gameState.owner.equals(signer)).to.be.true;
//   });
// });

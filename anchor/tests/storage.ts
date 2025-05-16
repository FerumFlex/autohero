// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Autohero } from "../target/types/autohero";
// import { expect } from "chai";
// import { createHero, createHeroes, createStorage, addEvent } from "./utils";


// describe("storage", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env()
//   anchor.setProvider(provider);

//   const signer = provider.wallet.publicKey;

//   const program = anchor.workspace.Autohero as Program<Autohero>;

//   it("create_storage", async () => {
//     const storage = await createStorage(program, provider);
//     const storageState = await program.account.eventStorage.fetch(storage.publicKey);
//     expect(storageState.authority.equals(signer)).to.be.true;
//   });

//   it("add_event", async () => {
//     const storage = await createStorage(program, provider);
//     const eventSeed = await addEvent(program, provider, storage);
//     const storageState = await program.account.eventStorage.fetch(storage.publicKey);
//     expect(storageState.events[0].message.toString() === eventSeed.toString()).to.be.true;
//     expect(storageState.events[0].timestamp.toNumber()).to.be.above(0);
//   })

//   it("test_if_authority_is_wrong_it_should_fail", async () => {
//     const storage = await createStorage(program, provider);
//     const eventSeed = await addEvent(program, provider, storage);

//     // test if authority is wrong it should fail
//     const fakeAuthority = anchor.web3.Keypair.generate();
//     try {
//       await program.methods
//         .addEvent(eventSeed)
//         .accounts({
//           eventsStorage: storage.publicKey,
//           authority: fakeAuthority.publicKey
//         })
//         .signers([fakeAuthority])
//         .rpc();
//       expect.fail('Expected error was not thrown');
//     } catch (error) {
//       expect(error).to.be.instanceOf(Error);
//       expect(error.message).to.match(/Error Code: ConstraintHasOne/i);
//     }
//   });

//   // it("test_if_event_can_be_applied_to_at_least_one_hero", async () => {
//   //   const storage = await createStorage(program, provider);
//   //   const eventSeed = await addEvent(program, provider, storage);

//   //   // create heroes
//   //   const heroes = await createHeroes(program, provider, 256);

//   //   // check if event can be applied to at least one hero
//   //   let errors = {}
//   //   let successCount = 0;
//   //   for (const hero of heroes) {
//   //     try {
//   //       await program.methods
//   //         .applyEvent(eventSeed)
//   //         .accounts({
//   //           hero: hero.publicKey,
//   //           eventsStorage: storage.publicKey
//   //         })
//   //         .rpc();
//   //       successCount++;
//   //       break;
//   //     } catch (error) {
//   //       let message = error.logs[2];
//   //       errors[message] = (errors[message] || 0) + 1;
//   //     }
//   //   }
//   //   expect(successCount).to.be.above(0);
//   // });

//   it("test_if_event_for_hero_can_be_applied_only_for_owner", async () => {
//     const storage = await createStorage(program, provider);
//     const eventSeed = await addEvent(program, provider, storage);

//     // create heroes
//     const hero = await createHero(program, provider);

//     // try with wrong authority
//     const fakeAuthority = anchor.web3.Keypair.generate();
//     try {
//       await program.methods
//         .applyEvent(eventSeed)
//         .accounts({
//           hero: hero.publicKey,
//           eventsStorage: storage.publicKey,
//           owner: fakeAuthority.publicKey
//         })
//         .signers([fakeAuthority])
//         .rpc();
//       expect.fail('Expected error was not thrown');
//     } catch (error) {
//       expect(error).to.be.instanceOf(Error);
//       expect(error.message).to.match(/Error Code: ConstraintHasOne/i);
//     }
//   });
// });

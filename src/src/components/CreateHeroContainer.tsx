import { Button, Flex } from "@mantine/core";
import { useContext } from "react";
import { useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { IDL, Autohero } from "@/types/autohero";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { HeroStoreContext } from "@/store/context";
import { observer } from "mobx-react";
import { SystemProgram, programId } from "@/constants";
import { notifications } from '@mantine/notifications';
import { solanaTxLink } from "@/utils";
import axios from "axios";
import { apiUrl } from "@/constants";


function generateRandomUint64() {
  return new BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));;
}

export const CreateHeroContainer = observer(() => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  const program = new Program<Autohero>(IDL, programId, provider);
  const heroStore = useContext(HeroStoreContext);

  const onCreateHero = async () => {
    const hero = anchor.web3.Keypair.generate();
    const seed = generateRandomUint64();

    const tx = await program.methods.initialize(seed)
      .accounts({
        newAccount: hero.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([hero])
      .rpc();
    console.log("Your transaction signature", tx);
    console.log("creating hero: ", hero.publicKey.toString());
    heroStore.setHeroAddress(hero.publicKey.toString());

    notifications.show({
      title: 'You hero is created',
      withCloseButton: true,
      autoClose: 5000,
      color: 'green',
      message: <a href={solanaTxLink(tx)} target="_blank">View transaction</a>,
    });

    axios.post(`${apiUrl}/hero`, {
      tx: tx
    })
  }

  return (
    <Flex align={"center"} justify={"center"} w={"100%"} h={"200px"}>
      <Button onClick={onCreateHero}>Create Hero</Button>
    </Flex>
  );
});

import { useContext, useState } from "react";
import { Text, Button, Paper, Badge, Loader, Flex, Timeline, Modal, Title } from "@mantine/core"
import { HeroStoreContext } from '@/store/context';
import { observer } from "mobx-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { SystemProgram, programId, storageId } from "@/constants";
import { useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { IDL, Autohero } from "@/types/autohero";
import { PublicKey } from "@solana/web3.js";
import { solanaTxLink, timeDifference } from "@/utils";
import { notifications } from '@mantine/notifications';
import { IconMessageDots } from '@tabler/icons-react';
import { apiUrl } from "@/constants";
import axios from "axios";


function firstByte(value: number) {
  return value & 0xFF;
}

function firstByteBN(value: BN) {
  return value.words[0] & 0xFF;
}

function secondByteBN(value: BN) {
  return (value.words[0] >> 8) & 0xFF;
}

function countBits(value: number) {
  let count = 0;
  while (value) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

export const Event = observer((event: any) => {
  const [opened, setOpened] = useState(false);
  const [isAppling, setIsAppling] = useState(false);
  const [heroEvent, setHeroEvent] = useState<any>(null);

  const heroStore = useContext(HeroStoreContext);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  const program = new Program<Autohero>(IDL, programId, provider);
  const message = new BN(event.event.message);

  const onApply = async () => {
    setOpened(true);
    setHeroEvent(null);
    setIsAppling(true);
    try {
      const tx = await program.methods.applyEvent(message)
        .accounts({
          eventsStorage: storageId,
          hero: new PublicKey(heroStore.heroAddress),
          systemProgram: SystemProgram.programId
        })
        .rpc();
      console.log("Your transaction signature", tx);

      let result = await axios.post(`${apiUrl}/events/apply`, {
        tx: tx,
        event: event.event.id
      });
      console.log("Result", result);
      setHeroEvent(result.data);

      notifications.show({
        title: 'Event is applied you got some stats',
        withCloseButton: true,
        autoClose: 5000,
        color: 'green',
        message: <a href={solanaTxLink(tx)} target="_blank">View transaction</a>,
      });
    } finally {
      setIsAppling(false);
      setOpened(false);
    }

  };

  const closeDialog = () => {
    setOpened(false);
    setIsAppling(false);
  }

  let canApply = false;
  let heroSelector = 0;
  let eventSelector = 0;
  let eventNum = 0;
  let num = 0;
  let isApplied = false;
  if (heroStore.isReady) {
    isApplied = heroStore.isEventApplied(message);
    heroSelector = firstByte(heroStore.selector);
    eventSelector = firstByteBN(message);
    eventNum = secondByteBN(message) % 8;

    num = countBits(heroSelector ^ eventSelector);
    if (num === eventNum) {
      canApply = true;
    }
  }

  return (
    <Timeline.Item title={event.event.title} bullet={isApplied ? <IconMessageDots size={12} /> : null}>
      <Modal opened={opened} onClose={closeDialog} title="Participate">
        <Title m={20} size={"sx"}>Running into the adventure</Title>
        {heroEvent ? (
          <>
            <Paper shadow="xs">
              {heroEvent.message}
            </Paper>
            <Paper shadow="xs">
              <Title m={20} size={"sx"}>Change in stats</Title>
              {Object.keys(heroEvent.change).map((stat: any) => (
                <Badge>{stat}: +{heroEvent.change[stat]}</Badge>
              ))}
            </Paper>
            <Button mt={20} onClick={closeDialog}>Close</Button>
          </>
        ): (
          <Flex m={30} justify={"center"}>
            <Loader color="blue" />
          </Flex>
        )}
      </Modal>
      <Text c="dimmed" size="sm">{event.event.description}</Text>
      <Text size="xs" mt={4}>{timeDifference(new Date(), new Date(event.event.created_at))}</Text>
      <Flex gap={2}>
        {/* <span>Event: {eventSelector}</span>
        <span>Event num: {eventNum}</span>
        <span>Hero: {heroSelector}</span>
        <span>Num: {num}</span> */}
        {canApply && (
          <Button loading={isAppling} disabled={isApplied} onClick={onApply}>
            {isApplied ? "Participated" : "Participate"}
          </Button>
        )}
      </Flex>
    </Timeline.Item>
  )
});
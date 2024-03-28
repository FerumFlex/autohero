import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Title, Flex, Button, Timeline } from "@mantine/core";
import { IDL, Autohero } from "@/types/autohero";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { programId, storageId } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { apiUrl } from '@/constants';
import { Event } from "./Event";
import { IconReload } from '@tabler/icons-react';
import { useQueryClient } from "@tanstack/react-query";

export const EventsContainer = () => {
  // const [events, setEvents] = useState<any[]>([]);
  const { isPending, error, data } = useQuery({
    queryKey: ['events'],
    queryFn: () =>
      fetch(`${apiUrl}/events?storage_id=` + storageId).then((res) =>
        res.json(),
      ),
  });
  const queryClient = useQueryClient()

  useEffect(() => {
    function reload() {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }

    const intervalId = setInterval(reload, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    const provider = new AnchorProvider(
      connection,
      wallet as unknown as AnchorWallet,
      {}
    );
    const program = new Program<Autohero>(IDL, programId, provider);
    return program;
  }, [connection, wallet]);

  const reload = async () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  // useEffect(() => {
  //   async function loadInfo() {
  //     const data = await program.account.eventStorage.fetch(new PublicKey(storageId));
  //     setEvents(data.events);
  //     console.log("Events loaded: ", data.events);
  //   };
  //   loadInfo();
  // }, [program]);

  return (
    <div>
      <Flex align={"center"} justify={"space-between"}>
        <Title mb={10}>Latest events</Title>
        <Button loading={isPending} variant={"outline"} onClick={reload}>
          <IconReload  />
        </Button>
      </Flex>
      {data && (
        <Timeline active={1} bulletSize={24} lineWidth={2}>
          {data.map((event: any, index: number) => (
            <Event key={index} event={event} />
          ))}
        </Timeline>
      )}
    </div>
  );
}
import { useEffect, useState, useContext } from 'react';

import { Badge, Container, Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './FooterSocial.module.css';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { HeroStoreContext } from '@/store/context';


export function FooterSocial() {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const heroStore = useContext(HeroStoreContext);

  useEffect(() => {
    async function loadInfo() {
      const slot = await connection.getSlot();
      heroStore.setConnectionParams(connection, wallet);
      heroStore.setCurrentUnixTimestamp();
      setBlockNumber(slot);
    };
    loadInfo();
  },
    [connection, wallet]
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const slot = await connection.getSlot();
      heroStore.setConnectionParams(connection, wallet);
      heroStore.setCurrentUnixTimestamp();
      setBlockNumber(slot);
    }, 5000);
    return () => clearInterval(interval);
  }, [blockNumber, connection, wallet]);

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Badge size="sm">
          Current block: {blockNumber.toLocaleString()}
        </Badge>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
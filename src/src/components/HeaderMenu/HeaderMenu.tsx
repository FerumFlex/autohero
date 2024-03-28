import { Menu, Group, Center, Burger, Container, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { Logo } from '../Logo/Logo';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Link } from 'react-router-dom';

import classes from './HeaderMenu.module.css';

const links = [
  { link: '/', label: 'Home', links: [] },
  { link: '/about', label: 'About', links: [] },
  { link: '/faq', label: 'FAQ', links: [] },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item: any) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems.length > 0) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.link}
        className={classes.link}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Logo size={28} />
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Group gap={1}>
            <ColorSchemeToggle />
          </Group>
          <Group gap={1}>
            <Select
              value={"Devnet"}
              data={["Devnet"]}
              />
          </Group>
          <Group gap={5} visibleFrom="sm">
            <WalletMultiButton />
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
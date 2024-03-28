import { Group, Anchor, Badge } from '@mantine/core';
import logo from '../../assets/images/logo.png';
import classes from './Logo.module.css';


export function Logo({ size } : {size: number}) {
  return (
    <Group>
      <img src={logo} alt="logo" width={size} height={size} />
      <Anchor href="/" size="lg" className={classes.logo}>Autohero</Anchor>
      <Badge size="xs" color="green">beta</Badge>
    </Group>
  );
}
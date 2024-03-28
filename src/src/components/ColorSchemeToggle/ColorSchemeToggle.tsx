import { useMantineColorScheme, Switch, useMantineTheme, rem } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';


export function ColorSchemeToggle() {
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  const onChange = (event: any) => {
    let checked = event.currentTarget.checked;
    if (checked) {
      setColorScheme('dark')
    } else {
      setColorScheme('light')
    }
  }

  return <Switch onChange={onChange} checked={colorScheme == 'dark'} size="md" color="dark.4" onLabel={sunIcon} offLabel={moonIcon} />;
}

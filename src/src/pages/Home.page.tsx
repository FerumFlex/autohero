import { useContext } from 'react';

import { EventsContainer } from '@/components/EventsContainer/EventsContainer';
import { CreateHeroContainer } from '@/components/CreateHeroContainer';
import { HeroContainer } from '../components/HeroContainer';
import { Grid } from '@mantine/core';
import { HeroStoreContext } from '@/store/context';
import { observer } from 'mobx-react';


export const HomePage = observer(() => {
  const heroStore = useContext(HeroStoreContext);

  return (
    <>
      <Grid gutter="md">
        {heroStore.heroAddress ? (
          <>
            <Grid.Col span={4} >
              <HeroContainer />
            </Grid.Col>
            <Grid.Col span={6}>
              <EventsContainer />
            </Grid.Col>
              </>
        ) : (
          <>
            <CreateHeroContainer />
          </>
        )}
      </Grid>
    </>
  );
});

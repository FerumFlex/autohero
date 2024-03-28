import { Container } from '@mantine/core';

import { HeaderMenu } from '@/components/HeaderMenu/HeaderMenu';
import { FooterSocial } from '@/components/FooterSocial/FooterSocial';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react';


export const Layout = observer(() => {
  return (
    <>
      <HeaderMenu />
        <Container my="md">
          <Outlet />
        </Container>
      <FooterSocial />
    </>
  )
});
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar/Navbar';
import { AlbumIcon, HomeIcon, Music2Icon } from 'lucide-react';
import Head from 'next/head';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { SidebarDrawer } from './SidebarDrawer/SidebarDrawer';

interface Props extends HTMLAttributes<HTMLElement> {
  pageTitle: string;
}

export function Layout({ children, pageTitle, ...attr }: PropsWithChildren<Props>) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className='grid min-h-screen grid-rows-[auto_1fr_auto]'>
        <SidebarDrawer
          sidebarContent={[
            {
              href: '/',
              title: 'Home',
              icon: <HomeIcon />,
            },
            {
              href: '/lyrics',
              title: 'Lyrics finder',
              icon: <Music2Icon />,
            },
            {
              href: '/logbook',
              title: 'Logbook',
              icon: <AlbumIcon />,
            },
          ]}
        />
        <Navbar />
        <main {...attr}>{children}</main>
        <Footer />
      </div>
    </>
  );
}

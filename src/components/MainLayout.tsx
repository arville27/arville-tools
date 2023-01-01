import {
  BookOpenIcon,
  HomeIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import React, { PropsWithChildren } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar/Navbar";
import SidebarDrawer from "./SidebarDrawer/SidebarDrawer";

type Props = {
  pageTitle: string;
};

const MainLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  pageTitle,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="flex min-h-screen">
        <SidebarDrawer
          sidebarContent={[
            {
              href: "/",
              title: "Home",
              icon: <HomeIcon className="h-6 w-6" />,
            },
            {
              href: "/lyrics-finder",
              title: "Lyrics finder",
              icon: <MusicalNoteIcon className="h-6 w-6" />,
            },
            {
              href: "/logbook",
              title: "Logbook",
              icon: <BookOpenIcon className="h-6 w-6" />,
            },
          ]}
        />
        <div className="grow">
          <div className="min-h-[92vh]">
            <Navbar />
            <main>{children}</main>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainLayout;

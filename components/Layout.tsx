import Head from "next/head";
import type { ReactNode } from "react";
import Header from "./Header";
import { Flex } from "@chakra-ui/react";

export default function Layout({
  children,
  admins,
}: {
  children: ReactNode;
  admins: string[];
}) {
  return (
    <>
      <Head>
        <title>EZ-Check</title>
        <meta name="description" content="Student Authentication" />
        <link rel="icon" href="/favicon.ico" />
        {/*PWA UI-->*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#fffffe" />
      </Head>
      <main>
        <Flex
          flexDir="column"
          overflow="hidden"
          overscrollY="none"
          height={"100svh"}
          width={"100%"}
          position={"fixed"}
          sx={{
            userSelect: "none",
            touchAction: "none",
            overscrollBehavior: "none",
            WebkitOverflowScrolling: "touch",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitUserDrag: "none",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
          }}
        >
          <Header admins={admins} />
          {children}
        </Flex>
      </main>
    </>
  );
}

import Head from "next/head";
import { useEffect, type ReactNode } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

type LayoutProps = {
  // isAdmin: boolean | undefined;
  authorized?: boolean;
  loading?: boolean;
  children: ReactNode;
};
export default function Layout(props: LayoutProps) {
  // set content based on: loading, authorized
  return (
    <>
      <Head>
        <title>EZCheck</title>
        <meta name="description" content="Machine shop management system" />
        {/* ICON */}
        <link rel="icon" href="/favicon.ico" />
        {/*PWA UI*/}
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
          {props.children}
        </Flex>
      </main>
    </>
  );
}

/*
  useEffect(() => {
    const html = document.querySelector("html") || new HTMLBodyElement();
    const body = document.querySelector("body") || new HTMLBodyElement();
    // html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.touchAction = "none";
  });
  */

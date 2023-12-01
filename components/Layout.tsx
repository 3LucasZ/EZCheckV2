import Head from "next/head";
import type { ReactNode } from "react";
import Header from "./Header";

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
        <title>EZ-Find</title>
        <meta name="description" content="Inventory Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header admins={admins} />
        {children}
      </main>
    </>
  );
}

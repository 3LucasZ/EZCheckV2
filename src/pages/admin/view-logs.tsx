import { Box, Flex } from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "archive/AdminWidget2";
import LogWidget, { LogProps } from "components/Widget/LogWidget";
import AdminLayout from "components/Layout/AdminLayout";
import { TextingBar } from "components/Layout/TextingBar";

type PageProps = {
  admins: AdminProps[];
  logs: LogProps[];
};
export default function Home({ admins, logs }: PageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Box gap="8px" overflowY="auto" px="5" display="grid">
        <Box minH="0px"></Box>
        <LogWidget
          log={{
            id: -1,
            timestamp: new Date().toLocaleString(),
            message:
              "Hello! Welcome to the start of EZCheck logs. Here, you can get notified of who used what machine during every point of the day. You can even create your own cusotm logs.",
            level: 0,
          }}
        ></LogWidget>
        {logs.map((log) => (
          <LogWidget log={log}></LogWidget>
        ))}
        <Box minH="0px"></Box>
      </Box>
      <TextingBar />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const logs = await prisma.log.findMany({
    orderBy: [{ id: "desc" }],
  });
  return {
    props: {
      logs,
    },
  };
};

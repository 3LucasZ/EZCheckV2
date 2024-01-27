import { Box, Flex } from "@chakra-ui/react";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import LogWidget, { LogProps } from "components/Widget/LogWidget";
import AdminLayout from "components/AdminLayout";

type PageProps = {
  admins: AdminProps[];
  logs: LogProps[];
};
export default function Home({ admins, logs }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  console.log(admins);
  console.log(logs);
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={myAdmin.supervising}>
      <Box gap="8px" overflowY="auto" px="5" display="grid">
        <Box minH="0px"></Box>
        {logs.map((log) => (
          <LogWidget log={log}></LogWidget>
        ))}
        <Box minH="0px"></Box>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  const logs = await prisma.log.findMany({ orderBy: [{ id: "desc" }] });
  return {
    props: {
      admins,
      logs,
    },
  };
};

import { Flex } from "@chakra-ui/react";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import LogWidget, { LogProps } from "components/Widget/LogWidget";

type PageProps = {
  admins: AdminProps[];
  logs: LogProps[];
};
export default function Home({ admins, logs }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  console.log(admins);
  console.log(logs);
  return (
    <Layout isAdmin={isAdmin}>
      <Flex flexDir="column" gap="8px">
        {logs.map((log) => (
          <LogWidget log={log}></LogWidget>
        ))}
      </Flex>
    </Layout>
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

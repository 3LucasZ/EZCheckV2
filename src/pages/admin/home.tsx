import { Box, SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import Header from "components/Header";
import AppBar from "components/AppBar";

type PageProps = {
  admins: AdminProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  console.log(session);
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <Header />
      <SimpleGrid
        columns={[1, 2]}
        spacing={10}
        overflowY="auto"
        h={"100%"}
        py={"2"}
      >
        <RouteButton
          route={"manage-students"}
          text={"Manage Students"}
          icon={MdManageAccounts}
          color={"teal.300"}
          hoverColor={"teal.100"}
        ></RouteButton>
        <RouteButton
          route={"manage-machines"}
          text={"Manage Machines"}
          icon={GiSewingMachine}
          color={"blue.300"}
          hoverColor={"blue.100"}
        ></RouteButton>
        <RouteButton
          route={"logs"}
          text={"View Logs"}
          icon={IoDocumentText}
          color={"orange.400"}
          hoverColor={"orange.100"}
        ></RouteButton>
        <RouteButton
          route={"help"}
          text={"Help"}
          icon={IoIosInformationCircle}
          color={"red.400"}
          hoverColor={"red.100"}
        ></RouteButton>
      </SimpleGrid>
      <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
      <AppBar />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  return {
    props: {
      admins: admins,
    },
  };
};

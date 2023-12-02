import { Box, SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

type Props = {
  admins: string[];
};
export default function Home({ admins }: Props) {
  const { data: session } = useSession();
  return (
    <Layout admins={admins}>
      <SimpleGrid columns={2} spacing={10}>
        {session && admins.includes(session!.user!.email!) && (
          <RouteButton
            route={""}
            text={"Module Status"}
            imageUrl={"images/add-item.png"}
            color={"red.200"}
          ></RouteButton>
        )}
        <RouteButton
          route={"manage-students"}
          text={"Manage Students"}
          imageUrl={"images/find-item.png"}
          color={"teal.200"}
        ></RouteButton>
        {session && admins.includes(session!.user!.email!) && (
          <RouteButton
            route={""}
            text={"View Logs"}
            imageUrl={"images/add-item.png"}
            color={"orange.200"}
          ></RouteButton>
        )}
        <RouteButton
          route={"manage-modules"}
          text={"Manage Modules"}
          imageUrl={"images/find-item.png"}
          color={"blue.200"}
        ></RouteButton>
      </SimpleGrid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  return {
    props: {
      admins: admins.map((admin) => admin.email),
    },
  };
};

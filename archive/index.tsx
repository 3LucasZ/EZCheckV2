import { Box, Center, Heading, SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "archive/AdminWidget2";
import { RiAdminLine } from "react-icons/ri";
import { PiStudent, PiStudentBold, PiStudentDuotone } from "react-icons/pi";
import Header from "components/Layout/Header";
import AvatarMenu from "components/Layout/AvatarMenu";

type PageProps = {
  admins: AdminProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  console.log(session);
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  return (
    <Layout>
      <Header isAdmin={isAdmin} isSupervisor={myAdmin.supervising} />
      <SimpleGrid columns={[1, 2]} spacing={10} overflowY="auto" h={"100%"}>
        <RouteButton
          route={"student/home"}
          text={"I'm a Student"}
          icon={PiStudentDuotone}
          color={"teal.300"}
          hoverColor={"teal.100"}
        ></RouteButton>
        <RouteButton
          route={"admin/home"}
          text={"I'm an Admin"}
          icon={RiAdminLine}
          color={"blue.300"}
          hoverColor={"blue.100"}
        ></RouteButton>
      </SimpleGrid>
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

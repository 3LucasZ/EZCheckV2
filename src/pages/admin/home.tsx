import { Box, SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle, IoIosSettings } from "react-icons/io";
import { BiSolidWrench } from "react-icons/bi";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import Header from "components/Layout/Header";
import AppBar from "components/Layout/AppBar";
import AdminLayout from "components/Layout/AdminLayout";
import { SettingsIcon } from "@chakra-ui/icons";
import { GrConfigure } from "react-icons/gr";
import { FaWrench } from "react-icons/fa6";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={session?.user.supervising}>
      <SimpleGrid
        columns={[1, 2]}
        overflowY="auto"
        w="100svw"
        h={"100%"}
        position={"fixed"}
        py={16}
        top={"0%"}
        zIndex={-100}
      >
        <RouteButton
          route={"/admin/manage-students"}
          text={"Manage Students"}
          icon={MdManageAccounts}
          color={"teal.300"}
          hoverColor={"teal.100"}
        ></RouteButton>
        <RouteButton
          route={"/admin/manage-machines"}
          text={"Manage Machines"}
          icon={GiSewingMachine}
          color={"blue.300"}
          hoverColor={"blue.100"}
        ></RouteButton>
        <RouteButton
          route={"/admin/view-logs"}
          text={"View Logs"}
          icon={IoDocumentText}
          color={"orange.400"}
          hoverColor={"orange.100"}
        ></RouteButton>
        <RouteButton
          route={"/admin/config"}
          text={"Configure"}
          icon={BiSolidWrench}
          color={"red.400"}
          hoverColor={"red.100"}
        ></RouteButton>
      </SimpleGrid>
    </AdminLayout>
  );
}

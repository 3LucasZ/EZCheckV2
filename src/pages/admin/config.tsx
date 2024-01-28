import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import Header from "components/Header";
import AppBar from "components/AppBar";
import AdminLayout from "components/AdminLayout";
import Router from "next/router";
import { useState } from "react";
import { errorToast, successToast } from "services/toasty";

type PageProps = {
  admins: AdminProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  const toaster = useToast();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  const [name, setName] = useState<string>("");
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={myAdmin.supervising}>
      <Flex
        flexDir="column"
        gap="10"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        pt={10}
        h="100%"
      >
        <FormControl isRequired>
          <FormLabel>Machine Name</FormLabel>
          <Input
            value={name}
            variant="filled"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText>
            Name of unregistered or registered machine.
          </FormHelperText>
        </FormControl>

        <Button
          size="lg"
          colorScheme="teal"
          type="submit"
          onClick={(e) => {
            e.preventDefault;
            if (!name) {
              errorToast(toaster, "Name can't be empty");
            } else {
              Router.push({
                pathname: "/admin/config-machine",
                query: { name: name },
              });
            }
          }}
        >
          Start Configuring
        </Button>
      </Flex>
    </AdminLayout>
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

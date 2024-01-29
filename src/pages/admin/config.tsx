import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  SimpleGrid,
  useToast,
  Text,
  HStack,
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
  queryName: string;
};
export default function Home({ admins, queryName }: PageProps) {
  const { data: session } = useSession();
  const toaster = useToast();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  const [name, setName] = useState<string>(queryName);
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
            placeholder="Ex: Laser Cutter"
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText>
            Name of an unregistered or registered machine.
          </FormHelperText>
        </FormControl>

        <Button
          isDisabled={name.length == 0}
          size="lg"
          colorScheme="teal"
          type="submit"
          onClick={(e) => {
            e.preventDefault;
            if (!name) {
              errorToast(toaster, "Name can't be empty");
            } else {
              const url =
                "http://" + name.replaceAll(" ", "-") + ".local" + "/ota";
              console.log(url);
              Router.push(url);
            }
          }}
        >
          Start Configuring
        </Button>
        {name && (
          <>
            <Text>
              You will be redirected to{" "}
              <Link color={"teal.500"}>
                {"http://" + name.replaceAll(" ", "-") + ".local" + "/ota"}
              </Link>
            </Text>
            <Text>
              If the configuration page does not load, then the machine you are
              trying to access does not exist or is not on the same network as
              your device.
            </Text>
          </>
        )}
      </Flex>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  var { name } = context.query;
  if (name == null) name = "";
  return {
    props: {
      admins: admins,
      queryName: name,
    },
  };
};

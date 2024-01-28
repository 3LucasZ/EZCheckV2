import React, { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  useToast,
  FormLabel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { MachineProps } from "components/Widget/MachineWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import AdminLayout from "components/AdminLayout";
import Router from "next/router";
import { poster } from "services/poster";

type PageProps = {
  name: String;
  admins: AdminProps[];
};

export default function ConfigMachine({ name, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  const toaster = useToast();

  const reachable = false;
  const [target, setTarget] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {});

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // const body = { id, name };
    // const res = await poster("/api/upsert-machine", body, toaster);
    // if (res.status == 200) {
    //   await Router.push(
    //     isNew ? "/admin/manage-machines" : "/admin/view-student/" + id
    //   );
    // }
  };

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
        <Heading>{name}</Heading>
        <FormControl>
          <FormLabel>Target</FormLabel>
          <Input
            value={name}
            variant="filled"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        {isAdmin && (
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            onClick={submitData}
          >
            Configure
          </Button>
        )}
      </Flex>
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const admins = await prisma.admin.findMany();
  const { name } = context.query;
  //ret
  return {
    props: {
      name,
      admins,
    },
  };
};

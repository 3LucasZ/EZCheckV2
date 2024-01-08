import React, { useState } from "react";
import {
  FormControl,
  Input,
  Button,
  useToast,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { MachineProps } from "components/Widget/MachineWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/userHandler";
import AdminLayout from "components/AdminLayout";
import Router from "next/router";
import { poster } from "services/poster";

type PageProps = {
  allStudents: StudentProps[];
  oldMachine: MachineProps;
  admins: AdminProps[];
};

export default function UpsertMachine({ oldMachine, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();

  const id = oldMachine.id;
  const isNew = id == -1;
  const [name, setName] = useState<string>(isNew ? "" : oldMachine.name);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { id, name };
    const res = await poster("/api/upsert-machine", body, toaster);
    if (res.status == 200) {
      await Router.push(isNew ? "manage-machines" : "student/" + id);
    }
  };

  return (
    <AdminLayout>
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
        </FormControl>

        {isAdmin && (
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            onClick={submitData}
          >
            {isNew ? "Register Machine" : "Update Machine"}
          </Button>
        )}
      </Flex>
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allStudents = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.machine.findUnique({
    where: {
      id: realId,
    },
    include: {
      students: true,
    },
  });
  const oldMachine = find == null ? { id: -1, name: "", students: [] } : find;
  //ret
  return {
    props: {
      allStudents: allStudents,
      oldMachine: oldMachine,
      admins: admins,
    },
  };
};

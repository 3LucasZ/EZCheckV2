import React, { useState } from "react";
import Router from "next/router";
import {
  FormControl,
  Input,
  Button,
  useToast,
  HStack,
  PinInput,
  PinInputField,
  FormLabel,
  Box,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { poster } from "services/poster";

type PageProps = {
  oldStudent: StudentProps;
  admins: AdminProps[];
};

export default function UpsertStudent({ oldStudent, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();

  const id = oldStudent.id;
  const isNew = id == -1;
  const PINLen = 10;
  const [name, setName] = useState(oldStudent.name);
  const [PIN, setPIN] = useState(oldStudent.PIN);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { id, name, PIN };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      await Router.push(isNew ? "manage-students" : "student/" + id);
    }
  };
  return (
    <Layout isAdmin={isAdmin}>
      <Flex
        flexDir="column"
        gap="10"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        h="100%"
      >
        <FormControl isRequired>
          <FormLabel>Student Name</FormLabel>
          <Input
            required
            value={name}
            variant="filled"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>PIN</FormLabel>
          <SimpleGrid columns={[5, 10]} spacing="4">
            <PinInput onChange={(e) => setPIN(e)} value={PIN}>
              {Array.from(Array(PINLen).keys()).map((key) =>
                key == 0 ? (
                  <PinInputField key={key} required />
                ) : (
                  <PinInputField key={key} />
                )
              )}
            </PinInput>
          </SimpleGrid>
        </FormControl>

        {isAdmin && (
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            onClick={submitData}
          >
            {isNew ? "Add Student" : "Update Student"}
          </Button>
        )}
      </Flex>
      <Box h={"150px"}></Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.student.findUnique({
    where: {
      id: realId,
    },
    include: {
      machines: true,
    },
  });
  const oldStudent =
    find == null ? { id: -1, name: "", PIN: "", machines: [] } : find;
  //ret
  return {
    props: {
      oldStudent: oldStudent,
      admins: admins,
    },
  };
};

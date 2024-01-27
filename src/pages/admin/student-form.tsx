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
  Flex,
  FormHelperText,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/userHandler";
import { poster } from "services/poster";
import AdminLayout from "components/AdminLayout";
import { PINLen } from "services/constants";

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
  const [name, setName] = useState(oldStudent.name);
  const [email, setEmail] = useState(oldStudent.email);
  const [PIN, setPIN] = useState(oldStudent.PIN);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { id, email, name, PIN };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      await Router.push(
        isNew ? "/admin/manage-students" : "/admin/view-student/" + id
      );
    }
  };
  return (
    <AdminLayout>
      <Flex
        flexDir="column"
        gap="10"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        pt="10"
        h="100%"
      >
        <FormControl isRequired>
          <FormLabel>Student Email</FormLabel>
          <Input
            required
            value={email}
            variant="filled"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            maxLength={250}
          />
          <FormHelperText>Student school email recommended.</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Student Name</FormLabel>
          <Input
            required
            value={name}
            variant="filled"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
          />
          <FormHelperText>{name.length}/32</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>PIN</FormLabel>
          <HStack spacing={["4px", "8px"]}>
            <PinInput
              onChange={(e) => setPIN(e)}
              value={PIN}
              size={["sm", "md"]}
            >
              {Array.from(Array(PINLen).keys()).map((key) =>
                key == 0 ? (
                  <PinInputField key={key} required />
                ) : (
                  <PinInputField key={key} />
                )
              )}
            </PinInput>
          </HStack>

          <FormHelperText>
            Temporary. Students can change their PINs on their accounts.
          </FormHelperText>
        </FormControl>

        {isAdmin && (
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            onClick={submitData}
          >
            {isNew ? "Register Student" : "Update Student"}
          </Button>
        )}
      </Flex>
    </AdminLayout>
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

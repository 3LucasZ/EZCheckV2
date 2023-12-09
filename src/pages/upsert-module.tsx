import React, { useState } from "react";
import Router from "next/router";
import { MultiValue, Select } from "chakra-react-select";
import {
  FormControl,
  Input,
  Button,
  useToast,
  VStack,
  FormLabel,
} from "@chakra-ui/react";
import { ModuleProps } from "components/ModuleWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/StudentWidget";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast } from "services/toasty";
import { AdminProps } from "components/AdminWidget";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";

enum FormState {
  Input,
  Submitting,
}
type PageProps = {
  allStudents: StudentProps[];
  oldModule: ModuleProps;
  admins: AdminProps[];
};
type RelateProps = {
  id: number;
};
export default function UpsertModule({
  allStudents,
  oldModule,
  admins,
}: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  const allOptions = allStudents.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const prefillOptions = oldModule.students.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const id = oldModule.id;
  const isNew = id == -1;
  const [name, setName] = useState<string>(isNew ? "" : oldModule.name);
  const [formState, setFormState] = useState(FormState.Input);
  const [students, setStudents] = useState<
    MultiValue<{ value: number; label: string }>
  >(isNew ? [] : prefillOptions);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormState(FormState.Submitting);
    try {
      const studentIds: RelateProps[] = [];
      students.map((obj) => studentIds.push({ id: obj.value }));
      const body = { id, name, studentIds };
      const res = await fetch("/api/upsert-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        setFormState(FormState.Input);
        errorToast(toaster, "Module " + name + " already exists.");
      } else {
        setFormState(FormState.Input);
        await Router.push(isNew ? "manage-modules" : "module/" + id);
      }
    } catch (error) {
      setFormState(FormState.Input);
      console.error(error);
    }
  };
  return (
    <Layout isAdmin={isAdmin}>
      <form onSubmit={submitData}>
        <VStack spacing="24px" px={[2, "5vw", "10vw", "15vw"]}>
          <FormControl isRequired>
            <FormLabel>Module Name</FormLabel>
            <Input
              value={name}
              variant="filled"
              placeholder="Name"
              isDisabled={formState === FormState.Input ? false : true}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Authorized Students</FormLabel>
            <Select
              isMulti
              name="students"
              options={allOptions}
              value={students}
              placeholder="Select Students"
              closeMenuOnSelect={false}
              onChange={(e) => setStudents(e)}
              size="lg"
              menuPosition="fixed"
            />
          </FormControl>
          {isAdmin && (
            <Button
              mt={4}
              size="lg"
              colorScheme="teal"
              type="submit"
              isLoading={formState == FormState.Input ? false : true}
            >
              {isNew ? "Add Module" : "Update Module"}
            </Button>
          )}
        </VStack>
      </form>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allStudents = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.module.findUnique({
    where: {
      id: realId,
    },
    include: {
      students: true,
    },
  });
  const oldModule = find == null ? { id: -1, name: "", students: [] } : find;
  //ret
  return {
    props: {
      allStudents: allStudents,
      oldModule: oldModule,
      admins: admins,
    },
  };
};

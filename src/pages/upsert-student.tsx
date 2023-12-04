import React, { useState } from "react";
import Router from "next/router";
import { MultiValue, Select } from "chakra-react-select";
import {
  FormControl,
  Input,
  Button,
  useToast,
  HStack,
  PinInput,
  PinInputField,
  VStack,
  FormLabel,
} from "@chakra-ui/react";
import { ModuleProps } from "components/Module";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Student";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast } from "services/toasty";
import { AdminProps } from "components/Admin";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";

enum FormState {
  Input,
  Submitting,
}
type PageProps = {
  allModules: ModuleProps[];
  oldStudent: StudentProps;
  admins: AdminProps[];
};
type RelateProps = {
  id: number;
};

export default function UpsertStudent({
  allModules,
  oldStudent,
  admins,
}: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  const allOptions = allModules.map((module) => ({
    value: module.id,
    label: module.name,
  }));
  const prefillOptions = oldStudent.modules.map((module) => ({
    value: module.id,
    label: module.name,
  }));

  const id = oldStudent.id;
  const isNew = id == -1;
  const PINLen = 10;
  const [name, setName] = useState(oldStudent.name);
  const [PIN, setPIN] = useState(oldStudent.PIN);
  const [modules, setModules] =
    useState<MultiValue<{ value: number; label: string }>>(prefillOptions);
  const [formState, setFormState] = useState(FormState.Input);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (name == "" || PIN == "") {
      errorToast(toaster, "Incomplete form");
      return;
    }
    setFormState(FormState.Submitting);
    try {
      const moduleIds: RelateProps[] = [];
      modules.map((obj) => moduleIds.push({ id: obj.value }));
      const body = { id, name, PIN, moduleIds };
      console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        setFormState(FormState.Input);
        errorToast(toaster, "Student " + name + " already exists.");
        return;
      }
      setFormState(FormState.Input);
      await Router.push(isNew ? "manage-students" : "student/" + id);
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
            <FormLabel>Student Name</FormLabel>
            <Input
              required
              value={name}
              variant="filled"
              placeholder="Name"
              isDisabled={formState === FormState.Input ? false : true}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>PIN</FormLabel>
            <HStack>
              <PinInput onChange={(e) => setPIN(e)} value={PIN}>
                {Array.from(Array(PINLen).keys()).map((key) =>
                  key == 0 ? (
                    <PinInputField key={key} required />
                  ) : (
                    <PinInputField key={key} />
                  )
                )}
              </PinInput>
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Allowed Modules</FormLabel>
            <Select
              isMulti
              name="modules"
              options={allOptions}
              value={modules}
              placeholder="Select Modules"
              closeMenuOnSelect={false}
              onChange={(e) => setModules(e)}
              size="lg"
              menuPosition="fixed"
            />
          </FormControl>
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            isLoading={formState == FormState.Input ? false : true}
          >
            {isNew ? "Add Student" : "Update Student"}
          </Button>
        </VStack>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allModules = await prisma.module.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.student.findUnique({
    where: {
      id: realId,
    },
    include: {
      modules: true,
    },
  });
  const oldStudent =
    find == null ? { id: -1, name: "", PIN: "", modules: [] } : find;
  //ret
  return {
    props: {
      allModules: allModules,
      oldStudent: oldStudent,
      admins: admins,
    },
  };
};

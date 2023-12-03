import React, { useState } from "react";
import Router from "next/router";

import { MultiValue, Select } from "chakra-react-select";

import {
  FormControl,
  Input,
  Button,
  Box,
  useToast,
  HStack,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";
import { ModuleProps } from "components/Module";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Student";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast } from "services/toasty";

enum FormState {
  Input,
  Submitting,
}
type Props = {
  allModules: ModuleProps[];
  oldStudent: StudentProps;
  admins: string[];
};
type RelateProps = {
  id: number;
};
const StudentDraft: React.FC<Props> = (props) => {
  const toaster = useToast();
  const allOptions = props.allModules.map((module) => ({
    value: module.id,
    label: module.name,
  }));
  const prefillOptions = props.oldStudent.modules.map((module) => ({
    value: module.id,
    label: module.name,
  }));

  const id = props.oldStudent.id;
  const isNew = id == -1;
  const PINLen = 10;
  const [name, setName] = useState(props.oldStudent.name);
  const [PIN, setPIN] = useState(props.oldStudent.PIN);
  const [modules, setModules] =
    useState<MultiValue<{ value: number; label: string }>>(prefillOptions);
  const [formState, setFormState] = useState(FormState.Input);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
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
      } else {
        setFormState(FormState.Input);
        await Router.push(isNew ? "manage-students" : "student/" + id);
      }
    } catch (error) {
      setFormState(FormState.Input);
      console.error(error);
    }
  };

  return (
    <Layout admins={props.admins}>
      <form onSubmit={submitData}>
        <FormControl>
          <VStack spacing="24px" px={[2, "5vw", "10vw", "15vw"]}>
            <Input
              value={name}
              variant="filled"
              marginTop={10}
              placeholder="Student name"
              isDisabled={formState === FormState.Input ? false : true}
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <HStack>
              <PinInput onChange={(e) => setPIN(e)} value={PIN}>
                {Array.from(Array(PINLen).keys()).map((key) => (
                  <PinInputField key={key}></PinInputField>
                ))}
              </PinInput>
            </HStack>
            <Select
              isMulti
              name="modules"
              options={allOptions}
              value={modules}
              placeholder="Select modules"
              closeMenuOnSelect={false}
              onChange={(e) => setModules(e)}
              size="lg"
            />
            <Button
              size="lg"
              colorScheme="teal"
              type="submit"
              isLoading={formState == FormState.Input ? false : true}
            >
              {isNew ? "Add Student" : "Update Student"}
            </Button>
          </VStack>
        </FormControl>
      </form>
    </Layout>
  );
};

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
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default StudentDraft;

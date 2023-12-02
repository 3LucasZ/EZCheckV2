import React, { useState } from "react";
import Router from "next/router";

import { MultiValue, Select } from "chakra-react-select";

import {
  FormControl,
  Input,
  Button,
  Box,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";
import { ModuleProps } from "components/Module";
import Header from "components/Header";
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
  allStudents: StudentProps[];
  oldModule: ModuleProps;
  admins: string[];
};
type RelateProps = {
  id: number;
};
const ModuleDraft: React.FC<Props> = (props) => {
  const toaster = useToast();
  const allOptions = props.allStudents.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const prefillOptions = props.oldModule.students.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const id = props.oldModule.id;
  const isNew = id == -1;
  const [name, setName] = useState<string>(isNew ? "" : props.oldModule.name);
  const [formState, setFormState] = useState(FormState.Input);
  const [students, setStudents] = useState<
    MultiValue<{ value: number; label: string }>
  >(isNew ? [] : prefillOptions);
  console.log("upsert buffer:");
  console.log("name:", name);
  console.log("students:", students);
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
    <Layout admins={props.admins}>
      <Box h="calc(100vh)">
        <div className="add-student-form">
          <form onSubmit={submitData}>
            <FormControl>
              <Input
                value={name}
                variant="filled"
                marginTop={10}
                placeholder="Module name"
                isDisabled={formState === FormState.Input ? false : true}
                onChange={(e) => setName(e.target.value)}
              ></Input>
              <Select
                isMulti
                name="students"
                options={allOptions}
                value={students}
                placeholder="Select students"
                closeMenuOnSelect={false}
                onChange={(e) => setStudents(e)}
                size="lg"
              />
              <Button
                mt={4}
                size="lg"
                colorScheme="teal"
                type="submit"
                isLoading={formState == FormState.Input ? false : true}
              >
                {isNew ? "Add Module" : "Update Module"}
              </Button>
            </FormControl>
          </form>
        </div>
      </Box>
    </Layout>
  );
};

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
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default ModuleDraft;

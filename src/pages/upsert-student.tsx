import React, { useState } from "react";
import Router from "next/router";

import { MultiValue, Select } from "chakra-react-select";

import { FormControl, Input, Button, Box, useToast } from "@chakra-ui/react";
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
  const [name, setName] = useState<string>(isNew ? "" : props.oldStudent.name);
  const [formState, setFormState] = useState(FormState.Input);
  const [modules, setModules] = useState<
    MultiValue<{ value: number; label: string }>
  >(isNew ? [] : prefillOptions);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormState(FormState.Submitting);
    try {
      const moduleIds: RelateProps[] = [];
      modules.map((obj) => moduleIds.push({ id: obj.value }));
      const body = { id, name, moduleIds };
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
        await Router.push(isNew ? "view-students" : "student/" + id);
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
                placeholder="Student name"
                isDisabled={formState === FormState.Input ? false : true}
                onChange={(e) => setName(e.target.value)}
              ></Input>
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
                mt={4}
                size="lg"
                colorScheme="teal"
                type="submit"
                isLoading={formState == FormState.Input ? false : true}
              >
                {isNew ? "Add Student" : "Update Student"}
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
  const oldStudent = find == null ? { id: -1, name: "", modules: [] } : find;
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

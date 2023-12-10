import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { StudentProps } from "components/Widget/StudentWidget";
import { GetServerSideProps } from "next";
import ModuleWidget, { ModuleProps } from "components/Widget/ModuleWidget";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import { MultiValue, Select } from "chakra-react-select";
import { useState } from "react";
import ModuleWidget2 from "components/Widget/ModuleWidget2";

type PageProps = {
  student: StudentProps;
  modules: ModuleProps[];
  admins: AdminProps[];
};

export default function StudentPage({ student, modules, admins }: PageProps) {
  //admin
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //inId and outId
  const inId = student.modules.map((item) => item.id);
  const outId = modules
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  // delete modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: student.id };
      const res = await fetch("/api/delete-student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-students" });
    } catch (error) {
      console.error(error);
    }
  };
  // ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{student.name}</Heading>
          {isAdmin && (
            <>
              <IconButton
                ml={2}
                mr={2}
                colorScheme="teal"
                aria-label="edit"
                icon={<EditIcon />}
                onClick={() =>
                  Router.push({
                    pathname: "/upsert-student",
                    query: { id: student.id },
                  })
                }
              />
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label="delete"
                icon={<DeleteIcon />}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={" the student: " + student.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={student.using ? "green" : "red"}>
            {student.using ? student.using.name : "Offline"}
          </Badge>
        }
      </Center>
      <SearchView
        setIn={inId.map((id) => {
          var module = modules.find((x) => x.id == id);
          if (!module) module = modules[0];
          return {
            name: module.name,
            widget: (
              <ModuleWidget2
                module={module}
                key={module.id}
                targetStudent={student}
                invert={false}
                isAdmin={isAdmin}
              />
            ),
          };
        })}
        setOut={outId.map((id) => {
          var module = modules.find((x) => x.id == id);
          if (!module) module = modules[0];
          return {
            name: module.name,
            widget: (
              <ModuleWidget2
                module={module}
                key={module.id}
                targetStudent={student}
                invert={true}
                isAdmin={isAdmin}
              />
            ),
          };
        })}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const student = await prisma.student.findUnique({
    where: {
      id: Number(context.params?.studentId),
    },
    include: {
      modules: true,
      using: true,
    },
  });
  const modules = await prisma.module.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      student: student,
      modules: modules,
      admins: admins,
    },
  };
};

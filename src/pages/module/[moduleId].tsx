import {
  Badge,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import StudentWidget, { StudentProps } from "components/Widget/StudentWidget";
import { ModuleProps } from "components/Widget/ModuleWidget";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import StudentWidget2 from "components/Widget/StudentWidget2";
import ModuleWidget2 from "components/Widget/ModuleWidget2";
type PageProps = {
  module: ModuleProps;
  students: StudentProps[];
  admins: AdminProps[];
};
export default function ModulePage({ module, students, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //inId outId
  const inId = module.students.map((item) => item.id);
  const outId = students
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: module.id };
      const res = await fetch("/api/delete-module", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-modules" });
    } catch (error) {
      if (debugMode) console.error(error);
    }
  };
  //ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{module.name}</Heading>
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
                    pathname: "/upsert-module",
                    query: { id: module.id },
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
                name={" the module: " + module.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={module.usedBy ? "green" : "red"}>
            {module.usedBy ? module.usedBy.name : "Standby"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: module.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetModule={module}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: module.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetModule={module}
                  invert={true}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          isAdmin={isAdmin}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const module = await prisma.module.findUnique({
    where: {
      id: Number(context.params?.moduleId),
    },
    include: {
      students: true,
      usedBy: true,
    },
  });
  const students = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      module: module,
      students: students,
      admins: admins,
    },
  };
};

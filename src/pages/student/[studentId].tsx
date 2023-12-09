import {
  Badge,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { StudentProps } from "components/StudentWidget";
import { GetServerSideProps } from "next";
import ModuleWidget from "components/ModuleWidget";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/AdminWidget";

type PageProps = {
  student: StudentProps;
  admins: AdminProps[];
};

export default function StudentPage({ student, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
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
        set={student.modules.map((module) => ({
          name: module.name,
          widget: <ModuleWidget module={module} bare={true} key={module.id} />,
        }))}
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
  const admins = await prisma.admin.findMany();
  return {
    props: {
      student: student,
      admins: admins,
    },
  };
};

import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { PrismaClient } from "@prisma/client";
import { StudentProps } from "components/Student";
import { GetServerSideProps } from "next";
import ModuleWidget from "components/Module";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import Protect from "components/Protect";
import { AdminProps } from "components/Admin";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

type Props = {
  student: StudentProps;
  admins: string[];
};

const StudentPage: React.FC<Props> = (props) => {
  // session
  const { data: session } = useSession();
  // delete modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: props.student.id };
      console.log(body);
      const res = await fetch("/api/delete-student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/view-students" });
    } catch (error) {
      console.error(error);
    }
  };
  // ret
  return (
    <Layout admins={props.admins}>
      <Center pb={3}>
        <Flex>
          <Heading>{props.student.name}</Heading>
          {session && props.admins.includes(session!.user!.email!) && (
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
                    query: { id: props.student.id },
                  })
                }
              />
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label="delete"
                icon={<DeleteIcon />}
              />
            </>
          )}

          <ConfirmDeleteModal
            isOpen={isOpen}
            onClose={onClose}
            name={" the student: " + props.student.name}
            handleDelete={handleDelete}
          />
        </Flex>
      </Center>
      <SearchView
        set={props.student.modules.map((module) => ({
          name: module.name,
          widget: <ModuleWidget module={module} key={module.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const student = await prisma.student.findUnique({
    where: {
      id: Number(context.params?.studentId),
    },
    include: {
      modules: true,
    },
  });
  const admins = await prisma.admin.findMany();
  return {
    props: {
      student: student,
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default StudentPage;

import {
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
import StudentWidget from "components/Student";
import { ModuleProps } from "components/Module";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Admin";
type PageProps = {
  module: ModuleProps;
  admins: AdminProps[];
};
export default function ModulePage({ module, admins }: PageProps) {
  console.log(module);
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: module.id };
      console.log(body);
      const res = await fetch("/api/delete-module", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/view-modules" });
    } catch (error) {
      console.error(error);
    }
  };
  //ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3}>
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
      </Center>
      <SearchView
        set={module.students.map((student) => ({
          name: student.name,
          widget: (
            <StudentWidget student={student} bare={true} key={student.id} />
          ),
        }))}
        isAdmin={isAdmin}
      />
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
  const admins = await prisma.admin.findMany();
  return {
    props: {
      module: module,
      admins: admins,
    },
  };
};

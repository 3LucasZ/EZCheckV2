import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, Icon } from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import StudentWidget from "components/Student";
import { ModuleProps } from "components/Module";
type Props = {
  module: ModuleProps;
  admins: string[];
};
const ModulePage: React.FC<Props> = (props) => {
  // session
  const { data: session } = useSession();
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: props.module.id };
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

  return (
    <Layout admins={props.admins}>
      <Center>
        <Flex>
          <Heading>{props.module.name}</Heading>
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
                    pathname: "/upsert-module",
                    query: { id: props.module.id },
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
                onClose={onClose}
                name={" the module: " + props.module.name}
                handleDelete={handleDelete}
                isOpen={isOpen}
              />
            </>
          )}
        </Flex>
      </Center>
      <Box h="5"></Box>
      <SearchView
        set={props.module.students.map((student) => ({
          name: student.name,
          widget: <StudentWidget student={student} key={student.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const module = await prisma.module.findUnique({
    where: {
      id: Number(context.params?.moduleId),
    },
    include: {
      students: true,
    },
  });
  const admins = await prisma.admin.findMany();
  return {
    props: {
      module: module,
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default ModulePage;

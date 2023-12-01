import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, Icon } from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import Header from "components/Header";
import { StorageProps } from "components/Storage";
import Router from "next/router";
import ItemWidget from "components/Item";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
type Props = {
  storage: StorageProps;
  admins: string[];
};
const StoragePage: React.FC<Props> = (props) => {
  // session
  const { data: session } = useSession();
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: props.storage.id };
      console.log(body);
      const res = await fetch("/api/delete-storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/view-storages" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout admins={props.admins}>
      <Center>
        <Flex>
          <Heading>{props.storage.name}</Heading>
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
                    pathname: "/upsert-storage",
                    query: { id: props.storage.id },
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
                name={" the storage: " + props.storage.name}
                handleDelete={handleDelete}
                isOpen={isOpen}
              />
              <IconButton
                ml={2}
                mr={2}
                colorScheme="teal"
                aria-label="edit"
                icon={<Icon as={SlPrinter} />}
                onClick={() =>
                  Router.push({
                    pathname: "/print/" + props.storage.id,
                  })
                }
              />
            </>
          )}
        </Flex>
      </Center>
      <Box h="4vh"></Box>
      <SearchView
        set={props.storage.items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const storage = await prisma.storage.findUnique({
    where: {
      id: Number(context.params?.storageId),
    },
    include: {
      items: true,
    },
  });
  const admins = await prisma.admin.findMany();
  return {
    props: {
      storage: storage,
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default StoragePage;

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Input,
  Switch,
  useToast,
} from "@chakra-ui/react";
import Admin, { AdminProps } from "components/Widget/AdminWidget2";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { errorToast, successToast } from "services/toasty";
import prisma from "services/prisma";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { poster } from "services/poster";
import AdminLayout from "components/AdminLayout";

type PageProps = {
  admins: AdminProps[];
};
export default function ManageAdmin({ admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  const [email, setEmail] = useState("");
  const toaster = useToast();

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { creator: session?.user?.email, email };
    const res = await poster("/api/add-admin", body, toaster);
    if (res.status == 200) Router.reload();
  };
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={myAdmin.supervising}>
      <Box px={[2, "5vw", "10vw", "15vw"]}>
        <Box>
          {myAdmin.supervising
            ? "I agree that when I leave, no students are left in the machine shop unsupervised."
            : "I agree to be physically present in the machine shop as a supervisor. I'm responsible for the safety of the students and will make sure they're using equipment properly."}
        </Box>
        <Box minH="8px" />
        <Center>
          <Button
            colorScheme={myAdmin.supervising ? "red" : "green"}
            onClick={async () => {
              const res = await poster(
                "/api/update-admin",
                { admin: myAdmin },
                toaster
              );
              if (res.status == 200) Router.reload();
            }}
          >
            {myAdmin.supervising ? "Stop Supervising" : "Start Supervising"}
          </Button>
        </Center>
      </Box>
      <Box minH="8px" />
      <Divider />
      <Box minH="8px" />
      <Flex px={[2, "5vw", "10vw", "15vw"]} gap={"8px"}>
        <Input
          variant="filled"
          placeholder="Admin email"
          value={email}
          onChange={handleCreateChange}
        />
        {isAdmin && (
          <IconButton
            colorScheme="teal"
            aria-label="edit"
            icon={<AddIcon />}
            onClick={submitData}
          />
        )}
      </Flex>
      {isAdmin && (
        <SearchView
          setIn={admins.map((admin) => ({
            name: admin.email,
            widget: <Admin admin={admin} key={admin.id} />,
          }))}
          isAdmin={isAdmin}
          isEdit={false}
        />
      )}
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const admins = await prisma.admin.findMany();
  return {
    props: { admins: admins },
  };
};

import { Box, Button, Center, useToast, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { poster } from "services/poster";
import AdminLayout from "components/Layout/AdminLayout";
import { User } from "next-auth";
import UserWidget from "components/Widget/UserWidget";
import { responsiveHeaderFontSize, responsivePx } from "services/constants";

type PageProps = {
  users: User[];
};
export default function ManageAdmin({ users }: PageProps) {
  //--template--
  const { data: session } = useSession();
  const me = session?.user;
  const toaster = useToast();
  //--handle add/rm admin--
  const admins = users.find((user) => user.isAdmin);
  const addAdmin = async (user: User) => {
    const body = { id: user.id, isAdmin: true };
    const res = await poster("/api/update-student", body, toaster);
    if (res.status == 200) Router.reload();
  };
  const rmAdmin = async (user: User) => {
    const body = { id: user.id, isAdmin: false };
    const res = await poster("/api/update-student", body, toaster);
    if (res.status == 200) Router.reload();
  };
  const startSupervising = async () => {
    const body = { id: me?.id, isSupervising: true };
    const res = await poster("/api/update-student", body, toaster);
    if (res.status == 200) Router.reload();
  };
  const stopSupervising = async () => {
    const body = { id: me?.id, isSupervising: false };
    const res = await poster("/api/update-student", body, toaster);
    if (res.status == 200) Router.reload();
  };
  //--ret--
  return (
    <AdminLayout isAdmin={me?.isAdmin} isSupervisor={me?.isSupervising}>
      <Box px={responsivePx}>
        <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
          Supervision
        </Text>
        <Box>
          {me?.isSupervising
            ? "I agree that when I leave, no students are left in the machine shop unsupervised."
            : "I agree to be physically present in the machine shop as a supervisor. I'm responsible for the safety of the students and will make sure they're using equipment properly."}
        </Box>
        <Box minH="8px" />
        <Center>
          <Button
            bg={me?.isSupervising ? "red.300" : "teal.300"}
            _hover={{ bg: me?.isSupervising ? "red.400" : "teal.400" }}
            color="white"
            onClick={me?.isSupervising ? stopSupervising : startSupervising}
          >
            {me?.isSupervising ? "Stop Supervising" : "Start Supervising"}
          </Button>
        </Center>
      </Box>
      <Box minH="8" />
      <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
        Admins
      </Text>
      <SearchView
        setIn={users
          .filter((user) => user.isAdmin)
          .map((user) => ({
            name: user.name,
            widget: (
              <UserWidget
                id={user.id}
                name={user.name}
                email={user.email}
                image={user.image}
                isSupervising={user.isSupervising}
                disabled={true}
                isEdit={true}
                inverted={false}
                askConfirmation={true}
                handleRm={() => rmAdmin(user)}
              />
            ),
          }))}
        setOut={users
          .filter((user) => !user.isAdmin)
          .map((user) => ({
            name: user.name,
            widget: (
              <UserWidget
                id={user.id}
                name={user.name}
                email={user.email}
                image={user.image}
                disabled={true}
                isEdit={true}
                inverted={true}
                askConfirmation={true}
                handleAdd={() => addAdmin(user)}
              />
            ),
          }))}
        isEdit={false}
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: { users },
  };
};

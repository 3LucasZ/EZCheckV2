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
import Admin, { AdminProps } from "archive/AdminWidget2";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/SearchView";
import { errorToast, successToast } from "services/toasty";
import prisma from "services/prisma";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { poster } from "services/poster";
import AdminLayout from "components/Layout/AdminLayout";
import { User } from "next-auth";
import UserWidget from "components/Widget/UserWidget";
import { start } from "repl";
import { responsivePx } from "services/constants";

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
      <Box minH="8px" />
      <Divider />
      <Box minH="8px" />
      <SearchView
        setIn={users.map((user) => ({
          name: user.name,
          widget: (
            <UserWidget
              id={user.id}
              name={user.name}
              email={user.email}
              image={user.image}
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

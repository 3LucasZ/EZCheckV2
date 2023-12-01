import { Box, Button, HStack, Input, useToast } from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";
import Admin, { AdminProps } from "components/Admin";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { errorToast, successToast } from "services/toasty";
import prisma from "services/prisma";

type PageProps = {
  admins: AdminProps[];
};

const Admins: React.FC<PageProps> = (props) => {
  const [email, setEmail] = useState("");
  const toaster = useToast();

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { email };
      const res = await fetch("/api/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        errorToast(toaster, "Admin " + email + " already exists.");
      } else {
        Router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout admins={props.admins.map((admin) => admin.email)}>
      <HStack pl="25vw" pr="25vw">
        <Input
          variant="filled"
          placeholder="Admin email"
          value={email}
          onChange={handleCreateChange}
        />
        <Button onClick={submitData}>Create Admin</Button>
      </HStack>
      <Box h="2" />
      <SearchView
        set={props.admins.map((admin) => ({
          name: admin.email,
          widget: <Admin admin={admin} key={admin.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const admins = await prisma.admin.findMany();
  return {
    props: { admins: admins },
  };
};

export default Admins;

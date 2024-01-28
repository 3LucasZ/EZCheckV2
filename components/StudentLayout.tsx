import {
  Avatar,
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, signIn, useSession } from "next-auth/react";
import React, { ReactNode } from "react";
import { debugMode } from "services/constants";
import Layout from "./Layout";
import Header from "./Header";
import AppBar from "./AppBar";

type LayoutProps = {
  isStudent: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  children: ReactNode;
};

export default function StudentLayout({
  isStudent,
  isAdmin,
  isSupervisor,
  children,
}: LayoutProps) {
  const forbiddenPage = (
    <>
      <Heading px={[2, "5vw", "10vw", "15vw"]} py="30vh">
        Sorry, you do not have access to this page. Please contact an
        administrator to grant you access.
      </Heading>
    </>
  );
  return (
    <Layout>
      <Header isAdmin={isAdmin} isSupervisor={isSupervisor} />
      {isStudent ? <>{children}</> : forbiddenPage}
    </Layout>
  );
}

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
import { debugMode, responsivePx } from "services/constants";
import Layout from "./MainLayout";
import Header from "./Header";
import AppBar from "./AppBar";

type LayoutProps = {
  isAdmin: boolean | undefined;
  isSupervisor: boolean | undefined;
  children?: ReactNode;
};

export default function AdminLayout({
  isAdmin,
  isSupervisor,
  children,
}: LayoutProps) {
  const forbiddenPage = (
    <>
      <Heading px={responsivePx} py="30vh">
        Sorry, you do not have access to this page. Please contact an
        administrator to grant you access.
      </Heading>
    </>
  );
  return (
    <Layout>
      <Header isAdmin={isAdmin} isSupervisor={isSupervisor} />
      {isAdmin ? (
        <>
          {children}
          <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
          <AppBar />
        </>
      ) : (
        forbiddenPage
      )}
    </Layout>
  );
}

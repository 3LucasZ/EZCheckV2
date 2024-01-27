import {
  Avatar,
  Box,
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
  isAdmin: boolean;
  isSupervisor: boolean;
  children: ReactNode;
};

export default function AdminLayout({
  isAdmin,
  isSupervisor,
  children,
}: LayoutProps) {
  return (
    <Layout>
      <Header isAdmin={isAdmin} isSupervisor={isSupervisor} />
      {children}
      <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
      <AppBar />
    </Layout>
  );
}

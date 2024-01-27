import {
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, signIn, useSession } from "next-auth/react";
import Router from "next/router";
import React from "react";
import { debugMode } from "services/constants";

type AvatarMenuProps = {
  isAdmin: boolean;
  isSupervisor?: boolean;
};

export default function AvatarMenu({ isAdmin, isSupervisor }: AvatarMenuProps) {
  const { data: session } = useSession();
  return (
    <Menu>
      <MenuButton pos="relative" float="right" right="2">
        <Avatar
          name={session?.user?.name ? session.user.name : ""}
          src={session?.user?.image ? session.user.image : ""}
        >
          {isAdmin && (
            <AvatarBadge
              boxSize="1.25em"
              bg={isSupervisor ? "green.500" : "red.500"}
            />
          )}
        </Avatar>
      </MenuButton>
      <MenuList textAlign="left">
        <Text px={3} py={1.5}>
          {session ? session.user!.name : "Guest"}
        </Text>
        <Text px={3} py={1.5}>
          {session ? session.user!.email : "You are not signed in"}
        </Text>
        <MenuDivider />
        <MenuItem
          onClick={(e) => {
            Router.push("/");
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            Router.push("/help");
          }}
        >
          Help
        </MenuItem>
        {isAdmin && (
          <MenuItem
            onClick={(e) => {
              Router.push("/admin/manage-admin");
            }}
          >
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            if (debugMode) console.log(e);
            e.preventDefault();

            session
              ? signOut({ callbackUrl: "/" })
              : signIn("google", { callbackUrl: "/" });
          }}
        >
          {session ? "Sign out" : "Sign in"}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

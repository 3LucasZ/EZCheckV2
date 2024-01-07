import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, signIn, useSession } from "next-auth/react";
import React from "react";
import { debugMode } from "services/constants";

export default function Header() {
  const { data: session } = useSession();
  return (
    <Menu>
      <MenuButton pos="relative" float="right" right="2">
        <Avatar
          name={session?.user?.name ? session.user.name : ""}
          src={session?.user?.image ? session.user.image : ""}
        />
      </MenuButton>
      <MenuList>
        {session && (
          <Text px={3} py={1}>
            {session ? session.user!.name : "You are not signed in"}
          </Text>
        )}
        <Text px={3} py={1}>
          {session ? session.user!.email : "You are not signed in"}
        </Text>
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

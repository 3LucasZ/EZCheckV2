import { Divider, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import React from "react";
import AvatarMenu from "./AvatarMenu";

type HeaderProps = {
  isAdmin: boolean;
  isSupervisor?: boolean;
};
export default function Header({ isAdmin, isSupervisor }: HeaderProps) {
  return (
    <>
      <HStack
        minW="100vw"
        display={"flex"}
        flexDir="row"
        textAlign={"center"}
        py="1"
      >
        <Heading size={["xl", "2xl", "3xl"]} color="teal.500" w="100%">
          EZCheck
        </Heading>
        <AvatarMenu isAdmin={isAdmin} isSupervisor={isSupervisor} />
      </HStack>
      <Divider />
    </>
  );
}

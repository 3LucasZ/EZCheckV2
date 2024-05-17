import { Divider, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import React from "react";
import AvatarMenu from "./AvatarMenu";

type HeaderProps = {
  isAdmin: boolean | undefined;
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
        <Heading
          size={["xl"]}
          bgGradient={"linear(to-b, orange.200, red.300)"} //light
          bgClip={"text"}
          w="100%"
        >
          EZCheck
        </Heading>
        <AvatarMenu isAdmin={isAdmin} isSupervisor={isSupervisor} />
      </HStack>
      <Divider />
    </>
  );
}

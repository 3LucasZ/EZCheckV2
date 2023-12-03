import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { signIn, signOut, useSession } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";

type HeaderProps = {
  admins: string[];
};
export default function Header({ admins = [] }: HeaderProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const loginUI = (
    <Stack>
      <Text>{session ? session.user!.email : "You are not signed in"}</Text>
      <Flex>
        <IconButton
          isLoading={loading}
          colorScheme="teal"
          variant="solid"
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            session ? signOut() : signIn("google");
          }}
          aria-label={session ? "Sign out" : "Sign in"}
          icon={<Icon as={session ? PiSignOutBold : PiSignInBold} />}
        />
        {session &&
          (admins.includes(session!.user!.email!) ||
            session!.user!.email == "lucas.j.zheng@gmail.com") && (
            <>
              <Box w="2"></Box>
              <IconButton
                colorScheme="teal"
                onClick={() => {
                  Router.push("/manage-admin");
                }}
                aria-label="Admin Dashboard"
                icon={<Icon as={RiAdminLine} />}
              />
            </>
          )}
      </Flex>
    </Stack>
  );
  return (
    <div>
      <Box h="1"></Box>
      <HStack spacing={10}>
        <Box w={"33%"}></Box>
        <Box w={"33%"}>
          <Center>
            <Link href={"/"} style={{ textDecoration: "none" }}>
              <Heading size={["xl", "2xl", "3xl"]} color="teal.500">
                EZCheck
              </Heading>
            </Link>
          </Center>
        </Box>
        <Box>{loginUI}</Box>
      </HStack>
      <Box h="5"></Box>
    </div>
  );
}

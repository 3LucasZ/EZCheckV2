import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
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
      <Text>
        {session
          ? "Signed in as " + session.user!.email
          : "You are not signed in"}
      </Text>
      <Flex>
        <Button
          isLoading={loading}
          colorScheme="teal"
          variant="solid"
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            session ? signOut() : signIn("google");
          }}
        >
          {session ? "Sign out" : "Sign in"}
        </Button>
        {session &&
          (admins.includes(session!.user!.email!) ||
            session!.user!.email == "lucas.j.zheng@gmail.com") && (
            <>
              <Box w="2"></Box>
              <Button
                colorScheme="teal"
                onClick={() => {
                  Router.push("/manage-admin");
                }}
              >
                Admin Dashboard
              </Button>
            </>
          )}
      </Flex>
    </Stack>
  );
  return (
    <div>
      <Box h="1"></Box>

      <SimpleGrid columns={3} spacing={10}>
        <Box></Box>
        <Box>
          <Center>
            <Link href={"/"} style={{ textDecoration: "none" }}>
              <Heading as="h1" size="4xl" color="teal.500">
                EZ-Find
              </Heading>
            </Link>
          </Center>
        </Box>
        <Box>{loginUI}</Box>
      </SimpleGrid>
      <Box h="5"></Box>
    </div>
  );
}

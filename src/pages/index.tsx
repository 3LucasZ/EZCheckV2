import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Image,
  AspectRatio,
  HStack,
} from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import prisma from "services/prisma";
import { FiActivity, FiUsers } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine, GiTeacher } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import { RiAdminLine } from "react-icons/ri";
import { PiStudent, PiStudentBold, PiStudentDuotone } from "react-icons/pi";
import Header from "components/Layout/Header";
import AvatarMenu from "components/Layout/AvatarMenu";

import { responsivePx } from "services/constants";
import FeatureCard from "components/FeatureCard";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  return (
    <>
      <Layout>
        <Header isAdmin={isAdmin} isSupervisor={session?.user.supervising} />
        <Box px={responsivePx} overflow={"auto"}>
          <Box h="20"></Box>
          <Heading
            fontWeight={600}
            fontSize={["3xl", "4xl", "5xl"]}
            lineHeight={"110%"}
          >
            Machine management{" "}
            <Text
              as={"span"}
              bgGradient={"linear(to-r, orange.300, red.400)"}
              bgClip={"text"}
            >
              made easy
            </Text>
          </Heading>
          <Box h="4"></Box>
          <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} color="gray.500">
            Valley Christian's official machine shop managing platform.
          </Text>
          <Box h="8"></Box>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.300"}
            _hover={{ bg: "orange.500" }}
            onClick={(e) => {
              e.preventDefault();
              session
                ? signOut({ callbackUrl: "/" })
                : signIn("google", { callbackUrl: "/main" });
            }}
          >
            Get started
          </Button>
          <Box h="20"></Box>
          {/* <Text color={"gray.500"}>
            Whether you are a student or administrator, this is the ultimate
            management tool for your Never miss a meeting. Never be late for one
            too. Keep track of your meetings and receive smart reminders in
            appropriate times. Read your smart “Daily Agenda” every morning.
          </Text> */}
          <Stack direction={["column", "row"]} gap="8">
            <Box>
              <FeatureCard
                icon={FiUsers}
                title="Students"
                content="View your information on-demand and real-time."
              />
              <Box h="12" />
              <FeatureCard
                icon={FiActivity}
                title="Administrators"
                content="Manage machines and students without any hassle."
              />
            </Box>
            <Box w="100%" display={"flex"} justifyContent="center">
              <Image
                src="images/module.png"
                maxH="400px"
                aspectRatio={2 / 3}
              ></Image>
            </Box>
          </Stack>
          {/* <Box h="10"></Box>
          <Center>
            <Text fontSize={["2xl", "3xl"]}>Thank you to our sponsors:</Text>
          </Center>
          <HStack w="100%" justify={"center"}>
            <Image src="images/VCS.png" w="20%" p="4"></Image>
            <Image src="images/Q4.png" w="20%"></Image>
          </HStack> */}
        </Box>
      </Layout>
    </>
  );
}

import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { Box, Link, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { AdminProps } from "archive/AdminWidget2";
import Header from "components/Layout/Header";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Layout>
      <Header isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising} />
      <Box px="5" overflowY="auto">
        <Text fontSize="4xl">Version</Text>
        <Text fontSize="xl">2.1 (Alpha)</Text>
        <Text fontSize="4xl">Q&A</Text>
        <Text fontSize="xl">
          Q: Why is the website considered unsafe and untrusted by Safari and
          Chrome?
        </Text>
        <Text fontSize="xl">
          A: The website is in the alpha version and running on a local
          development server. Rest assured, your data is safe. Check out our
          privacy policy and terms of service below.
        </Text>
        <Text fontSize="xl">Q: What does the invert checkbox do?</Text>
        <Text fontSize="xl">
          A: When invert mode is on, the display will tell you what machines a
          student does not have access to, and which students can not use a
          machine.
        </Text>
        <Text fontSize={"4xl"}>Documents</Text>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/867a55b1-f612-458c-a96b-73337e43fe99"
          display={"block"}
          fontSize={"xl"}
        >
          Privacy Policy
        </Link>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/a127aadd-459e-4134-89e1-c2773f78391f"
          display={"block"}
          fontSize={"xl"}
        >
          Terms of Service
        </Link>
        <Text fontSize="4xl">Contact Us</Text>
        <Text fontSize="xl">
          Please do not hesitate to email us at sahuber@vcs.net if you have any
          questions, need further instruction, or have suggestions for
          improvement.
        </Text>
        <Box h="10px"></Box>
      </Box>
    </Layout>
  );
}

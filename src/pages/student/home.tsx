import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  PinInput,
  PinInputField,
  SimpleGrid,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { checkAdmin, getMyStudent } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import Header from "components/Header";
import AppBar from "components/AppBar";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  CheckIcon,
  CloseIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import MachineWidget2 from "components/Widget/MachineWidget2";

import { PiSignOutBold } from "react-icons/pi";
import { StudentProps } from "components/Widget/StudentWidget";
import MachineWidget, { MachineProps } from "components/Widget/MachineWidget";
import { useEffect, useState } from "react";
import MachineWidget3 from "components/Widget/MachineWidget3";
import { PINLen } from "services/constants";
import Router from "next/router";
import { poster } from "services/poster";

type PageProps = {
  admins: AdminProps[];
  students: StudentProps[];
  machines: MachineProps[];
};
export default function Home({ admins, students, machines }: PageProps) {
  const { data: session, status } = useSession();
  const toaster = useToast();
  const isAdmin = checkAdmin(session, admins);
  const myStudent = getMyStudent(session, students);
  console.log(myStudent);
  const inId = myStudent.machines.map((item) => item.id);
  const outId = machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));

  const [allowMode, setAllowMode] = useState(true);
  const [PIN, setPIN] = useState(myStudent.PIN);
  useEffect(() => {
    setPIN(myStudent.PIN);
  }, [session]);

  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const submitData = async () => {
    const body = {
      id: myStudent.id,
      email: myStudent.email,
      name: myStudent.name,
      PIN,
    };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      Router.push(Router.asPath);
    } else {
      setPIN(myStudent.PIN);
    }
  };

  return (
    <Layout>
      <Header />
      <Stack px={[2, "5vw", "10vw", "15vw"]} alignItems={"center"} spacing="0">
        <Flex flexDir="row" py="8px" gap="8px">
          <Heading>PIN</Heading>
          <ButtonGroup isAttached>
            <IconButton
              icon={
                editing ? (
                  <CheckIcon />
                ) : visible ? (
                  <ViewOffIcon />
                ) : (
                  <ViewIcon />
                )
              }
              colorScheme={editing ? "green" : "teal"}
              onClick={() => {
                if (editing) {
                  submitData();
                  setEditing(false);
                } else {
                  setVisible(!visible);
                }
              }}
              aria-label=""
            />
            <IconButton
              icon={editing ? <CloseIcon /> : <EditIcon />}
              colorScheme={editing ? "red" : "blue"}
              aria-label=""
              onClick={() => {
                if (editing) {
                  setEditing(false);
                  setPIN(myStudent.PIN);
                } else {
                  setEditing(true);
                }
              }}
            />
          </ButtonGroup>
        </Flex>
        <HStack spacing={["4px", "8px"]}>
          <PinInput
            onChange={(e) => setPIN(e)}
            value={PIN}
            size={["sm", "md"]}
            mask={!visible && !editing}
          >
            {Array.from(Array(PINLen).keys()).map((key) =>
              key == 0 ? (
                <PinInputField
                  key={key}
                  pointerEvents={editing ? "initial" : "none"}
                />
              ) : (
                <PinInputField
                  key={key}
                  pointerEvents={editing ? "initial" : "none"}
                />
              )
            )}
          </PinInput>
        </HStack>
      </Stack>
      <Box minH="8px" />
      <Flex flexDir="row" px={[2, "5vw", "10vw", "15vw"]}>
        <Box
          w="100%"
          p="8px"
          roundedLeft="md"
          bg={allowMode ? "teal.200" : "gray.100"}
          _hover={{ bg: allowMode ? "teal.200" : "gray.200" }}
          textAlign={"center"}
          onClick={() => setAllowMode(true)}
        >
          <Heading>{"Allowed"}</Heading>
        </Box>
        <Box
          w="100%"
          p="8px"
          roundedRight="md"
          bg={allowMode ? "gray.100" : "teal.200"}
          _hover={{ bg: allowMode ? "gray.200" : "teal.200" }}
          textAlign={"center"}
          onClick={() => setAllowMode(false)}
        >
          <Heading>{"Restricted"}</Heading>
        </Box>
      </Flex>

      <SearchView
        setIn={(allowMode ? inId : outId).map((id) => {
          var machine = machines.find((x) => x.id == id);
          if (!machine) machine = machines[0];
          return {
            name: machine.name,
            widget: <MachineWidget3 machine={machine} key={machine.id} />,
          };
        })}
        isAdmin={isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  const students = await prisma.student.findMany({
    include: { machines: true },
  });
  const machines = await prisma.machine.findMany();
  return {
    props: {
      students,
      admins,
      machines,
    },
  };
};

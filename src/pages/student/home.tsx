import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { AdminProps } from "archive/AdminWidget2";
import { ViewIcon, CheckIcon, ViewOffIcon } from "@chakra-ui/icons";
import SearchView from "components/SearchView";

import { StudentProps } from "archive/StudentWidget";
import { useEffect, useState } from "react";
import Router from "next/router";
import { poster } from "services/poster";
import StudentLayout from "components/Layout/StudentLayout";
import MachineWidget from "components/Widget/MachineWidget";
import { MachineProps } from "archive/MachineWidget";

type PageProps = {
  students: StudentProps[];
  machines: MachineProps[];
};
export default function Home({ students, machines }: PageProps) {
  const { data: session, status } = useSession();
  const toaster = useToast();
  const user = session?.user;
  const isAdmin = user?.isAdmin;

  const inId = user ? user?.machines.map((item) => item.id) : [];
  const outId = machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));

  const [allowMode, setAllowMode] = useState(true);
  const [PIN, setPIN] = useState(user?.PIN);
  useEffect(() => {
    setPIN(user?.PIN);
  }, [session]);

  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const submitData = async () => {
    const body = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      PIN,
    };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      Router.push(Router.asPath);
    } else {
      setPIN(user?.PIN);
    }
  };

  return (
    <StudentLayout isAdmin={isAdmin} isStudent={true} isSupervisor={false}>
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
            {/* <IconButton
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
            /> */}
          </ButtonGroup>
        </Flex>
        <HStack spacing={["4px", "8px"]}>
          <PinInput
            onChange={(e) => setPIN(e)}
            value={PIN}
            size={["sm", "md"]}
            mask={!visible && !editing}
          >
            {
              // Array.from(Array(PINLen).keys())
              Array.from(Array(PIN?.length).keys()).map((key) =>
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
              )
            }
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
            widget: (
              <MachineWidget
                key={machine.id}
                name={machine.name}
                description={""}
                image={""}
                count={0}
                url={""}
              />
            ),
          };
        })}
        isEdit={false}
      />
    </StudentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const students = await prisma.user.findMany({
    where: { isAdmin: false },
    include: { machines: true },
  });
  const machines = await prisma.machine.findMany();
  return {
    props: {
      students,
      machines,
    },
  };
};

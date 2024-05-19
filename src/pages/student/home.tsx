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
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { ViewIcon, CheckIcon, ViewOffIcon } from "@chakra-ui/icons";
import SearchView from "components/SearchView";

import { useEffect, useState } from "react";
import Router from "next/router";
import { poster } from "services/poster";
import StudentLayout from "components/Layout/StudentLayout";
import MachineWidget from "components/Widget/MachineWidget";
import { MachineProps } from "types/db";

type PageProps = {
  machines: MachineProps[];
};
export default function Home({ machines }: PageProps) {
  //--template--
  const { data: session, status } = useSession();
  console.log(session);
  const user = session?.user;
  const toaster = useToast();
  //--relations--
  const inId = user!.certificates.map((cert) => cert.machineId);
  const outId = machines
    .map((machine) => machine.id)
    .filter((id) => !inId.includes(id));
  //--states--
  const [allowMode, setAllowMode] = useState(true);
  const [PIN, setPIN] = useState(user?.PIN);
  useEffect(() => {
    setPIN(user?.PIN);
  }, [session]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  //--submit--
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
  //--ret--
  return (
    <StudentLayout
      isAdmin={user?.isAdmin}
      isStudent={true}
      isSupervisor={false}
    >
      <Stack px={[2, "5vw", "10vw", "15vw"]} alignItems={"center"} spacing="0">
        <Flex flexDir="row" py="8px" gap="8px">
          <Heading>PIN</Heading>
          <ButtonGroup isAttached hidden={user?.PIN == undefined}>
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
        {user?.PIN == undefined ? (
          <Text>
            You have not been assigned a PIN yet. You will be unable to use any
            machines until you have received a PIN from an administrator.
          </Text>
        ) : (
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
        )}
      </Stack>
      <Box minH="8px" />
      <Flex flexDir="row" px={[2, "5vw", "10vw", "15vw"]}>
        <Box
          w="100%"
          p="8px"
          roundedLeft="md"
          bg={allowMode ? "orange.200" : "gray.100"}
          _hover={{ bg: allowMode ? "orange.200" : "gray.200" }}
          textAlign={"center"}
          onClick={() => setAllowMode(true)}
        >
          <Heading>{"Allowed"}</Heading>
        </Box>
        <Box
          w="100%"
          p="8px"
          roundedRight="md"
          bg={allowMode ? "gray.100" : "orange.200"}
          _hover={{ bg: allowMode ? "gray.200" : "orange.200" }}
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
  const machines = await prisma.machine.findMany();
  return {
    props: {
      machines,
    },
  };
};

import React, { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  useToast,
  FormLabel,
  Flex,
  Heading,
  HStack,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { MachineProps } from "components/Widget/MachineWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import AdminLayout from "components/AdminLayout";
import Router from "next/router";
import { poster } from "services/poster";
import { ArrowRightIcon } from "@chakra-ui/icons";

type PageProps = {
  name: String;
  admins: AdminProps[];
};

export default function ConfigMachine({ name, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  const toaster = useToast();
  const hostname = name.replace(" ", "-");
  const reachable = false;
  const [target, setTarget] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [prog, setProg] = useState(0.0);

  useEffect(() => {
    const url = "http://" + hostname + ".local" + "/api/getInfo";
    console.log(url);
    const res = fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // const body = { id, name };
    // const res = await poster("/api/upsert-machine", body, toaster);
    // if (res.status == 200) {
    //   await Router.push(
    //     isNew ? "/admin/manage-machines" : "/admin/view-student/" + id
    //   );
    // }
  };

  const upload = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          setStatus(xhr.responseText);
        } else if (xhr.status == 400) {
          alert("There was an error 400");
        } else {
          alert("something else other than 200 was returned");
        }
      }
    };
    xhr.upload.addEventListener(
      "progress",
      function (evt) {
        if (evt.lengthComputable) {
          var per = evt.loaded / evt.total;
          setProg(per);
        }
      },
      false
    );
    xhr.open("POST", "/update");
    console.log(xhr);
    xhr.send(data);
  };

  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={myAdmin.supervising}>
      <Flex
        flexDir="column"
        gap="5"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        pt={5}
        h="100%"
      >
        <Heading>{name}</Heading>
        <FormControl>
          <FormLabel>Id</FormLabel>
          <HStack>
            <Input
              value={id}
              variant="filled"
              placeholder="Id"
              onChange={(e) => setId(e.target.value)}
            />
            <IconButton
              colorScheme="teal"
              type="submit"
              onClick={submitData}
              aria-label={""}
              icon={<ArrowRightIcon />}
            />
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel>Target</FormLabel>
          <HStack>
            <Input
              value={target}
              variant="filled"
              placeholder="Name"
              onChange={(e) => setTarget(e.target.value)}
            />
            <IconButton
              colorScheme="teal"
              type="submit"
              onClick={submitData}
              aria-label={""}
              icon={<ArrowRightIcon />}
            />
          </HStack>
        </FormControl>
        <form
          method="POST"
          action="#"
          encType="multipart/form-data"
          id="upload_form"
        >
          <FormLabel>Firmware</FormLabel>
          <input type="file" />
          <Box pt="12px">
            <Button
              colorScheme="teal"
              type="submit"
              onClick={submitData}
              aria-label={""}
            >
              Flash
            </Button>
          </Box>
        </form>
      </Flex>
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const admins = await prisma.admin.findMany();
  const { name } = context.query;
  //ret
  return {
    props: {
      name,
      admins,
    },
  };
};

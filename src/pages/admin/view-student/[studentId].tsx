import {
  Badge,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  useToast,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { StudentProps } from "archive/StudentWidget";
import { GetServerSideProps } from "next";
import { MachineProps } from "types/db";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "archive/AdminWidget2";
import MachineWidget2 from "archive/MachineWidget2";
import { poster } from "services/poster";
import { PiSignOutBold } from "react-icons/pi";
import AdminLayout from "components/Layout/AdminLayout";
import MachineWidget from "components/Widget/MachineWidget";
import { User } from "next-auth";

type PageProps = {
  student: User;
  machines: MachineProps[];
};

export default function StudentPage(props: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const user = session?.user;
  //toaster
  const toaster = useToast();
  //inId and outId
  const inId = props.student.certificates.map((cert) => cert.machineId);
  const outId = props.machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //modal - delete student
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: user?.id };
    const res = await poster("/api/delete-student", body, toaster);
    if (res.status == 200) await Router.push("/admin/manage-students");
  };
  //student force log out
  const handleLeave = async () => {
    const body = {
      machineName: props.student.using?.name,
    };
    const res = await poster("/api/post/leave-machine", body, toaster);
    if (res.status == 200) Router.reload();
  };
  // ret
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Center pb={3} flexDir={"column"}>
        <Flex gap="8px" px={[2, "5vw", "10vw", "15vw"]} pt="8px" w="100%">
          <Center
            w="100%"
            wordBreak={"break-all"}
            fontSize={["xl", "2xl", "2xl", "3xl", "4xl"]}
          >
            {props.student.name + " (" + props.student.email + ")"}
          </Center>
          <Spacer />
          {user?.isAdmin && (
            <>
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label=""
                icon={<DeleteIcon />}
              />
              <IconButton
                onClick={handleLeave}
                colorScheme="blue"
                aria-label=""
                icon={<PiSignOutBold />}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={user.name!}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={props.student.using ? "green" : "red"}>
            {props.student.using ? props.student.using.name : "Offline"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var machine = props.machines.find((x) => x.id == id);
            if (!machine) machine = props.machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget
                  name={machine.name}
                  description={""}
                  image={""}
                  count={0}
                  url={`/admin/view-machine/${machine.id}`}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var machine = props.machines.find((x) => x.id == id);
            if (!machine) machine = props.machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget
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
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const student = await prisma.user.findUnique({
    where: {
      id: String(context.params?.studentId),
    },
    include: {
      certificates: true,
      using: true,
    },
  });
  const machines = await prisma.machine.findMany();
  return {
    props: {
      student,
      machines,
    },
  };
};

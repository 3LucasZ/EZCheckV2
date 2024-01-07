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
import { StudentProps } from "components/Widget/StudentWidget";
import { GetServerSideProps } from "next";
import { MachineProps } from "components/Widget/MachineWidget";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import MachineWidget2 from "components/Widget/MachineWidget2";
import { poster } from "services/poster";
import { PiSignOutBold } from "react-icons/pi";
import AdminLayout from "components/AdminLayout";

type PageProps = {
  student: StudentProps;
  machines: MachineProps[];
  admins: AdminProps[];
};

export default function StudentPage({ student, machines, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //toaster
  const toaster = useToast();
  //inId and outId
  const inId = student.machines.map((item) => item.id);
  const outId = machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //modal - delete student
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: student.id };
    const res = await poster("/api/delete-student", body, toaster);
    if (res.status == 200) await Router.push({ pathname: "/manage-students" });
  };
  //student force log out
  const handleLeave = async () => {
    const body = {
      machineName: student.using.name,
    };
    const res = await poster("/api/post/leave-machine", body, toaster);
    if (res.status == 200) Router.reload();
  };
  // ret
  return (
    <AdminLayout>
      <Center pb={3} flexDir={"column"}>
        <Flex gap="8px" px={[2, "5vw", "10vw", "15vw"]} pt="8px" w="100%">
          <Center
            w="100%"
            wordBreak={"break-all"}
            fontSize={["xl", "2xl", "2xl", "3xl", "4xl"]}
          >
            {student.name}
          </Center>
          <Spacer />
          {isAdmin && (
            <>
              <IconButton
                colorScheme="teal"
                aria-label=""
                icon={<EditIcon />}
                onClick={() =>
                  Router.push({
                    pathname: "/upsert-student",
                    query: { id: student.id },
                  })
                }
              />
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
                name={student.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={student.using ? "green" : "red"}>
            {student.using ? student.using.name : "Offline"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var machine = machines.find((x) => x.id == id);
            if (!machine) machine = machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget2
                  machine={machine}
                  key={machine.id}
                  targetStudent={student}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var machine = machines.find((x) => x.id == id);
            if (!machine) machine = machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget2
                  machine={machine}
                  key={machine.id}
                  targetStudent={student}
                  invert={true}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          isAdmin={isAdmin}
          isEdit={false}
        />
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const student = await prisma.student.findUnique({
    where: {
      id: Number(context.params?.studentId),
    },
    include: {
      machines: true,
      using: true,
    },
  });
  const machines = await prisma.machine.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      student: student,
      machines: machines,
      admins: admins,
    },
  };
};

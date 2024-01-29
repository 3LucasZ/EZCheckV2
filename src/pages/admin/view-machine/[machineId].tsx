import {
  Badge,
  Center,
  Flex,
  IconButton,
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { StudentProps } from "components/Widget/StudentWidget";
import { MachineProps } from "components/Widget/MachineWidget";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import StudentWidget2 from "components/Widget/StudentWidget2";
import AdminLayout from "components/AdminLayout";
import { poster } from "services/poster";
type PageProps = {
  machine: MachineProps;
  students: StudentProps[];
  admins: AdminProps[];
};
export default function MachinePage({ machine, students, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const myAdmin = getMyAdmin(session, admins);
  //toaster
  const toaster = useToast();
  //inId outId
  const inId = machine.students.map((item) => item.id);
  const outId = students
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: machine.id };
    const res = await poster("/api/delete-machine", body, toaster);
    if (res.status == 200)
      await Router.push({ pathname: "/admin/manage-machines" });
  };
  //ret
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={myAdmin.supervising}>
      <Center pb={3} flexDir={"column"}>
        <Flex gap="8px" px={[2, "5vw", "10vw", "15vw"]} pt="8px" w="100%">
          <Center
            w="100%"
            wordBreak={"break-all"}
            fontSize={["xl", "2xl", "2xl", "3xl", "4xl"]}
          >
            {machine.name}
          </Center>
          <Spacer />
          {isAdmin && (
            <>
              <IconButton
                colorScheme="teal"
                aria-label="edit"
                icon={<EditIcon />}
                onClick={() =>
                  Router.push({
                    pathname: "/admin/machine-form",
                    query: { id: machine.id },
                  })
                }
              />
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label="delete"
                icon={<DeleteIcon />}
              />
              <IconButton
                onClick={() =>
                  Router.push({
                    pathname: "/admin/config",
                    query: { name: machine.name },
                  })
                }
                colorScheme="blue"
                aria-label="delete"
                icon={<SettingsIcon />}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={" the machine: " + machine.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={machine.usedBy ? "green" : "red"}>
            {machine.usedBy ? machine.usedBy.name : "Standby"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: student.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetMachine={machine}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: student.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetMachine={machine}
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
  const machine = await prisma.machine.findUnique({
    where: {
      id: Number(context.params?.machineId),
    },
    include: {
      students: true,
      usedBy: true,
    },
  });
  const students = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      machine: machine,
      students: students,
      admins: admins,
    },
  };
};

import {
  Badge,
  ButtonGroup,
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
import { StudentProps } from "archive/StudentWidget";
import { MachineProps } from "types/db";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "archive/AdminWidget2";
import StudentWidget2 from "archive/StudentWidget2";
import AdminLayout from "components/Layout/AdminLayout";
import { poster } from "services/poster";
import UserWidget from "components/Widget/UserWidget";
import { UserProps } from "types/db";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { useState } from "react";
import { responsivePx } from "services/constants";
import EditableTitle from "components/Composable/EditableTitle";
import EditableSubtitle from "components/Composable/EditableSubtitle";
type PageProps = {
  machine: MachineProps;
  students: UserProps[];
};
export default function MachinePage({ machine, students }: PageProps) {
  //--copy paste on every page--
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  //--state--
  const [isEdit, setIsEdit] = useState(false);
  //--new state--
  const [newName, setNewName] = useState(machine.name);
  const [newDescription, setNewDescription] = useState(machine.description);
  const [newRelations, setNewRelations] = useState(machine.students);
  //--in and out relations--
  const inId = machine.students.map((item) => item.id);
  const outId = students
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //--handle delete modal--
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: machine.id };
    const res = await poster("/api/delete-machine", body, toaster);
    if (res.status == 200)
      await Router.push({ pathname: "/admin/manage-machines" });
  };
  //--handle view modal--
  //--handle upload image--
  //--handle update machine
  const handleUpdate = async () => {
    const body = { id: machine.id };
    const res = await poster("/api/update-machine", body, toaster);
    if (res.status == 200) Router.reload();
  };
  //--ret--
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={session?.user.supervising}>
      <Flex px={responsivePx}>
        <EditableTitle
          value={isEdit ? newName : machine.name}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewName(e.target.value)
          }
          isDisabled={!isEdit}
        />
        <Center>
          <ButtonGroup spacing="2" pl="2" isAttached>
            <IconButton
              onClick={onOpen}
              colorScheme="red"
              aria-label="delete"
              icon={<DeleteIcon />}
            />
            <ConfirmDeleteModal
              isOpen={isOpen}
              onClose={onClose}
              name={" the machine: " + machine.name}
              handleDelete={handleDelete}
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
          </ButtonGroup>
        </Center>
      </Flex>
      <Flex px={responsivePx} flexDir="column">
        <EditableSubtitle
          value={
            isEdit
              ? newDescription
              : machine.description
              ? machine.description
              : "No description."
          }
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewDescription(e.target.value)
          }
          isDisabled={!isEdit}
          placeholder="Description"
        />
        {/* <Badge colorScheme={machine.usedBy ? "green" : "red"} w="24" h="8">
          {machine.usedBy ? machine.usedBy.name : "Standby"}
        </Badge> */}
      </Flex>
      <SearchView
        setIn={inId.map((id) => {
          var student = students.find((x) => x.id == id);
          if (!student) student = students[0];
          return {
            name: student.name,
            widget: (
              <UserWidget
                name={student.name}
                email={student.email}
                image={student.image}
                isAdmin={false}
                id={student.id}
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
              <UserWidget
                name={student.name}
                email={student.email}
                image={student.image}
                isAdmin={false}
                id={student.id}
              />
            ),
          };
        })}
        isEdit={false}
      />
      <EditFAB
        isEdit={isEdit}
        onEdit={() => {
          setNewName(machine.name);
          setNewDescription(machine.description);
          setNewRelations(machine.students);
          setIsEdit(true);
        }}
        onSave={handleUpdate}
        onCancel={() => setIsEdit(false)}
      />
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
  const students = await prisma.user.findMany({ where: { isAdmin: false } });
  return {
    props: {
      machine,
      students,
    },
  };
};

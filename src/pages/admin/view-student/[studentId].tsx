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
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Icon,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { StudentProps } from "archive/StudentWidget";
import { GetServerSideProps } from "next";
import { CertificateProps, MachineProps } from "types/db";
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
import {
  PINLen,
  responsiveHeaderFontSize,
  responsivePx,
  responsiveSubheaderFontSize,
} from "services/constants";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type PageProps = {
  student: User;
  machines: MachineProps[];
};

export default function StudentPage(props: PageProps) {
  //--copy paste on every page--
  const { data: session, status } = useSession();
  const user = session?.user;
  const toaster = useToast();
  //--state--
  const [isVisible, setIsVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //--new state--
  const [newPIN, setNewPIN] = useState(
    props.student.PIN ? props.student.PIN : ""
  );
  const [newCerts, setNewCerts] = useState(props.student.certificates);
  //--handle relations--
  const inId = newCerts.map((cert) => cert.machineId);
  const outId = props.machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  function addCert(certificate: CertificateProps) {
    const copy = [...newCerts];
    copy.push(certificate);
    setNewCerts(copy);
  }
  function rmCert(certificate: CertificateProps) {
    setNewCerts(newCerts.filter((t) => t.machineId != certificate.machineId));
  }
  //student force log out
  const handleLeave = async () => {
    const body = {
      machineName: props.student.using?.name,
    };
    const res = await poster("/api/post/leave-machine", body, toaster);
    if (res.status == 200) Router.reload();
  };

  //update
  const handleUpdate = async () => {
    const body = {
      id: props.student.id,
      newPIN,
      newCerts,
    };
    const res = await poster("/api/update-student", body, toaster);
    if (res.status == 200) Router.reload();
  };
  //--ret--
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Flex px={responsivePx}>
        <Center
          w="100%"
          wordBreak={"break-all"}
          fontSize={responsiveHeaderFontSize}
        >
          {props.student.name}
        </Center>
        <Spacer />
        {/* {user?.isAdmin && (
          <>
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
        )} */}
      </Flex>
      <Flex px={responsivePx}>
        <Center
          w="100%"
          wordBreak={"break-all"}
          fontSize={responsiveSubheaderFontSize}
          color="gray"
        >
          {props.student.email}
        </Center>
      </Flex>

      {/* <Badge colorScheme={props.student.using ? "green" : "red"}>
        {props.student.using ? props.student.using.name : "Offline"}
      </Badge> */}
      <Flex px={responsivePx}>
        <HStack spacing={["4px", "8px"]} maxW="100%" mx="auto">
          <PinInput
            onChange={(e) => setNewPIN(e)}
            value={!isVisible && !isEdit ? newPIN + "      " : newPIN}
            size={["sm", "md"]}
            mask={!isVisible}
          >
            {Array.from(Array(PINLen).keys()).map((key) => (
              <PinInputField key={key} />
            ))}
          </PinInput>
          <IconButton
            icon={isVisible ? <Icon as={FiEyeOff} /> : <Icon as={FiEye} />}
            bg="teal.300"
            _hover={{ bg: "teal.400" }}
            color={"white"}
            onClick={() => setIsVisible(!isVisible)}
            aria-label={""}
          />
        </HStack>
      </Flex>

      {status != "loading" && (
        <SearchView
          setIn={newCerts.map((cert) => {
            return {
              name: cert.machine.name,
              widget: (
                <MachineWidget
                  image={cert.machine.image}
                  name={cert.machine.name}
                  description={cert.machine.description}
                  type2={true}
                  name2={cert.issuer.name}
                  email2={cert.issuer.email}
                  url={`/admin/view-machine/${cert.machine.id}`}
                  isEdit={isEdit}
                  inverted={false}
                  handleRemove={() => rmCert(cert)}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            const machine =
              props.machines.find((x) => x.id == id) || props.machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget
                  name={machine.name}
                  description={machine.description}
                  image={machine.image}
                  url={`/admin/view-machine/${machine.id}`}
                  isEdit={isEdit}
                  inverted={true}
                  handleAdd={() =>
                    addCert({
                      recipient: props.student,
                      recipientId: props.student.id,
                      machine: machine,
                      machineId: machine.id,
                      issuer: user,
                      issuerId: user!.id,
                    })
                  }
                />
              ),
            };
          })}
          isEdit={false}
        />
      )}
      <EditFAB
        isEdit={isEdit}
        onEdit={() => {
          setIsEdit(true);
        }}
        onSave={handleUpdate}
        onCancel={() => {
          setNewPIN(props.student.PIN);
          setNewCerts(props.student.certificates);
          setIsEdit(false);
        }}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const student = await prisma.user.findUnique({
    where: {
      id: String(context.params?.studentId),
    },
    include: {
      certificates: {
        include: {
          issuer: true,
          machine: true,
        },
      },
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

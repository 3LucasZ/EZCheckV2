import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import Router from "next/router";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

export type AdminProps = {
  id: number;
  email: string;
};

const AdminWidget: React.FC<{
  admin: AdminProps;
}> = ({ admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: admin.id };
      console.log(body);
      const res = await fetch("/api/delete-admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        alert("Error, id:" + admin.id);
      } else {
        //alert("Success");
        Router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Flex width="100%">
      <Box
        borderRadius="md"
        bg="teal.300"
        color="white"
        px={4}
        h={8}
        roundedRight="none"
        minWidth="90%"
      >
        <Text width="100%">{admin.email}</Text>
      </Box>
      <IconButton
        onClick={onOpen}
        colorScheme="red"
        aria-label="delete"
        icon={<DeleteIcon />}
        h={8}
        roundedLeft="none"
        borderRadius="md"
        minWidth="10%"
      />
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        name={" the admin: " + admin.email}
        handleDelete={handleDelete}
      />
    </Flex>
  );
};

export default AdminWidget;

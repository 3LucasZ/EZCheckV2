import { HStack, Icon, IconButton } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";

export default function AppBar() {
  return (
    <HStack
      position="fixed"
      bottom="0"
      w="100%"
      bg="teal.300"
      h={"calc(50px + env(safe-area-inset-bottom))"}
    >
      <IconButton
        w={"33%"}
        rounded="unset"
        aria-label={""}
        icon={<Icon as={FaHome} boxSize="23" />}
        bg="teal.300"
        _hover={{ bg: "teal.400" }}
        color="white"
        pb="env(safe-area-inset-bottom)"
      />
      <IconButton
        w={"33%"}
        rounded="unset"
        aria-label={""}
        icon={<Icon as={MdManageAccounts} boxSize="30" />}
        bg="teal.300"
        _hover={{ bg: "teal.400" }}
        color="white"
        pb="env(safe-area-inset-bottom)"
      />
      <IconButton
        w={"33%"}
        rounded="unset"
        aria-label={""}
        icon={<Icon as={GiSewingMachine} boxSize="30" />}
        bg="teal.300"
        _hover={{ bg: "teal.400" }}
        color="white"
        pb="env(safe-area-inset-bottom)"
      />
    </HStack>
  );
}

import { HStack, Icon, IconButton } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import AppBarBtn from "./AppBarBtn";

export default function AppBar() {
  return (
    <HStack
      position="fixed"
      bottom="0"
      w="100%"
      bg="teal.300"
      h={"calc(50px + env(safe-area-inset-bottom))"}
      p={0}
    >
      <AppBarBtn icon={FaHome} href="/" />
      <AppBarBtn icon={MdManageAccounts} href="/manage-students" />
      <AppBarBtn icon={GiSewingMachine} href="/manage-machines" />
      <AppBarBtn icon={IoDocumentText} href="/log" />
      <AppBarBtn icon={IoIosInformationCircle} href="/help" />
    </HStack>
  );
}

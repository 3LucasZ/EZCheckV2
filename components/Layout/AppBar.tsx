import { Box, Button, Center, HStack, Icon } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";

import { BiSolidWrench } from "react-icons/bi";
import { IconType } from "react-icons";
import Router from "next/router";

export default function AppBar() {
  return (
    <Box position="fixed" bottom="0" w="100%">
      <HStack gap={0} h={"calc(50px + env(safe-area-inset-bottom))"}>
        <AppBarBtn icon={FaHome} href="/admin/home" />
        <AppBarBtn icon={MdManageAccounts} href="/admin/manage-students" />
        <AppBarBtn icon={GiSewingMachine} href="/admin/manage-machines" />
        <AppBarBtn icon={IoDocumentText} href="/admin/view-logs" />
        <AppBarBtn icon={BiSolidWrench} href="/admin/config" />
      </HStack>
    </Box>
  );
}

type AppBarBtnProps = {
  icon: IconType;
  href: string;
};
function AppBarBtn({ icon, href }: AppBarBtnProps) {
  return (
    <Box
      w={"100%"}
      h={"100%"}
      aria-label={""}
      pt="13px"
      onClick={() => Router.push(href)}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
      bgGradient="linear(to-b, orange.200, red.300)"
      color="white"
      _hover={{ color: "red.300" }}
    >
      {
        <Center>
          <Icon as={icon} boxSize={6} />
        </Center>
      }
    </Box>
  );
}

import { Button, Center, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";
import Router from "next/router";

type AppBarBtnProps = {
  icon: IconType;
  href: string;
};
export default function AppBarBtn({ icon, href }: AppBarBtnProps) {
  return (
    <Button
      w={"33%"}
      h={"100%"}
      rounded="unset"
      aria-label={""}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
      py="13px"
      onClick={() => Router.push(href)}
    >
      {
        <Center>
          <Icon as={icon} boxSize="24px" />
        </Center>
      }
    </Button>
  );
}

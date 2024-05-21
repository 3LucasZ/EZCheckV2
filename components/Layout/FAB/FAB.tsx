//COPY FROM EZFIND2
import {
  Icon,
  Text,
  HStack,
  ComponentWithAs,
  IconProps,
  Box,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type FABProps = {
  onClick: Function;
  icon: IconType | ComponentWithAs<"svg", IconProps>;
  name?: string;
  bottomOffset?: number;
  hidden?: boolean;
  //style
  sx: any;
};

export const FAB = ({
  icon,
  onClick,
  name,
  bottomOffset,
  hidden,
  //style
  sx,
}: FABProps) => {
  !bottomOffset && (bottomOffset = 0);
  return (
    <Box
      //---position/transition---
      position={"fixed"}
      right={"8px"}
      bottom={`calc(58px + env(safe-area-inset-bottom) + ${bottomOffset}px)`}
      transition={"bottom 0.3s"}
    >
      <HStack
        //---sizing + spacing---
        minH="16"
        minW="16"
        maxW={name ? "" : "16"}
        py={name ? "3" : "auto"}
        px={name ? "6" : "auto"}
        //---looks---
        rounded="full"
        sx={sx}
        //---misc---
        onClick={(e) => onClick()}
        zIndex={100}
        hidden={hidden}
      >
        <Icon as={icon} boxSize="6" p="0" m="0" w="100%" />
        <Text fontSize={"2xl"} hidden={name ? false : true}>
          {name}
        </Text>
      </HStack>
    </Box>
  );
};

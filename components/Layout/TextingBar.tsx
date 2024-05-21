import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, HStack, Icon, IconButton, Input } from "@chakra-ui/react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FiChevronRight, FiMessageCircle } from "react-icons/fi";
import { tealBtn } from "services/constants";

export function TextingBar() {
  return (
    <Box
      position={"fixed"}
      bottom={"60px"}
      left={0}
      right={0}
      mx="2"
      minH="60px"
      maxH="60px"
    >
      <HStack>
        <Input
          variant="outline"
          placeholder="New log"
          rounded={"full"}
          minH="60px"
          w="100%"
        />
        <Box
          minH={"60px"}
          maxH="60px"
          minW={"60px"}
          rounded="full"
          sx={tealBtn}
          verticalAlign={"center"}
        >
          <Icon aria-label={""} as={FiMessageCircle} p="4" w="100%" h="100%" />
        </Box>
      </HStack>
    </Box>
  );
}

import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

type FABProps = {
  onClick: Function;
};

export const FAB = ({ onClick }: FABProps) => {
  return (
    <Button
      aria-label={""}
      position="fixed"
      right="8px"
      bottom="calc(58px + env(safe-area-inset-bottom))"
      rounded="full"
      h="16"
      w="16"
      onClick={(e) => onClick()}
      zIndex={100}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
    >
      <AddIcon boxSize="6" />
    </Button>
  );
};

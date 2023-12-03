import { Box, Link } from "@chakra-ui/react";

import { StudentProps } from "./Student";

export type ModuleProps = {
  id: number;
  name: string;
  students: StudentProps[];
  lastSeen?: string;
  usedBy?: StudentProps;
  IP?: string;
};

const ModuleWidget: React.FC<{ module: ModuleProps }> = ({ module }) => {
  let hoverState = {
    bg: "blue.400",
  };
  return (
    <Link
      href={"/module/" + module.id}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
    >
      <Box
        borderRadius="md"
        bg="blue.300"
        color="white"
        px={4}
        h={8}
        _hover={hoverState}
      >
        {module.name}
      </Box>
    </Link>
  );
};

export default ModuleWidget;

import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { ModuleProps } from "./Module";

export type StudentProps = {
  id: number;
  name: string;
  PIN: string;
  modules: ModuleProps[];
  using: ModuleProps;
};

const StudentWidget: React.FC<{ student: StudentProps }> = ({ student }) => {
  let hoverState = {
    bg: "teal.400",
  };
  return (
    <Link href={"/student/" + student.id} style={{ textDecoration: "none" }}>
      <Box
        borderRadius="md"
        bg="teal.300"
        color="white"
        px={4}
        h={8}
        _hover={hoverState}
      >
        {student.name}
      </Box>
    </Link>
  );
};

export default StudentWidget;

import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { ModuleProps } from "./Module";

export type StudentProps = {
  id: number;
  name: string;
  PIN: string;
  modules: ModuleProps[];
  using: ModuleProps;
};
type StudentWidgetProps = {
  student: StudentProps;
  bare?: boolean;
};

export default function StudentWidgetProps({
  student,
  bare,
}: StudentWidgetProps) {
  let hoverState = {};
  return (
    <Link
      href={"/student/" + student.id}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
      _hover={hoverState}
      display="flex"
      position="relative"
    >
      <Grid templateColumns={["repeat(2, 1fr)"]} w="100%">
        <GridItem
          bg="teal.300"
          color="white"
          px={4}
          h={8}
          colSpan={!bare ? 1 : 2}
        >
          {student.name}
        </GridItem>
        {!bare && (
          <GridItem bg="orange.300" color="white" px={4} h={8} colSpan={1}>
            {student.using ? student.using.name : "Offline"}
          </GridItem>
        )}
      </Grid>
      <Box
        position="absolute"
        w="100%"
        h="100%"
        border="1px solid white"
        borderRadius={"md"}
        outline="2px solid white"
      ></Box>
    </Link>
  );
}

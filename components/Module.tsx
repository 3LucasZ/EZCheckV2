import { Box, Grid, GridItem, Link } from "@chakra-ui/react";

import { StudentProps } from "./Student";

export type ModuleProps = {
  id: number;
  name: string;
  students: StudentProps[];
  lastSeen?: string;
  usedBy?: StudentProps;
  IP?: string;
};
type ModuleWidgetProps = {
  module: ModuleProps;
  bare?: boolean;
};

export default function ModuleWidget({ module, bare }: ModuleWidgetProps) {
  let hoverState = {};
  return (
    <Link
      href={"/module/" + module.id}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
      _hover={hoverState}
      display="flex"
      position="relative"
    >
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} w="100%">
        <GridItem
          bg="blue.300"
          color="white"
          px={4}
          h={8}
          colSpan={!bare ? 2 : 4}
        >
          {module.name}
        </GridItem>
        {!bare && (
          <>
            <GridItem
              bg={module.usedBy ? "teal.300" : "red.300"}
              color="white"
              px={4}
              h={8}
              colSpan={1}
            >
              {module.usedBy ? module.usedBy.name : "Standby"}
            </GridItem>
            <GridItem
              bg={module.IP ? "orange.300" : "red.400"}
              color="white"
              px={4}
              h={8}
              colSpan={1}
            >
              {module.IP ? module.IP : "Not seen"}
            </GridItem>
          </>
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

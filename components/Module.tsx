import { Box, Flex, Grid, GridItem, Link } from "@chakra-ui/react";

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
        <GridItem bg="blue.300" color="white" px={4} h={8} colSpan={2}>
          {module.name}
        </GridItem>
        <GridItem bg="orange.300" color="white" px={4} h={8} colSpan={1}>
          {module.usedBy?.name}
        </GridItem>
        <GridItem bg="red.300" color="white" px={4} h={8} colSpan={1}>
          {module.IP}
        </GridItem>
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
};

export default ModuleWidget;

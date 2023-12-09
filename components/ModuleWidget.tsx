import { Box, Grid, GridItem, Link } from "@chakra-ui/react";

import { StudentProps } from "./StudentWidget";
import BaseWidget from "./BaseWidget";

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
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} w="100%">
        <BaseWidget
          href={"/module/" + module.id}
          title={module.name}
          bg={"blue.300"}
          colSpan={bare ? 4 : 2}
        />
        {!bare && (
          <>
            <BaseWidget
              href={module.usedBy ? "/student/" + module.usedBy.id : ""}
              title={module.usedBy ? module.usedBy.name : "Standby"}
              bg={module.usedBy ? "teal.300" : "red.300"}
              colSpan={1}
            />
            <BaseWidget
              href={module.IP ? module.IP : ""}
              title={module.IP ? module.IP : "Not seen"}
              bg={module.IP ? "orange.300" : "red.400"}
              colSpan={1}
            />
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
    </Box>
  );
}

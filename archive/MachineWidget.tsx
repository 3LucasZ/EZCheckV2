import { Box, Grid } from "@chakra-ui/react";
import { StudentProps } from "./StudentWidget";
import BaseWidget from "./BaseWidget";
import { MachineProps } from "types/db";

type MachineWidgetProps = {
  machine: MachineProps;
};

export default function MachineWidget({ machine }: MachineWidgetProps) {
  return (
    <Box display="flex">
      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
        w="100%"
        overflow="hidden"
        rounded="md"
      >
        <BaseWidget
          href={"/admin/view-machine/" + machine.id}
          title={machine.name}
          bg={"blue.300"}
          bgHover="blue.400"
          colSpan={2}
        />
        <BaseWidget
          href={
            machine.usedBy ? "/admin/view-student/" + machine.usedBy.id : ""
          }
          title={machine.usedBy ? machine.usedBy.name : "Standby"}
          bg={machine.usedBy ? "teal.300" : "red.300"}
          bgHover={machine.usedBy ? "teal.400" : "red.300"}
          colSpan={1}
        />
        <BaseWidget
          title={machine.IP ? machine.IP : "Not seen"}
          bg={machine.IP ? "orange.300" : "red.400"}
          // bgHover={machine.IP ? "orange.400" : "red.400"}
          colSpan={1}
        />
      </Grid>
    </Box>
  );
}

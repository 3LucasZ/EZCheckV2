import { Box, Grid } from "@chakra-ui/react";
import { StudentProps } from "./StudentWidget";
import BaseWidget from "./BaseWidget";

export type MachineProps = {
  id: number;
  name: string;
  students: StudentProps[];
  lastSeen?: string;
  usedBy?: StudentProps;
  IP?: string;
};
type MachineWidgetProps = {
  machine: MachineProps;
};

export default function MachineWidget({ machine }: MachineWidgetProps) {
  return (
    <Box display="flex">
      <Grid
        templateColumns={["repeat(2, 1fr)"]}
        w="100%"
        overflow="hidden"
        rounded="md"
      >
        <BaseWidget title={machine.name} bg={"blue.300"} colSpan={1} />
        <BaseWidget
          title={machine.usedBy ? "Used" : "Standby"}
          bg={machine.usedBy ? "red.300" : "green.300"}
          colSpan={1}
        />
      </Grid>
    </Box>
  );
}

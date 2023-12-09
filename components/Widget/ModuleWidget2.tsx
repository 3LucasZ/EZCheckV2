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
    <Grid>
      <BaseWidget
        href={"/module/" + module.id}
        title={module.name}
        bg={"blue.300"}
        colSpan={bare ? 4 : 2}
        round={true}
      />
    </Grid>
  );
}

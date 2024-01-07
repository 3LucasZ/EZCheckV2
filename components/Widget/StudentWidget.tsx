import { Box, Grid } from "@chakra-ui/react";
import { MachineProps } from "./MachineWidget";
import BaseWidget from "./BaseWidget";

export type StudentProps = {
  id: number;
  email: string;
  name: string;
  PIN: string;
  machines: MachineProps[];
  using: MachineProps;
};
type StudentWidgetProps = {
  student: StudentProps;
};

export default function StudentWidget({ student }: StudentWidgetProps) {
  return (
    <Box display="flex">
      <Grid
        templateColumns={["repeat(2, 1fr)"]}
        w="100%"
        overflow="hidden"
        rounded="md"
      >
        <BaseWidget
          href={"/student/" + student.id}
          title={student.name}
          bg={"teal.300"}
          bgHover={"teal.400"}
          colSpan={1}
        />
        <BaseWidget
          href={student.using ? "/machine/" + student.using.id : ""}
          title={student.using ? student.using.name : "Offline"}
          bg={student.using ? "blue.300" : "red.300"}
          bgHover={student.using ? "blue.400" : "red.300"}
          colSpan={1}
        />
      </Grid>
    </Box>
  );
}

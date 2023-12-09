import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { ModuleProps } from "./ModuleWidget";
import BaseWidget from "./BaseWidget";

export type StudentProps = {
  id: number;
  name: string;
  PIN: string;
  modules: ModuleProps[];
  using: ModuleProps;
};
type StudentWidgetProps = {
  student: StudentProps;
};

export default function StudentWidgetProps({ student }: StudentWidgetProps) {
  return (
    <BaseWidget
      href={"/student/" + student.id}
      title={student.name}
      bg={"teal.300"}
      colSpan={0}
    />
  );
}

import { MachineProps } from "./MachineWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { poster } from "services/poster";

type StudentWidget2Props = {
  student: StudentProps;
  targetMachine: MachineProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function StudentWidget2({
  student,
  targetMachine,
  invert,
  isAdmin,
}: StudentWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    const body = {
      id: targetMachine.id,
      name: targetMachine.name,
      studentIds: targetMachine.students
        .filter((item) => item.id != student.id)
        .map((item) => ({ id: item.id })),
    };
    const res = await poster("/api/upsert-machine", body, toaster);
    if (res.status == 200) {
      Router.push(Router.asPath);
    }
  };
  const handleAdd = async () => {
    const studentIds = targetMachine.students.map((item) => ({
      id: item.id,
    }));
    studentIds.push({ id: student.id });
    const body = {
      id: targetMachine.id,
      name: targetMachine.name,
      studentIds,
    };
    if (debugMode) console.log(body);
    const res = await poster("/api/upsert-machine", body, toaster);
    if (res.status == 200) {
      Router.push(Router.asPath);
    }
  };
  return (
    <BaseWidget2
      href={"/admin/view-student/" + student.id}
      title={student.name}
      bg={"teal.300"}
      bgHover={"teal.400"}
      handleRemove={handleRemove}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}

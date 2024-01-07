import { MachineProps } from "./MachineWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";

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
    try {
      const body = {
        id: targetMachine.id,
        name: targetMachine.name,
        studentIds: targetMachine.students
          .filter((item) => item.id != student.id)
          .map((item) => ({ id: item.id })),
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + student.id);
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  const handleAdd = async () => {
    try {
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
      const res = await fetch("/api/upsert-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        errorToast(toaster, "Unknown error on id: " + student.id);
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  return (
    <BaseWidget2
      href={"view-student/" + student.id}
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

import { MachineProps } from "./MachineWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";
import { poster } from "services/poster";

type MachineWidget2Props = {
  machine: MachineProps;
  targetStudent: StudentProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function MachineWidget2({
  machine,
  targetStudent,
  invert,
  isAdmin,
}: MachineWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    const body = {
      id: targetStudent.id,
      email: targetStudent.email,
      name: targetStudent.name,
      PIN: targetStudent.PIN,
      machineIds: targetStudent.machines
        .filter((item) => item.id != machine.id)
        .map((item) => ({ id: item.id })),
    };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      Router.push("/admin/view-student/" + targetStudent.id);
    }
  };
  const handleAdd = async () => {
    const machineIds = targetStudent.machines.map((item) => ({
      id: item.id,
    }));
    machineIds.push({ id: machine.id });
    const body = {
      id: targetStudent.id,
      email: targetStudent.email,
      name: targetStudent.name,
      PIN: targetStudent.PIN,
      machineIds,
    };
    const res = await poster("/api/upsert-student", body, toaster);
    if (res.status == 200) {
      Router.push("/admin/view-student/" + targetStudent.id);
    }
  };
  return (
    <BaseWidget2
      href={"/admin/view-machine/" + machine.id}
      title={machine.name}
      bg={"blue.300"}
      bgHover={"blue.400"}
      handleRemove={handleRemove}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}

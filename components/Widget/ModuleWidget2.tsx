import { ModuleProps } from "./ModuleWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";

type ModuleWidget2Props = {
  module: ModuleProps;
  targetStudent: StudentProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function ModuleWidget2({
  module,
  targetStudent,
  invert,
  isAdmin,
}: ModuleWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    try {
      const body = {
        id: targetStudent.id,
        name: targetStudent.name,
        PIN: targetStudent.PIN,
        moduleIds: targetStudent.modules
          .filter((item) => item.id != module.id)
          .map((item) => ({ id: item.id })),
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + module.id);
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
      const moduleIds = targetStudent.modules.map((item) => ({ id: item.id }));
      moduleIds.push({ id: module.id });
      const body = {
        id: targetStudent.id,
        name: targetStudent.name,
        PIN: targetStudent.PIN,
        moduleIds,
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + module.id);
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
      href={"/module/" + module.id}
      title={module.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}

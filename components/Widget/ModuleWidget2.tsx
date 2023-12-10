import { ModuleProps } from "./ModuleWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";

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
      if (res.status == 500) {
        alert("Error, id:" + module.id);
      } else {
        Router.reload();
      }
    } catch (error) {
      if (debugMode) console.error(error);
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
      if (res.status == 500) {
        alert("Error, id:" + module.id);
      } else {
        Router.reload();
      }
    } catch (error) {
      if (debugMode) console.error(error);
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

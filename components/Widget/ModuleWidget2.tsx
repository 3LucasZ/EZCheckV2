import { ModuleProps } from "./ModuleWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";

type ModuleWidget2Props = {
  module: ModuleProps;
  targetStudent: StudentProps;
};

export default function ModuleWidget2({
  module,
  targetStudent,
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
      console.log(body);
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
      console.error(error);
    }
  };
  return (
    <BaseWidget2
      href={"/module/" + module.id}
      title={module.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
    />
  );
}

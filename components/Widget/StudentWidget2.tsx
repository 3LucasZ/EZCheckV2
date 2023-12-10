import { ModuleProps } from "./ModuleWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";

type StudentWidget2Props = {
  student: StudentProps;
  targetModule: ModuleProps;
  invert: boolean;
};

export default function StudentWidget2({
  student,
  targetModule,
  invert,
}: StudentWidget2Props) {
  const handleRemove = async () => {
    try {
      const body = {
        id: targetModule.id,
        name: targetModule.name,
        studentIds: targetModule.students
          .filter((item) => item.id != student.id)
          .map((item) => ({ id: item.id })),
      };
      console.log(body);
      const res = await fetch("/api/upsert-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        alert(res.statusText);
      } else {
        Router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleAdd = async () => {
    try {
      const studentIds = targetModule.students.map((item) => ({ id: item.id }));
      studentIds.push({ id: student.id });
      const body = {
        id: targetModule.id,
        name: targetModule.name,
        studentIds,
      };
      console.log(body);
      const res = await fetch("/api/upsert-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        alert(res.statusText);
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
      title={student.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
    />
  );
}

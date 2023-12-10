import Router from "next/router";
import BaseWidget2 from "./BaseWidget2";
import { StudentProps } from "./StudentWidget";

type StudentWidget2Props = {
  student: StudentProps;
};

export default function StudentWidget2Props({ student }: StudentWidget2Props) {
  const handleDelete = async () => {
    try {
      const body = { id: student.id, modules: student.modules.map(student) };
      console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        alert("Error, id:" + student.id);
      } else {
        Router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <BaseWidget2
      href={"/student/" + student.id}
      title={student.name}
      bg={"teal.300"}
      handleRemove={function (): void {
        throw new Error("Function not implemented.");
      }}
      safeRemove={false}
    />
  );
}

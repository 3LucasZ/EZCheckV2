import { AdminProps } from "components/Widget/AdminWidget2";
import { StudentProps } from "components/Widget/StudentWidget";
import { Session } from "next-auth";

export function checkAdmin(
  session: Session | null,
  admins: AdminProps[]
): boolean {
  return (
    (session &&
      session.user &&
      session.user.email &&
      (admins.map((admin) => admin.email).includes(session.user.email) ||
        session.user.email == "lucas.j.zheng@gmail.com" ||
        session.user.email == "lucas.zheng@warriorlife.net")) == true
  );
}

export function getMyAdmin(
  session: Session | null,
  admins: AdminProps[]
): AdminProps {
  const res = admins.find((admin) => admin.email == session?.user?.email);
  if (res) return res;
  else return { id: -1, email: "lucas.j.zheng@gmail.com", supervising: false };
}

export function checkStudent(
  session: Session | null,
  students: StudentProps[]
): boolean {
  return (
    (session &&
      session.user &&
      session.user.email &&
      students.map((student) => student.email).includes(session.user.email)) ==
    true
  );
}

export function getMyStudent(
  session: Session | null,
  students: StudentProps[]
): StudentProps {
  const res = students.find((student) => student.email == session?.user?.email);
  if (res) return res;
  else
    return {
      id: -1,
      name: "Lucas Zheng",
      email: "lucas.j.zheng@gmail.com",
      PIN: "", //when it renders for a few seconds incorrectly, at least it won't show anything ;)
      machines: [],
    };
}

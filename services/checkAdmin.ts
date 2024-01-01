import { AdminProps } from "components/Widget/AdminWidget2";
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

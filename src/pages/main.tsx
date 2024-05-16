import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Main() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  if (isAdmin) {
    redirect("/admin/home");
  } else {
    redirect("/student/home");
  }
}

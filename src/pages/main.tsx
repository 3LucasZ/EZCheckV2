import Header from "components/Layout/Header";
import Layout from "components/Layout/Layout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Router from "next/router";
import { useEffect } from "react";

export default function Main() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;

  useEffect(() => {
    Router.push(isAdmin ? "/admin/home" : "/student/home");
  });
  return (
    <Layout>
      <Header isAdmin={false}></Header>
    </Layout>
  );
}

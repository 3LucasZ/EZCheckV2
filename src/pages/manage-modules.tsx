import ModuleWidget, { ModuleProps } from "components/Widget/ModuleWidget";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";

type PageProps = {
  modules: ModuleProps[];
  admins: AdminProps[];
};
export default function ManageModules({ modules, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <SearchView
        setIn={modules.map((module) => ({
          name: module.name,
          widget: <ModuleWidget module={module} key={module.id} />,
        }))}
        url={"upsert-module"}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const modules = await prisma.module.findMany({ include: { usedBy: true } });
  const admins = await prisma.admin.findMany();
  return {
    props: { modules: modules, admins: admins },
  };
};

import { PrismaClient } from "@prisma/client";
import ModuleWidget, { ModuleProps } from "components/Module";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";

type Props = {
  modules: ModuleProps[];
  admins: string[];
};

const Modules: React.FC<Props> = (props) => {
  return (
    <Layout admins={props.admins}>
      <SearchView
        set={props.modules.map((module) => ({
          name: module.name,
          widget: <ModuleWidget module={module} key={module.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const modules = await prisma.module.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: { modules: modules, admins: admins.map((admin) => admin.email) },
  };
};

export default Modules;

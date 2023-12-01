import { PrismaClient } from "@prisma/client";
import StorageWidget, { StorageProps } from "components/Storage";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";

type Props = {
  storages: StorageProps[];
  admins: string[];
};

const Storages: React.FC<Props> = (props) => {
  return (
    <Layout admins={props.admins}>
      <SearchView
        set={props.storages.map((storage) => ({
          name: storage.name,
          widget: <StorageWidget storage={storage} key={storage.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const storages = await prisma.storage.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: { storages: storages, admins: admins.map((admin) => admin.email) },
  };
};

export default Storages;

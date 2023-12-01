import { PrismaClient } from "@prisma/client";
import ItemWidget, { ItemProps } from "components/Item";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";

type Props = {
  items: ItemProps[];
  admins: string[];
};

const Items: React.FC<Props> = (props) => {
  return (
    <Layout admins={props.admins}>
      <SearchView
        set={props.items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const items = await prisma.item.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: { items: items, admins: admins.map((admin) => admin.email) },
  };
};

export default Items;

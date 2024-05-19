import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { AdminProps } from "archive/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import Router from "next/router";
import AdminLayout from "components/Layout/AdminLayout";
import { FAB } from "components/Layout/FAB/FAB";
import { AddIcon } from "@chakra-ui/icons";
import { poster } from "services/poster";
import { useToast } from "@chakra-ui/react";
import { MachineProps } from "types/db";
import MachineWidget from "components/Widget/MachineWidget";

type PageProps = {
  machines: MachineProps[];
};
export default function ManageMachines({ machines }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();

  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={session?.user.isSupervising}>
      <SearchView
        setIn={machines.map((machine) => ({
          name: machine.name,
          widget: (
            <MachineWidget
              key={machine.id}
              name={machine.name}
              description={""}
              image={""}
              count={0}
              url={`/admin/view-machine/${machine.id}`}
            />
          ),
        }))}
        isEdit={false}
      />
      <FAB
        onClick={async () => {
          const body = {};
          const res = await poster("/api/create-machine", body, toaster);
          if (res.status == 200) {
            await Router.push("/admin/view-machine/" + (await res.json()));
          }
        }}
        icon={AddIcon}
        bg="orange.200"
        hoverBg="orange.300"
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const machines = await prisma.machine.findMany({
    include: {
      usedBy: true,
    },
  });
  return {
    props: { machines },
  };
};

import StudentWidget, { StudentProps } from "components/Widget/StudentWidget";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import Router from "next/router";
import AdminLayout from "components/Layout/AdminLayout";
import UserWidget from "components/Widget/UserWidget";
import { UserProps } from "types/db";

type PageProps = {
  students: UserProps[];
};
export default function ManageStudents({ students }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;

  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={session?.user.supervising}>
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: (
            <UserWidget
              key={student.id}
              name={student.name}
              email={student.email}
              image={student.image}
              isAdmin={student.isAdmin}
            />
          ),
        }))}
        isEdit={true}
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.user.findMany({
    where: { isAdmin: false },
    include: { using: true },
  });
  return {
    props: { students },
  };
};

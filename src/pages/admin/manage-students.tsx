import StudentWidget, { StudentProps } from "components/Widget/StudentWidget";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "components/Widget/AdminWidget2";
import Router from "next/router";
import AdminLayout from "components/AdminLayout";

type PageProps = {
  students: StudentProps[];
};
export default function ManageStudents({ students }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  return (
    <AdminLayout isAdmin={isAdmin} isSupervisor={session?.user.supervising}>
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: <StudentWidget student={student} key={student.id} />,
        }))}
        isAdmin={isAdmin}
        isEdit={true}
        onAdd={async () => await Router.push("/admin/student-form")}
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.user.findMany({
    include: { using: true },
  });
  return {
    props: { students },
  };
};

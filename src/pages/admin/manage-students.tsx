import StudentWidget, { StudentProps } from "components/Widget/StudentWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import Router from "next/router";
import { Box } from "@chakra-ui/react";
import AppBar from "components/AppBar";
import Header from "components/Header";
import AdminLayout from "components/AdminLayout";

type PageProps = {
  students: StudentProps[];
  admins: AdminProps[];
};
export default function ManageStudents({ students, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <AdminLayout>
      <Header />
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: <StudentWidget student={student} key={student.id} />,
        }))}
        isAdmin={isAdmin}
        isEdit={true}
        onAdd={async () => await Router.push("student-form")}
      />
      <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
      <AppBar />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.student.findMany({ include: { using: true } });
  const admins = await prisma.admin.findMany();
  return {
    props: { students: students, admins: admins },
  };
};

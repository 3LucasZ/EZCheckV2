import { PrismaClient } from "@prisma/client";
import StudentWidget, { StudentProps } from "components/Student";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";

type Props = {
  students: StudentProps[];
  admins: string[];
};

const Students: React.FC<Props> = (props) => {
  return (
    <Layout admins={props.admins}>
      <SearchView
        set={props.students.map((student) => ({
          name: student.name,
          widget: <StudentWidget student={student} key={student.id} />,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: { students: students, admins: admins.map((admin) => admin.email) },
  };
};

export default Students;

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const exampleAdmin = await prisma.admin.upsert({
    create: {
      email: "lucas.zheng@warriorlife.net",
    },
    update: {},
    where: {
      email: "lucas.zheng@warriorlife.net",
    },
  });
  for (let i = 0; i < 200; i++) {
    await prisma.machine.upsert({
      create: {
        name: "machine" + i,
      },
      update: {},
      where: { name: "machine" + i },
    });
    await prisma.student.upsert({
      create: {
        email: "student" + i + "@warriorlife.net",
        name: "student" + i,
        PIN: "" + i,
      },
      update: {},
      where: { name: "student" + i },
    });
  }
  const exampleStudent = await prisma.student.upsert({
    create: {
      email: "lucas.zheng@warriorlife.net",
      name: "Lucas Zheng",
      PIN: "123456",
    },
    update: {},
    where: { name: "Lucas Zheng" },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

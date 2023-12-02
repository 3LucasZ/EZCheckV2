import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin1 = await prisma.admin.create({
    data: {
      email: "lucas.zheng@warriorlife.net",
    },
  });
  const admin2 = await prisma.admin.create({
    data: {
      email: "lucas.j.zheng@gmail.com",
    },
  });
  const module1 = await prisma.module.create({
    data: {
      name: "CNC Mill",
    },
  });
  const student1 = await prisma.student.create({
    data: { name: "Lucas Zheng", PIN: "123456" },
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

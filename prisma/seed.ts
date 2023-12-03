import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin1 = await prisma.admin.upsert({
    create: {
      email: "lucas.zheng@warriorlife.net",
    },
    update: {},
    where: {
      email: "lucas.zheng@warriorlife.net",
    },
  });
  for (let i = 0; i < 50; i++) {
    await prisma.module.upsert({
      create: {
        name: "Module #" + i,
      },
      update: {},
      where: { name: "Module #" + i },
    });
  }
  const student1 = await prisma.student.upsert({
    create: { name: "Lucas Zheng", PIN: "123456" },
    update: {},
    where: { name: "Lucas Zheng", PIN: "123456" },
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

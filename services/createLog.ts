import prisma from "services/prisma";

export default async function createLog(message: string, level: number) {
  try {
    const timestamp = new Date().toLocaleString();
    const op = await prisma.log.create({
      data: {
        timestamp,
        message,
        level,
      },
    });
  } catch (e) {}
}

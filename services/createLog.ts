import prisma from "services/prisma";

export default async function createLog(
  message: string,
  level: number,
  sender?: string
) {
  try {
    sender = sender ? sender : "System";
    const timestamp = new Date().toLocaleString();
    const op = await prisma.log.create({
      data: {
        timestamp,
        sender,
        message,
        level,
      },
    });
  } catch (e) {}
}

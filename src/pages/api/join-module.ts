import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { moduleName, studentPIN } = req.body;

  const student = await prisma.student.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      modules: true,
    },
  });
  if (student == null) return res.status(500).json("PIN is incorrect");
  if (student.modules.includes(moduleName)) {
    await prisma.module.update({
      where: {
        name: moduleName,
      },
      data: {
        lastSeen: Date(),
        usedBy: student.name,
      },
    });
    return res.status(200).json("Welcome, " + student.name + "!");
  } else {
    return res.status(500).json("Module DNE");
  }
}

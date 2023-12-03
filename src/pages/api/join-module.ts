import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { moduleName, studentPIN } = req.body;
  //find student
  const student = await prisma.student.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      modules: true,
    },
  });
  if (student == null) return res.status(500).json("PIN is incorrect");
  //find module
  const module = await prisma.module.findUnique({
    where: {
      name: moduleName,
    },
  });
  if (module == null)
    return res.status(500).json("Module " + moduleName + " does not exist");
  //Can student use module?
  const modulesStr = student.modules.map((module) => module.name);
  if (modulesStr.includes(moduleName)) {
    await prisma.module.update({
      where: {
        name: moduleName,
      },
      data: {
        usedById: student.id,
      },
    });
    return res.status(200).json("Welcome, " + student.name + "!");
  } else {
    return res
      .status(500)
      .json(
        student.name +
          " does not have access to " +
          moduleName +
          ". They have access to only: " +
          modulesStr
      );
  }
}

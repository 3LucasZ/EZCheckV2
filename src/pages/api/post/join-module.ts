import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { SHA256 } from "services/sha256";
import { getIPFromReq } from "services/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { moduleName, studentPIN, moduleSecret } = req.body;
  if (moduleSecret != process.env.EZCHECK_SECRET) {
    return res.status(403).json("Unauthorized module. Denied Access");
  }
  const IP = getIPFromReq(req);
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
    return res.status(404).json("Module " + moduleName + " does not exist");
  //Can student use module?
  const modulesStr = student.modules.map((module) => module.name);
  if (modulesStr.includes(moduleName)) {
    await prisma.module.update({
      where: {
        name: moduleName,
      },
      data: {
        usedById: student.id,
        IP: IP,
      },
    });
    return res.status(200).json("Welcome, " + student.name + "!");
  } else {
    return res
      .status(403)
      .json(student.name + " does not have access to " + moduleName);
  }
}

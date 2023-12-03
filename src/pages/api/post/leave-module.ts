import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { moduleName, moduleSecret } = req.body;
  if (moduleSecret != process.env.EZCHECK_SECRET) {
    return res.status(403).json("Unauthorized module. Denied Access");
  }
  const module = await prisma.module.findUnique({
    where: {
      name: moduleName,
    },
  });
  if (module == null) return res.status(500).json("Module DNE");
  await prisma.module.update({
    where: {
      name: moduleName,
    },
    data: {
      usedById: null,
    },
  });
  return res.status(200).json("Success");
}

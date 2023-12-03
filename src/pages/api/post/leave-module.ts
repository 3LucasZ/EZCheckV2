import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { moduleName } = req.body;

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

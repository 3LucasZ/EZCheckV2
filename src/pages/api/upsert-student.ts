import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, PIN, moduleIds } = req.body;
  const op = await prisma.student.upsert({
    where: {
      id: id,
    },
    update: {
      name: name,
      PIN: PIN,
      modules: {
        set: moduleIds,
      },
    },
    create: {
      name: name,
      PIN: PIN,
      modules: {
        connect: moduleIds,
      },
    },
    include: {
      modules: true,
    },
  });

  return res.status(200).json(op);
}

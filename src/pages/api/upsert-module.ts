import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, studentIds } = req.body;
  const op = await prisma.module.upsert({
    where: {
      id: id,
    },
    update: {
      name: name,
      students: {
        set: studentIds,
      },
    },
    create: {
      name: name,
      students: {
        connect: studentIds,
      },
    },
    include: {
      students: true,
    },
  });
  return res.status(200).json(op);
}

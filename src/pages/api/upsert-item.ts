import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, storageIds } = req.body;
  const op = await prisma.item.upsert({
    where: {
      id: id,
    },
    update: {
      name: name,
      storages: {
        set: storageIds,
      },
    },
    create: {
      name: name,
      storages: {
        connect: storageIds,
      },
    },
    include: {
      storages: true,
    },
  });
  return res.status(200).json(op);
}

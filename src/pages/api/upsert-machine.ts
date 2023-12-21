import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, studentIds } = req.body;
  if (name == "") return res.status(500).json("Name can not be empty.");
  try {
    const op = await prisma.machine.upsert({
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
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

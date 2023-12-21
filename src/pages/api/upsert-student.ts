import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, PIN, machineIds } = req.body;
  if (name == "" || PIN == "")
    return res.status(500).json("Name and PIN can not be empty.");
  try {
    const op = await prisma.student.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        PIN: PIN,
        machines: {
          set: machineIds,
        },
      },
      create: {
        name: name,
        PIN: PIN,
        machines: {
          connect: machineIds,
        },
      },
      include: {
        machines: true,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

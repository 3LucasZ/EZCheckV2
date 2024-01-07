import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, email, name, PIN, machineIds } = req.body;
  if (email == "" || name == "" || PIN == "")
    return res.status(500).json("email, name, and PIN can't be empty");
  try {
    const op = await prisma.student.upsert({
      where: {
        id,
      },
      update: {
        email,
        name,
        PIN,
        machines: {
          set: machineIds,
        },
      },
      create: {
        email,
        name,
        PIN,
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

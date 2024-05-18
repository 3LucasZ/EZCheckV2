import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { UserProps } from "types/db";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newUsers: UserProps[];
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newUsers } = req.body;
  if (newName == "")
    return res.status(500).json("Machine name can not be empty.");
  try {
    const op = await prisma.machine.update({
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

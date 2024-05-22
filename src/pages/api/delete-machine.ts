import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
  }>,
  res: NextApiResponse
) {
  const { id } = req.body;
  try {
    const op = await prisma.machine.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

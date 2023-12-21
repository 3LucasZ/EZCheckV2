import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
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

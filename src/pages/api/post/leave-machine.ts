import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName } = req.body;
  try {
    await prisma.machine.update({
      where: {
        name: machineName,
      },
      data: {
        usedById: null,
      },
    });
    return res.status(200).json("Successfully left.");
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

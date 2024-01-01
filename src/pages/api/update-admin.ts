import type { NextApiRequest, NextApiResponse } from "next";
import createLog from "services/createLog";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { admin } = req.body;
  if (admin.email == "") return res.status(500).json("Email can not be empty.");
  try {
    const op = await prisma.admin.update({
      where: {
        email: admin.email,
      },
      data: {
        supervising: !admin.supervising,
      },
    });
    await createLog(admin.email + " has started supervising", 1);
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

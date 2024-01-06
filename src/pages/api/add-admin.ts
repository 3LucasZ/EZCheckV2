import type { NextApiRequest, NextApiResponse } from "next";
import createLog from "services/createLog";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { creator, email } = req.body;
  if (creator == "") return res.status(500).json("Creator can not be empty.");
  if (email == "") return res.status(500).json("Email can not be empty.");
  const lowerEmail = email.toLowerCase();
  try {
    const op = await prisma.admin.create({
      data: {
        email: lowerEmail,
      },
    });
    await createLog(creator + " created admin " + lowerEmail, 1);
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

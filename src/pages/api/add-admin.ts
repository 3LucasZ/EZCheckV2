import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, clientSecret } = req.body;
  if (clientSecret != process.env.EZCHECK_SECRET) {
    return res.status(403).json("Unauthorized module. Denied Access");
  }
  const op = await prisma.admin.create({
    data: {
      email: email,
    },
  });
  return res.status(200).json(op);
}

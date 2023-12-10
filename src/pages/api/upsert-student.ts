import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prependListener } from "process";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, PIN, moduleIds } = req.body;
  if (name == "" || PIN == "") {
    const prep = res.status(500);
    prep.json("form is incomplete");
    return prep;
  }
  try {
    const op = await prisma.student.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        PIN: PIN,
        modules: {
          set: moduleIds,
        },
      },
      create: {
        name: name,
        PIN: PIN,
        modules: {
          connect: moduleIds,
        },
      },
      include: {
        modules: true,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json(e.meta?.target + " must be unique");
    }
  }
  return res.status(500).json("unkown error");
}

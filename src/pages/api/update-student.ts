import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: string;
    //student
    newPIN?: string;
    newCerts?: CertificateProps[];
    //admin
    isAdmin?: boolean;
    isSupervising?: boolean;
  }>,
  res: NextApiResponse
) {
  const { id, newPIN, newCerts, isAdmin, isSupervising } = req.body;
  console.log(req.body);
  console.log(isSupervising);
  const newRelations = newCerts?.map((cert) => ({
    machineId: cert.machineId!,
    issuerId: cert.issuerId,
  }));
  if (newPIN == "") return res.status(500).json("PIN can't be empty");
  try {
    const op = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(newPIN != undefined && { PIN: newPIN }),
        ...(newRelations != undefined && {
          certificates: {
            deleteMany: {},
            createMany: { data: newRelations },
          },
        }),
        ...(isAdmin != undefined && { isAdmin: isAdmin }),
        ...(isSupervising != undefined && { isSupervising: isSupervising }),
      },
      include: {
        ...(newRelations != undefined && { certificates: true }),
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newCerts: CertificateProps[];
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newCerts } = req.body;
  const newRelations = newCerts.map((cert) => ({
    recipientId: cert.recipientId!,
    issuerId: cert.issuerId,
  }));
  if (newName == "")
    return res.status(500).json("Machine name can not be empty.");
  try {
    const op = await prisma.machine.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
        description: newDescription,
        certificates: {
          deleteMany: {}, //extremely important, this denotes that you want to delete relations too
          createMany: {
            data: newRelations,
          },
        },
      },

      include: {
        certificates: true,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}

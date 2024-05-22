import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import createLog from "services/createLog";
import { supervisorsLog, tresspassLog } from "services/error-messages";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    machineName: string;
  }>,
  res: NextApiResponse
) {
  const { machineName } = req.body;
  //find machine
  const machine = await prisma.machine.findUnique({
    where: {
      name: machineName,
    },
    include: {
      usedBy: true,
    },
  });
  //find student
  const student = machine?.usedBy;
  //find supervisors
  const supervisors: User[] = await prisma.user.findMany({
    select: {
      name: true,
    },
    where: {
      isSupervising: true,
    },
  });
  //check cases
  if (student == null || machine == null || supervisors.length == 0) {
    createLog(tresspassLog(student, machine, machineName, supervisors), 2);
    if (machine == null) {
      return res.status(500).send(machineName + " doesn't exist");
    }
    if (student == null) {
      return res.status(500).send("Already logged out");
    }
    if (supervisors.length == 0) {
      return res.status(500).send("Unsupervised");
    }
  } else {
    try {
      await prisma.machine.update({
        where: {
          name: machineName,
        },
        data: {
          usedById: null,
        },
      });
      createLog(
        machine.usedBy?.name +
          " logged out of " +
          machine.name +
          ". " +
          supervisorsLog,
        0
      );
      return res.status(200).send("Logged out");
    } catch (e) {
      createLog("Database malfunction: " + prismaErrHandler(e), 2);
      return res.status(500).send("Internal error");
    }
  }
}

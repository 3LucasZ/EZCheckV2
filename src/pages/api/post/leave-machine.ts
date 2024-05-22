import type { NextApiRequest, NextApiResponse } from "next";
import createLog from "services/createLog";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
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
  const supervisors = await prisma.user.findMany({
    where: {
      isSupervising: true,
    },
  });
  const supervisorsMsg = supervisors.length
    ? "Supervisors: " +
      supervisors.map((supervisor) => supervisor.email).join(", ") +
      "."
    : "No supervisors available.";
  //check cases
  if (student == null || machine == null || supervisors.length == 0) {
    createLog(
      (student == null ? "An unknown student" : student.name) +
        " might be trespassing on " +
        (machine == null
          ? "an unknown machine (" + machineName + ") "
          : machine?.name) +
        ". " +
        supervisorsMsg,
      2
    );
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
          supervisorsMsg,
        0
      );
      return res.status(200).send("Logged out");
    } catch (e) {
      createLog("Database error: " + prismaErrHandler(e), 2);
      return res.status(500).send("Internal error");
    }
  }
}

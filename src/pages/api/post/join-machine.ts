import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "services/constants";
import createLog from "services/createLog";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName, studentPIN, IP } = req.body;

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
  const student = await prisma.user.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      certificates: true,
      using: true,
    },
  });
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
  //find student allowed machines
  const machinesStr = student
    ? student.certificates.map((cert) => cert.machineId)
    : [];

  //check cases
  if (
    machine == null ||
    student == null ||
    IP == null ||
    supervisors.length == 0
  ) {
    createLog(
      (student == null ? "An unknown student" : student.name) +
        " might be trespassing on " +
        (machine == null
          ? "an unknown machine (" + machineName + ") "
          : machine?.name) +
        " with IP " +
        (IP == null ? "that is hidden" : IP) +
        ". " +
        supervisorsMsg,
      2
    );
    if (machine == null) {
      return res.status(500).send(machineName + " doesn't exist");
    }
    if (student == null) {
      return res.status(500).send("Wrong PIN");
    }
    if (IP == null) {
      return res.status(500).send("Empty IP");
    }
    if (supervisors.length == 0) {
      return res.status(500).send("Unsupervised");
    }
  } else if (student.using != null) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but is already using " +
        student.using.name +
        ". " +
        supervisorsMsg,
      2
    );
    return res.status(500).send("Already using " + student.using.name);
  } else if (machine.usedBy != null) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but it is already in use by " +
        machine.usedBy.name +
        ". " +
        supervisorsMsg,
      2
    );
    return res
      .status(500)
      .send(machine.name + " already in use by " + machine.usedBy.name + ".");
  } else if (!machinesStr.includes(machineName)) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but is not authorized. " +
        supervisorsMsg,
      2
    );
    return res.status(500).send("Denied access");
  } else {
    try {
      await prisma.machine.update({
        where: {
          name: machineName,
        },
        data: {
          usedById: student.id,
          IP: IP,
        },
      });
      createLog(
        student.name + " started using " + machine.name + ". " + supervisorsMsg,
        0
      );
      return res.status(200).send(student.name);
    } catch (e) {
      createLog("Database error: " + prismaErrHandler(e), 2);
      return res.status(500).send("Internal error");
    }
  }
}

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
  });
  //find student
  const student = await prisma.student.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      machines: true,
      using: true,
    },
  });
  //find supervisors
  const supervisors = await prisma.admin.findMany({
    where: {
      supervising: true,
    },
  });
  const supervisorsMsg = supervisors.length
    ? "Supervisors: " +
      supervisors.map((supervisor) => supervisor.email).join(", ") +
      "."
    : "No supervisors available.";
  //find student allowed machines
  const machinesStr = student
    ? student.machines.map((machine) => machine.name)
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
  } else if (student.using != null) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but is already using " +
        student.using.name,
      2
    );
    return res.status(500).send("Already using " + student.using.name);
  } else if (!machinesStr.includes(machineName)) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but is not authorized",
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

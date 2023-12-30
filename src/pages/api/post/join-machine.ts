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
  //find student allowed machines
  const machinesStr = student
    ? student.machines.map((machine) => machine.name)
    : [];

  //check cases
  if (machine == null || student == null || IP == null) {
    createLog(
      (student == null ? "An unknown student" : student.name) +
        " might be trespassing on " +
        (machine == null ? "an unknown machine" : machine?.name) +
        " with IP " +
        (IP == null ? "that is hidden" : IP),
      2
    );
    if (machine == null) {
      return res.status(500).json(machineName + " doesn't exist");
    }
    if (student == null) {
      return res.status(500).json("Wrong PIN");
    }
    if (IP == null) {
      return res.status(500).json("IP can't be empty.");
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
    return res.status(500).json("You are already using " + student.using);
  } else if (!machinesStr.includes(machineName)) {
    createLog(
      student.name +
        " is trying to use " +
        machine.name +
        ", but is not authorized",
      2
    );
    return res
      .status(500)
      .json(student.name + " doesn't have access to " + machineName);
  } else {
    createLog(student.name + " logged on to " + machine.name, 0);
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
      return res.status(200).json("Welcome, " + student.name + "!");
    } catch (e) {
      return res.status(500).json(prismaErrHandler(e));
    }
  }
}

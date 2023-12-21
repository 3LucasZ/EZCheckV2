import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "services/constants";
import createLog from "services/createLog";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName, studentPIN, machineSecret, IP } = req.body;
  const secret = process.env.EZCHECK_SECRET;
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
    },
  });
  //log
  if (
    machine == null ||
    student == null ||
    machineSecret != secret ||
    IP == null
  ) {
    createLog(
      "SOMEONE IS TRESPASSING" +
        (" | MACHINE: " + (machine == null ? "DNE" : machine?.name)) +
        (" | STUDENT: " + (student == null ? "DNE" : student?.name)) +
        (" | KEY: " + (machineSecret != secret ? "ILLEGAL" : "LEGAL")) +
        (" | IP: " + (IP == null ? "HIDDEN" : IP)),
      2
    );
  }
  //deal
  if (machine == null) {
    return res.status(404).json("Machine " + machineName + " does not exist");
  }
  if (student == null) {
    return res.status(500).json("PIN is incorrect");
  }
  if (machineSecret != secret) {
    return res
      .status(403)
      .json(
        "Unauthorized machine. Denied Access." +
          (debugMode
            ? " Secret is: " +
              process.env.EZCHECK_SECRET +
              ". You entered: " +
              machineSecret
            : "")
      );
  }
  if (IP == null) {
    return res.status(500).json("IP can not be empty.");
  }

  //Can student use machine?
  const machinesStr = student.machines.map((machine) => machine.name);
  if (machinesStr.includes(machineName)) {
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
  } else {
    return res
      .status(403)
      .json(student.name + " does not have access to " + machineName);
  }
}

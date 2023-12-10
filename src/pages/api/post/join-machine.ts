import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { SHA256 } from "services/sha256";
import { getIPFromReq } from "services/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName, studentPIN, machineSecret } = req.body;
  if (machineSecret != process.env.EZCHECK_SECRET) {
    return res.status(403).json("Unauthorized machine. Denied Access");
  }
  const IP = getIPFromReq(req);
  //find student
  const student = await prisma.student.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      machines: true,
    },
  });
  if (student == null) return res.status(500).json("PIN is incorrect");
  //find machine
  const machine = await prisma.machine.findUnique({
    where: {
      name: machineName,
    },
  });
  if (machine == null)
    return res.status(404).json("machine " + machineName + " does not exist");
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

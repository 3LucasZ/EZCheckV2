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

  //check cases
  if (machine == null) {
    createLog(
      "Someone is trying to access " + machineName + ", which doesn't exist",
      2
    );
    return res.status(500).json(machineName + " doesn't exist");
  } else if (machine.usedBy == null) {
    createLog(
      "Someone is trying to log out of " +
        machine.name +
        ", but no one is using this machine right now",
      2
    );
    return res.status(500).json("Already logged out");
  } else {
    createLog(machine.usedBy.name + " logged out of " + machine.name, 0);
    try {
      await prisma.machine.update({
        where: {
          name: machineName,
        },
        data: {
          usedById: null,
        },
      });
      return res.status(200).json("Successfully left.");
    } catch (e) {
      return res.status(500).json(prismaErrHandler(e));
    }
  }
}

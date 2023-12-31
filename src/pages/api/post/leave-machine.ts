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
    return res.status(500).send(machineName + " DNE");
  } else if (machine.usedBy == null) {
    createLog(
      "Someone is trying to log out of " +
        machine.name +
        ", but no one is using this machine right now",
      2
    );
    return res.status(500).send("Already logged out");
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
      createLog(machine.usedBy.name + " logged out of " + machine.name, 0);
      return res.status(200).send("Logged out");
    } catch (e) {
      createLog("Database error: " + prismaErrHandler(e), 2);
      return res.status(500).send("Internal error");
    }
  }
}

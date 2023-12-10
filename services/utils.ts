import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "./constants";

export function getIPFromReq(req: NextApiRequest) {
  var ip = req.socket.remoteAddress;
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7);
  }
  if (debugMode) console.log("IP:", ip);
  return ip;
}

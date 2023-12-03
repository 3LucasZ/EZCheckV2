import type { NextApiRequest, NextApiResponse } from "next";

export function getIPFromReq(req: NextApiRequest) {
  var ip = req.socket.remoteAddress;
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7);
  }
  console.log("IP:", ip);
  return ip;
}

import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import prisma from "services/prisma";

const { GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: GOOGLE_ID,
//       clientSecret: GOOGLE_SECRET,
//     }),
//   ],
// });

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;
  if (!host) return res.status(400).send(`Bad Request, missing host header`);
  //else return res.status(400).send("Debug: " + host);

  // process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";
  process.env.NEXTAUTH_URL = "https://" + host;

  return NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      //Add data to user object so it is passed along with session
      session({ session, token, user }) {
        session.user.id = user.id;
        //student
        session.user.PIN = user.PIN;
        session.user.machines = user.machines;
        session.user.using = user.using;
        //admin
        session.user.isAdmin = user.isAdmin;
        if (
          user.email == "lucas.j.zheng@gmail.com" ||
          user.email == "lucas.zheng@warriorlife.net"
        )
          session.user.isAdmin = true;
        session.user.supervising = user.supervising;
        return session;
      },
    },
  })(req, res);
}

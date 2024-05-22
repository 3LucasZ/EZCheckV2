import NextAuth, { DefaultSession, User } from "next-auth";
import { MachineProps } from "./db";
import { CertificateProps } from "./db";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
  interface User {
    //basic
    id?: string;
    email?: string;
    name?: string | null;
    image?: string;
    //custom student
    PIN?: string;
    certificates?: CertificateProps[];
    using?: MachineProps;
    //custom admin
    isAdmin?: boolean;
    isSupervising?: boolean;
  }
}

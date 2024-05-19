import NextAuth, { DefaultSession } from "next-auth";
import { MachineProps } from "./db";
import { CertificateProps } from "./db";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      //basic
      id: string;
      email: string;
      name: string;
      image: string;
      //custom student
      PIN: string;
      certificates: CertificateProps[];
      using?: MachineProps;
      //custom admin
      isAdmin: boolean;
      isSupervising: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    //basic
    id: string;
    email: string;
    name: string;
    image: string;
    //custom student
    PIN: string;
    certificates: CertificateProps[];
    using?: MachineProps;
    //custom admin
    isAdmin: boolean;
    isSupervising: boolean;
  }
}

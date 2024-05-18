import NextAuth, { DefaultSession } from "next-auth";
import { MachineProps } from "./db";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      //custom admin
      isAdmin: boolean;
      supervising: boolean;
      //custom student
      PIN: string;
      machines: MachineProps[];
      using: MachineProps;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    //custom admin
    isAdmin: boolean;
    supervising: boolean;
    //custom student
    PIN: string;
    machines: MachineProps[];
    using: MachineProps;
  }
}

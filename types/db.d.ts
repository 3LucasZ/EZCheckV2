import { UserProps } from "./db";

export type UserProps = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  image: string;
  machines: MachineProps[];
  using: MachineProps;
};
export type MachineProps = {
  id: number;
  name: string;
  students: UserProps[];
  lastSeen?: string;
  usedBy?: UserProps;
  IP?: string;
};

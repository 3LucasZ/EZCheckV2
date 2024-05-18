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
  description: string;
  image: string;

  lastSeen?: string;
  IP?: string;

  students: UserProps[];
  usedBy?: UserProps;
};

export type CertificateProps = {
  //defn relation
  machine: MachineProps;
  machineId: number;
  recipient: UserProps;
  recipientId: string;

  //meta
  issuedAt: number;
  issuer?: UserProps;
  issuerId?: string;
};

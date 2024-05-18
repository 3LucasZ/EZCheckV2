export type UserProps = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  image: string;
  machines: MachineProps[];
  using: MachineProps;
};

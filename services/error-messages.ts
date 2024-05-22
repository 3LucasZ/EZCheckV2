import { User } from "next-auth";
import { MachineProps } from "types/db";

export function tresspassLog(
  student: User,
  machine: MachineProps,
  machineName: string,
  supervisors: User[]
) {
  (student == null ? "An unknown student" : student.name) +
    " may be trespassing on " +
    (machine == null
      ? "an unknown machine (" + machineName + ") "
      : machine?.name) +
    ". " +
    supervisorsLog(supervisors);
}
export function supervisorsLog(supervisors: User[]) {
  return supervisors.length
    ? "Supervisors: " +
        supervisors.map((supervisor) => supervisor.email).join(", ") +
        "."
    : "Unsupervised.";
}

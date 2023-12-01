import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function Protect({
  children,
  admins,
}: {
  children: ReactNode;
  admins: string[];
}) {
  const { data: session } = useSession();
  console.log(admins);
  return session && admins.includes(session.user!.email!) ? (
    <>children</>
  ) : (
    <Box />
  );
}

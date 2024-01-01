import { useToast } from "@chakra-ui/react";
import Router from "next/router";
import BaseWidget2 from "./BaseWidget2";
import { poster } from "services/poster";
import { useSession } from "next-auth/react";

export type AdminProps = {
  id: number;
  email: string;
  supervising: boolean;
};

const AdminWidget: React.FC<{
  admin: AdminProps;
}> = ({ admin }) => {
  const { data: session } = useSession();
  const toaster = useToast();
  const handleRemove = async () => {
    const body = { creator: session?.user?.email, email: admin.email };
    const res = await poster("/api/delete-admin", body, toaster);
    if (res.status == 200) Router.reload();
  };
  return (
    <BaseWidget2
      title={admin.email}
      bg={admin.supervising ? "purple.300" : "teal.300"}
      bgHover={admin.supervising ? "purple.400" : "teal.400"}
      handleRemove={handleRemove}
      invert={false}
      isAdmin={true}
    />
  );
};

export default AdminWidget;

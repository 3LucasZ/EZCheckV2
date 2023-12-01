import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { ItemProps } from "./Item";

export type StorageProps = {
  id: number;
  name: string;
  items: ItemProps[];
};

const StorageWidget: React.FC<{ storage: StorageProps }> = ({ storage }) => {
  let hoverState = {
    bg: "blue.400",
  };
  return (
    <Link href={"/storage/" + storage.id} style={{ textDecoration: "none" }}>
      <Box
        borderRadius="md"
        bg="blue.300"
        color="white"
        px={4}
        h={8}
        _hover={hoverState}
      >
        {storage.name}
      </Box>
    </Link>
  );
};

export default StorageWidget;

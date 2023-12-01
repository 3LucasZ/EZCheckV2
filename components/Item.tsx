import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { StorageProps } from "./Storage";

export type ItemProps = {
  id: number;
  name: string;
  storages: StorageProps[];
};

const ItemWidget: React.FC<{ item: ItemProps }> = ({ item }) => {
  let hoverState = {
    bg: "teal.400",
  };
  return (
    <Link href={"/item/" + item.id} style={{ textDecoration: "none" }}>
      <Box
        borderRadius="md"
        bg="teal.300"
        color="white"
        px={4}
        h={8}
        _hover={hoverState}
      >
        {item.name}
      </Box>
    </Link>
  );
};

export default ItemWidget;

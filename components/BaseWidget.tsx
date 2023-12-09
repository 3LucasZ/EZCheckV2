import { GridItem, Link, Text } from "@chakra-ui/react";

type BaseWidgetProps = {
  href: string;
  title: string;
  bg: string;
  colSpan: number;
};

export default function BaseWidget({
  href,
  title,
  bg,
  colSpan,
}: BaseWidgetProps) {
  let hoverState = {};
  return (
    <GridItem
      h={8}
      colSpan={colSpan}
      px={4}
      bg={bg}
      color="white"
      display="flex"
      minW="100%"
      minH="100%"
    >
      <Link
        href={href}
        position="relative"
        display={"flex"}
        minW="100%"
        minH="100%"
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        zIndex={1000}
        _hover={hoverState}
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Link>
    </GridItem>
  );
}

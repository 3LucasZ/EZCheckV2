import { GridItem, Link } from "@chakra-ui/react";

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
    <GridItem bg={bg} color="white" px={4} h={8} colSpan={colSpan}>
      <Link
        href={href}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        display={"flex"}
        w="100%"
        position="relative"
        zIndex={1000}
        _hover={hoverState}
      >
        {title}
      </Link>
    </GridItem>
  );
}

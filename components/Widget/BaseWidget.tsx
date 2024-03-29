import { Box, GridItem, Link, Text } from "@chakra-ui/react";
import Router from "next/router";

type BaseWidgetProps = {
  href?: string;
  title: string;
  bg: string;
  bgHover?: string;
  colSpan: number;
  round?: boolean;
};

export default function BaseWidget({
  href,
  title,
  bg,
  bgHover,
  colSpan,
  round,
}: BaseWidgetProps) {
  return (
    <GridItem
      h={8}
      colSpan={colSpan}
      px={4}
      bg={bg}
      _hover={{ bg: bgHover }}
      color="white"
      display="flex"
      overflow={"hidden"}
      borderRadius={round ? "md" : "none"}
    >
      <Box
        onClick={() => Router.push(href ? href : "")}
        display={"flex"}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        w="100%"
        h="100%"
        pointerEvents={href ? "auto" : "none"}
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Box>
    </GridItem>
  );
}

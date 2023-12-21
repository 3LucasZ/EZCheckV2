import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Link, Text, useDisclosure } from "@chakra-ui/react";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";

type BaseWidgetProps = {
  href?: string;
  title: string;
  bg: string;
  bgHover: string;
  handleRemove: () => Promise<void>;
  handleAdd?: () => Promise<void>;
  invert: boolean;
  isAdmin: boolean;
};

export default function BaseWidget({
  href,
  title,
  bg,
  bgHover,
  handleRemove,
  handleAdd,
  invert,
  isAdmin,
}: BaseWidgetProps) {
  return (
    <Flex overflow="hidden" rounded="md">
      <Link
        bg={bg}
        _hover={{ bg: bgHover }}
        color="white"
        href={href}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        w="calc(100% - 40px)"
        h="8"
        pointerEvents={href ? "auto" : "none"}
        px={5}
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Link>
      {isAdmin && (
        <IconButton
          onClick={invert ? handleAdd : handleRemove}
          bg={invert ? "green.300" : "red.300"}
          _hover={{ bg: invert ? "green.400" : "red.400" }}
          color="white"
          aria-label={invert ? "add" : "delete"}
          icon={invert ? <SmallAddIcon /> : <SmallCloseIcon />}
          h={8}
          w={"40px"}
          rounded="none"
        />
      )}
    </Flex>
  );
}

import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  GridItem,
  IconButton,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";

type BaseWidgetProps = {
  href: string;
  title: string;
  bg: string;
  handleRemove: () => Promise<void>;
  safeRemove: boolean;
};

export default function BaseWidget({
  href,
  title,
  bg,
  handleRemove,
  safeRemove,
}: BaseWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h={8}>
      <Link
        bg={bg}
        color="white"
        href={href}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        w="100%"
        h="100%"
        pointerEvents={href ? "auto" : "none"}
        px={5}
        borderRadius={"md"}
        roundedRight="none"
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Link>
      <IconButton
        onClick={safeRemove ? onOpen : handleRemove}
        colorScheme="red"
        aria-label="delete"
        icon={<DeleteIcon />}
        h={8}
        roundedLeft="none"
        borderRadius="md"
        w={8}
      />
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        name={title}
        handleDelete={handleRemove}
      />
    </Flex>
  );
}

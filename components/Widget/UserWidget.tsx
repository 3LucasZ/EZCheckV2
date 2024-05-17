//COPY FROM EZFIND2
import {
  Box,
  HStack,
  Image,
  Text,
  AspectRatio,
  Stack,
  Select,
  useDisclosure,
} from "@chakra-ui/react";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { UserCardModal } from "components/Main/UserCardModal";

type UserWidgetProps = {
  //data
  name: string;
  email: string;
  image: string;
  perm?: number;
  isAdmin: boolean;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  askConfirmation?: boolean;
  handleAdd?: Function;
  handleRemove?: Function;
  handleNewPerm?: Function;
};

export default function UserWidget(props: UserWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        overflow={"hidden"}
        rounded="md"
        boxShadow={"md"}
        mx={1} //so we can see the side shadows
        onClick={onOpen}
        px="2"
        _hover={{ bg: "gray.100" }}
        minH="60px"
      >
        <HStack h="100%">
          <AspectRatio
            minW="45px"
            maxW="45px"
            ratio={1}
            // bgGradient={genGradient(props.name)}
          >
            <Image
              src={props.image} //pfp stored on google servers, will NOT use our API
              // fallbackSrc="https://via.placeholder.com/150"
              hidden={props.image?.length < 5}
              borderRadius="full"
            ></Image>
          </AspectRatio>
          <Box w="2"></Box>
          <Stack
            w="100%"
            direction={["column", "column", "row"]}
            gap={["0", "0", "2"]}
            spacing={0}
          >
            <Text
              w={["100%", "100%", "40%"]}
              noOfLines={1} //do not render more than one line
              wordBreak={"break-all"} //ellipsis in the middle of word, not only on new word
            >
              {props.name}
            </Text>
            <Text
              w={["100%", "100%", "60%"]}
              fontSize={["sm", "sm", "md"]}
              color={["grey", "grey", "black"]}
              noOfLines={1}
              wordBreak={"break-all"}
            >
              {props.email}
            </Text>
          </Stack>
          {!props.inverted && props.perm && (
            <Select
              //--looks--
              rounded={"lg"}
              border="none"
              size={"sm"}
              pointerEvents={props.isEdit ? "auto" : "none"}
              iconSize={props.isEdit ? "md" : "0"}
              minW="80px"
              maxW="20%"
              //---behavior---
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                props.handleNewPerm!(
                  Number.isNaN(num) ? 0 : parseInt(e.target.value)
                );
              }}
              value={props.perm}
              display={props.inverted ? "none" : ""}
            >
              <option value="0">Viewer</option>
              <option value="1">Editor</option>
              <option value="2">Manager</option>
            </Select>
          )}
          <AddRemoveButton
            mode={props.inverted ? 1 : -1}
            invisible={!props.isEdit}
            handleAdd={props.handleAdd!}
            handleRemove={props.handleRemove!}
            askConfirmation={props.askConfirmation}
            actionStr={
              (!props.inverted
                ? "revoke admin priveleges from "
                : "grant admin priveleges to ") +
              `${props.name} (${props.email})`
            }
          />
        </HStack>
      </Box>
      <UserCardModal
        name={props.name}
        email={props.email}
        image={props.image}
        isAdmin={props.isAdmin}
        groups={0}
        isOpen={isOpen}
        onClose={onClose}
      ></UserCardModal>
    </>
  );
}
import {
  Box,
  HStack,
  Image,
  Text,
  AspectRatio,
  Stack,
  Select,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { UserCardModal } from "components/Main/UserCardModal";
import Router from "next/router";
import WidgetTitles from "./WidgetTitles";

type UserWidgetProps = {
  //data
  id: string;
  name: string;
  email: string;
  image: string;

  type2?: boolean;
  name2?: string;
  email2?: string;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  askConfirmation?: boolean; //only for admin add/rm
  handleAdd?: Function;
  handleRm?: Function;
};

export default function UserWidget(props: UserWidgetProps) {
  const column =
    useBreakpointValue(
      {
        base: true,
        sm: true,
        md: false,
      },
      { fallback: "md", ssr: false }
    ) || false;
  const content = props.type2 ? (
    <HStack w="100%">
      <WidgetTitles title={props.name} subtitle={props.email} column={true} />
      <WidgetTitles
        title={props.name2!}
        subtitle={props.email2!}
        column={true}
      />
    </HStack>
  ) : (
    <WidgetTitles
      title={props.name ? props.name : "Expired admin"}
      subtitle={props.email ? props.email : "Expired email"}
      column={column}
    ></WidgetTitles>
  );
  return (
    <>
      <Box
        overflow={"hidden"}
        rounded="md"
        boxShadow={"md"}
        mx={1} //so we can see the side shadows
        onClick={() => Router.push(`/admin/view-student/${props.id}`)}
        px="2"
        _hover={{ bg: "gray.100" }}
        minH="60px"
      >
        <HStack h="100%">
          <AspectRatio minW="45px" maxW="45px" ratio={1}>
            <Image
              src={props.image} //pfp stored on google servers, will NOT use our API
              // fallbackSrc="https://via.placeholder.com/150"
              hidden={props.image?.length < 5}
              borderRadius="full"
            ></Image>
          </AspectRatio>
          <Box w="2"></Box>
          {content}
          <AddRemoveButton
            isAdd={props.inverted}
            invisible={!props.isEdit}
            handleAdd={props.handleAdd!}
            handleRemove={props.handleRm!}
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
    </>
  );
}

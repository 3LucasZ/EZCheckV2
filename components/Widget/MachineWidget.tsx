import {
  Box,
  Grid,
  HStack,
  Image,
  VStack,
  Text,
  AspectRatio,
  Stack,
  Show,
  useBreakpointValue,
} from "@chakra-ui/react";

import Router from "next/router";
import { genGradient } from "services/gradientGenerator";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { ChangeEventHandler } from "react";
import WidgetTitles from "./WidgetTitles";

type MachineWidgetProps = {
  //data
  name: string;
  description: string;
  image: string;
  count?: number;
  url: string;

  type2?: boolean;
  name2?: string;
  email2?: string;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  handleAdd?: Function;
  handleRemove?: Function;
  handleNewCount?: ChangeEventHandler<HTMLInputElement>;
};

export default function MachineWidget(props: MachineWidgetProps) {
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
      <WidgetTitles
        title={props.name}
        subtitle={props.description ? props.description : "No description."}
        column={true}
      />
      <WidgetTitles
        title={props.name2 ? props.name2 : "Expired admin"}
        subtitle={props.email2 ? props.email2 : "Expired email"}
        column={true}
      />
    </HStack>
  ) : (
    <WidgetTitles
      title={props.name}
      subtitle={props.description ? props.description : "No description."}
      column={column}
    ></WidgetTitles>
  );

  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push(props.url)}
      pr="2"
      _hover={{ bg: "gray.100" }}
      minH="60px"
    >
      <HStack>
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          <Image
            src={`/api/${props.image}`}
            hidden={props.image.length < 5}
          ></Image>
        </AspectRatio>
        {content}
        <AddRemoveButton
          isAdd={props.inverted}
          invisible={!props.isEdit}
          handleAdd={props.handleAdd!}
          handleRemove={props.handleRemove!}
        />
      </HStack>
    </Box>
  );
}

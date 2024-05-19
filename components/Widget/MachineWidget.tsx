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
} from "@chakra-ui/react";

import Router from "next/router";
import { genGradient } from "services/gradientGenerator";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { ChangeEventHandler } from "react";

type MachineWidgetProps = {
  //data
  name: string;
  description: string;
  image: string;
  count: number;
  url: string;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  handleAdd?: Function;
  handleRemove?: Function;
  handleNewCount?: ChangeEventHandler<HTMLInputElement>;
};

export default function MachineWidget(props: MachineWidgetProps) {
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
        <HStack w="100%">
          <Text
            w={["100%", "40%"]}
            noOfLines={1} //do not render more than one line
            wordBreak={"break-all"} //ellipsis in the middle of word, not only on new word
          >
            {props.name}
          </Text>
          <Show above="sm">
            <Text w="60%" noOfLines={1} wordBreak={"break-all"}>
              {props.description ? props.description : "No description."}
            </Text>
          </Show>
        </HStack>
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

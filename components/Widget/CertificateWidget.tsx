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
import { CertificateProps } from "types/db";

type CertificateWidgetProps = {
  //data
  cert: CertificateProps;
  machineMode: boolean;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  handleAdd?: Function;
  handleRm?: Function;
};

export default function CertificateWidget(props: CertificateWidgetProps) {
  const url =
    (props.machineMode
      ? `/view-machine/${props.cert.machineId}`
      : `/view-user/${props.cert.recipientId}`) || "";
  const image =
    (props.machineMode
      ? `/api/${props.cert.machine?.image}`
      : props.cert.recipient?.image) || "";
  const name =
    (props.machineMode
      ? props.cert.machine?.name
      : props.cert.recipient?.name) || "";
  const description =
    (props.machineMode
      ? props.cert.machine?.description
      : props.cert.recipient?.email) || "";
  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push(url)}
      pr="2"
      _hover={{ bg: "gray.100" }}
      minH="60px"
    >
      <HStack>
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(name)}>
          <Image src={image} hidden={image.length < 5}></Image>
        </AspectRatio>
        <HStack w="100%">
          <Text
            w={["100%", "40%"]}
            noOfLines={1} //do not render more than one line
            wordBreak={"break-all"} //ellipsis in the middle of word, not only on new word
          >
            {name}
          </Text>
          <Show above="sm">
            <Text w="60%" noOfLines={1} wordBreak={"break-all"}>
              {description ? description : "No description."}
            </Text>
          </Show>
        </HStack>
        <AddRemoveButton
          isAdd={props.inverted}
          invisible={!props.isEdit}
          handleAdd={props.handleAdd!}
          handleRemove={props.handleRm!}
        />
      </HStack>
    </Box>
  );
}

import { HStack, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { IconType } from "react-icons";

type FeatureCardProps = {
  icon: IconType;
  title: string;
  content: string;
};

export default function FeatureCard(props: FeatureCardProps) {
  return (
    <VStack alignContent={"start"} align={"start"} gap="8">
      <HStack>
        <Icon
          as={props.icon}
          boxSize={16}
          zIndex={100}
          rounded="full"
          color="red.400"
          bg="orange.100"
          p="3"
        />

        <Box w="3"></Box>
        <Text fontSize={["2xl", "2xl", "3xl"]}>{props.title}</Text>
      </HStack>
      <Text fontSize={["1xl", "1xl", "2xl"]}>{props.content}</Text>
    </VStack>
  );
}
/*
<Box>
          <Icon
            pos="relative"
            as={props.icon}
            boxSize={10}
            zIndex={100}
            color="black"
          ></Icon>
          <Box
            pos={"relative"}
            boxShadow={"0px 0px 60px 45px var(--chakra-colors-orange-200);"}
            transform={"translate(20px, -20px);"}
            boxSize={0}
            rounded="full"
          ></Box>
        </Box>
*/

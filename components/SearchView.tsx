import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";
import { ReactNode, useState } from "react";

type SearchViewProps = {
  set: PairProps[];
  url?: string;
};
type PairProps = {
  name: string;
  widget: ReactNode;
};
type StateProps = {
  query: string;
  subset: PairProps[];
};
export default function ConfirmDeleteModal(props: SearchViewProps) {
  props.set.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const [state, setState] = useState<StateProps>({
    query: "",
    subset: props.set,
  });
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = props.set.filter((pair) => {
      if (e.target.value === "") return props.set;
      return pair.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setState({
      query: e.target.value,
      subset: res,
    });
  };
  return (
    <Flex px={[2, "5vw", "10vw", "15vw"]} flexDir={"column"}>
      <Flex gap={2}>
        <Input
          variant="filled"
          placeholder="Search"
          type="search"
          value={state.query}
          onChange={handleSearchQueryChange}
        />
        {props.url != null && (
          <IconButton
            ml={2}
            mr={2}
            colorScheme="teal"
            aria-label="edit"
            icon={<AddIcon />}
            onClick={() =>
              Router.push({
                pathname: props.url,
              })
            }
          />
        )}
      </Flex>
      <Box h={8}></Box>

      <Stack w="100%" h="calc(100vh - 180px)" overflowY="auto">
        {props.set.length == 0 ? (
          <Center>No data available to display.</Center>
        ) : (
          state.subset.map((pair) => pair.widget)
        )}
      </Stack>
    </Flex>
  );
}

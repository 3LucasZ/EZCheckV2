import { Box, Center, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

type SearchViewProps = {
  set: PairProps[];
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
    <div>
      <Box pl="25vw" pr="25vw">
        <Input
          variant="filled"
          placeholder="Search"
          type="search"
          value={state.query}
          onChange={handleSearchQueryChange}
        />
      </Box>
      <Box h="4vh"></Box>

      <HStack h="50vh">
        <Box w="100%" />
        <Box overflowY="auto" h="100%" w="100%">
          <Stack w="100%">
            {props.set.length == 0 ? (
              <Center>No data available to display.</Center>
            ) : (
              state.subset.map((pair) => pair.widget)
            )}
          </Stack>
        </Box>
        <Box w="100%" />
      </HStack>
    </div>
  );
}

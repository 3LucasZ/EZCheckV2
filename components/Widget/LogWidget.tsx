import { Alert, AlertIcon, Box, Grid, HStack, VStack } from "@chakra-ui/react";
import BaseWidget from "../../archive/BaseWidget";

export type LogProps = {
  id: number;
  timestamp: string;
  sender?: string;
  message: string;
  level: number;
};
type LogWidgetProps = {
  log: LogProps;
};

export default function LogWidget({ log }: LogWidgetProps) {
  if (log.sender == undefined) log.sender = "System";
  return (
    <Alert
      status={log.level == 0 ? "info" : log.level == 1 ? "warning" : "error"}
      roundedRight="md"
      variant="left-accent"
      overflow="visible" //extremely important to keep styling right
    >
      <AlertIcon />
      <HStack
        minH="50px"
        alignContent={"start"}
        alignItems={"start"}
        w="100%"
        gap="8"
      >
        <VStack alignContent={"start"} alignItems={"start"}>
          <Box noOfLines={1} fontSize={["sm", "md"]}>
            {log.sender}
          </Box>
          <Box
            color="gray.500"
            fontSize={["xs", "sm"]}
            noOfLines={1}
            wordBreak={"break-all"}
          >
            {log.timestamp}
          </Box>
        </VStack>
        <Box>{log.message}</Box>
      </HStack>
    </Alert>
  );
}

import { Box, Grid } from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";

export type LogProps = {
  id: number;
  timestamp: string;
  message: string;
  level: number;
};
type LogWidgetProps = {
  log: LogProps;
};

export default function LogWidget({ log }: LogWidgetProps) {
  return (
    <Box
      display="flex"
      flexDir="column"
      bg={
        log.level == 0 ? "blue.300" : log.level == 1 ? "orange.300" : "red.300"
      }
      px="5"
      color="white"
    >
      <Box>{log.timestamp}</Box>
      <Box>{log.message}</Box>
    </Box>
  );
}

import { Box, Text } from "ink";
import { Commit } from "./commit";

export const OutputContainer = ({ command }: { command: string }) => {
  if (command == "/help") {
    return <Commit />;
  }
  return <></>;
};

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { OutputContainer } from "./outputContainer";
import { useState } from "react";
import { colors } from "./constants";

export const Main = () => {
  const [query, setQuery] = useState("");
  const [command, setCommand] = useState("");
  function onSubmit() {
    setCommand(query);
  }
  return (
    <>
      <Box
        flexDirection="column"
        width="100%"
        alignItems="center"
        gap={2}
        backgroundColor={colors.bg}
      >
        <Box
          height={3}
          minWidth={78}
          paddingX={2}
          backgroundColor={colors.muted}
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
        >
          <Text>{">"}</Text>
          <TextInput value={query} onChange={setQuery} onSubmit={onSubmit} />
        </Box>
        <OutputContainer command={command} />
      </Box>
    </>
  );
};

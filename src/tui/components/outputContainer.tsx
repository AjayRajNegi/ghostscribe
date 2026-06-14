import { Box, Text } from "ink";

export const OutputContainer = ({ command }: { command: string }) => {
  if (command) {
    return (
      <Box>
        <Box marginRight={1}>
          <Text>Your query: {command}</Text>
        </Box>

        {/* <TextInput value={query} onChange={setQuery} onSubmit={onSubmit} /> */}
      </Box>
    );
  }
  return <></>;
};

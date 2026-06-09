import { execSync } from "child_process";
import { Box, render, Text, useFocus, useInput, useApp } from "ink";

export const UserInput = ({ commit }: { commit: string }) => {
  return (
    <>
      <Box flexDirection="column" padding={1}>
        <Text>Generated commit message is: {commit}</Text>
        <Text>Do you want to commit with this message?</Text>
      </Box>
      <Box flexDirection="row" gap={5}>
        <Input label="[y] YES" commit={commit} autoFocus />
        <Input label="[n] NO" commit={commit} />
      </Box>
    </>
  );
};

function Input({
  label,
  commit,
  autoFocus,
}: {
  label: string;
  commit: string;
  autoFocus?: boolean;
}) {
  const { isFocused } = useFocus({ autoFocus });
  const { exit } = useApp();

  useInput((input, key) => {
    if (!isFocused) return;

    if (key.return) {
      const isYes = label.startsWith("[y]");
      if (isYes && commit) {
        // execSync(`git commit -m "${commit.replace(/"/g, '\\"')}"`, {
        //   stdio: "inherit",
        // });
        console.log("Yes");
      }
      exit();
    }

    if (key.leftArrow || key.rightArrow) {
      // focus cycling is handled automatically by Ink's focus manager
    }
  });

  return <Text color={isFocused ? "green" : undefined}>{label}</Text>;
}

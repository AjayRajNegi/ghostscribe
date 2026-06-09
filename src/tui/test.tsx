import { execSync } from "child_process";
import { Box, Text, useFocus, useInput, useApp } from "ink";
import { useState, useEffect } from "react";

export const UserInput = ({ commit }: { commit: string }) => {
  return (
    <>
      <Box flexDirection="column" padding={1} borderStyle={"round"}>
        {/* <Text>Generated commit message is: {commit}</Text> */}
        <Text color={"blue"}>Do you want to commit with this message?</Text>
      </Box>
      <Box flexDirection="row" padding={1} gap={5}>
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer by one event loop tick to let the launch Enter keypress drain
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useInput((input, key) => {
    if (!isFocused || !ready) return;

    if (key.return) {
      const isYes = label.startsWith("[y]");
      if (isYes && commit) {
        execSync(`git commit -m "${commit.replace(/"/g, '\\"')}"`, {
          stdio: "inherit",
        });
      }
      exit();
    }
  });

  return <Text color={isFocused ? "green" : undefined}>{label}</Text>;
}

import { execSync } from "child_process";
import { Box, Text, useFocus, useInput, useApp } from "ink";
import { useState, useEffect } from "react";
import { runCommit } from "../cli/commit";

export const UserInput = () => {
  const [commit, setCommit] = useState<string | null>(null);

  useEffect(() => {
    runCommit({ dryRun: false }).then(setCommit);
  }, []);

  if (commit === null) {
    return (
      <Box paddingX={1}>
        <Text dimColor>Generating commit message...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1} gap={1}>
      <Text color="blue">Do you want to commit with this message?</Text>
      <Text dimColor>{commit}</Text>
      <Box flexDirection="row" gap={5}>
        <Input label="[y] YES" commit={commit} autoFocus />
        <Input label="[n] NO" commit={commit} />
      </Box>
    </Box>
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

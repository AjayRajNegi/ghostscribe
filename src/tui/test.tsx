import { execSync } from "child_process";
import { Box, Text, useFocus, useInput, useApp, useStdout } from "ink";
import { useState, useEffect } from "react";
import { runCommit } from "../cli/commit";

const C = {
  bg: "#0a0a0a",
  muted: "#6b7280",
  ghost: "#a1a1aa",
  accent: "#18d65d",
  accentDim: "#c2410c",
  success: "#22c55e",
  error: "#ef4444",
  border: "#27272a",
  commitBg: "#18181b",
};

export const UserInput = () => {
  const [commit, setCommit] = useState<string | null>(null);
  const { stdout } = useStdout();

  useEffect(() => {
    runCommit({ dryRun: false }).then(setCommit);
  }, []);

  const terminalWidth = stdout?.columns ?? 80;

  if (commit === null) {
    return (
      <Box paddingY={1}>
        <Text color={C.muted}>
          <Text color={C.accent}>›</Text> ghostscribe is reading your diff
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width={Math.min(terminalWidth - 2, 72)}>
      <Box marginBottom={1}>
        <Text color={C.accent} bold>
          ghostscribe
        </Text>
        <Text color={C.muted}> — generated commit</Text>
      </Box>

      <Box
        flexDirection="column"
        paddingX={2}
        paddingY={1}
        borderStyle="single"
        borderColor={C.border}
        backgroundColor={C.commitBg}
        width="100%"
      >
        <Text color={C.ghost}>{commit}</Text>
      </Box>

      <Box height={1} />

      <Box marginBottom={1}>
        <Text color={C.ghost}>Commit with this message?</Text>
      </Box>

      <Box flexDirection="row" gap={4}>
        <Action label="Yes" shortcut="y" commit={commit} autoFocus />
        <Action label="No" shortcut="n" commit={commit} />
      </Box>
      <Box marginTop={1}>
        <Text color={C.muted} dimColor>
          press <Text color={C.ghost}>Enter</Text> to confirm,{" "}
          <Text color={C.ghost}>Esc</Text> to cancel
        </Text>
      </Box>
    </Box>
  );
};

function Action({
  label,
  shortcut,
  commit,
  autoFocus,
}: {
  label: string;
  shortcut: string;
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

    if (key.return || input.toLowerCase() === shortcut) {
      const isYes = label === "Yes";
      if (isYes && commit) {
        execSync(`git commit -m "${commit.replace(/"/g, '\\"')}"`, {
          stdio: "inherit",
        });
      }
      exit();
    }
  });

  const isYes = label === "Yes";
  const activeColor = isYes ? C.success : C.error;
  const inactiveColor = C.muted;

  return (
    <Box flexDirection="row" gap={1}>
      {/* Shortcut bracket */}
      <Text color={isFocused ? activeColor : inactiveColor}>
        {isFocused ? "▸" : " "}
      </Text>
      <Text
        color={isFocused ? activeColor : inactiveColor}
        backgroundColor={
          isFocused ? (isYes ? "#14532d" : "#7f1d1d") : undefined
        }
        bold={isFocused}
      >
        {" "}
        {shortcut.toUpperCase()}{" "}
      </Text>
      <Text color={isFocused ? C.ghost : C.muted}>{label}</Text>
    </Box>
  );
}

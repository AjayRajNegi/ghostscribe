import { Box, Text } from "ink";
import BigText from "ink-big-text";

const C = {
  bg: "#0a0a0a",
  muted: "#6b7280",
  ghost: "#a1a1aa",
  accent: "#18d65d",
  accentDim: "#c2410c",
  success: "#22c55e",
  error: "#ef4444",
  //   border: "#27272a",
  border: "#137c3a",
  commitBg: "#18181b",
};

export const Index = () => {
  return (
    <>
      <Box
        height={10}
        width="100%"
        backgroundColor={C.bg}
        borderColor={C.border}
        borderStyle="single"
      >
        <Box>
          <BigText
            font="tiny"
            text="GhostScribe"
            align="center"
            colors={["#18d65d"]}
          />
        </Box>
      </Box>
    </>
  );
};

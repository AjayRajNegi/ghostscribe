import { Box } from "ink";
import BigText from "ink-big-text";
import { colors } from "./constants";

export const Header = () => {
  return (
    <Box backgroundColor={colors.bg}>
      <BigText
        font="tiny"
        text="GhostScribe"
        align="center"
        colors={["#18d65d"]}
      />
    </Box>
  );
};

import { Box } from "ink";
import { Header } from "./components/header";
import { colors } from "./components/constants";

export const Index = () => {
  return (
    <>
      <Box
        height="100%"
        width="100%"
        backgroundColor={colors.bg}
        borderColor={colors.border}
        borderStyle="single"
        flexDirection="column"
      >
        <Header />
      </Box>
    </>
  );
};

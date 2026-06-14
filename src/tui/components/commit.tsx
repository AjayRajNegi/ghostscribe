import { useStdout } from "ink";
import { useState, useEffect } from "react";
import { getModels } from "../../llm/getModels";
import { Box, Text } from "ink";
import { colors } from "./constants";

export const Commit = () => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  useEffect(() => {
    getModels().then(setModels);
  }, []);

  useEffect(() => {
    if (models.length === 1) {
      setSelectedModel(models[0] ?? null);
    }
  }, [models]);

  if (models.length === 0) {
    return (
      <Box paddingY={1}>
        <Text color={colors.muted}>
          <Text color={colors.accent}>›</Text> fetching your models
        </Text>
      </Box>
    );
  }

  if (!selectedModel) {
    return (
      <Box paddingY={1}>
        <Text color={colors.muted}>
          <Text color={colors.accent}>›</Text>
        </Text>
        <Box flexDirection="column">
          {models.map((model, index) => (
            // <ModelAction
            //   key={model}
            //   model={model}
            //   autoFocus={index === 0}
            //   onSelect={(model) => {
            //     setSelectedModel(model);
            //   }}
            // />
            <Text>{model}</Text>
          ))}
        </Box>
      </Box>
    );
  }

  return <></>;
};

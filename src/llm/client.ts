import { execSync } from "child_process";

interface InputPrompt {
  systemPrompt: string;
  userMessage: string;
  model: string;
}

export const callLLM = async ({
  systemPrompt,
  userMessage,
  model,
}: {
  systemPrompt: string;
  userMessage: string;
  model: string;
}): Promise<string> => {
  const prompt = `${systemPrompt} ${userMessage}`;

  const result = execSync(`ollama run ${model} `, {
    //const result = execSync("ollama run gemma3:1b", {
    input: prompt,
    stdio: ["pipe", "pipe", "inherit"],
    encoding: "utf-8",
  });

  return result;
};

// qwen2.5-coder:14b

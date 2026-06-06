import { execSync } from "child_process";

interface InputPrompt {
  systemPrompt: string;
  userMessage: string;
}

export const callLLM = async (input: InputPrompt): Promise<string> => {
  const prompt = `${input.systemPrompt} ${input.userMessage}`;

  const result = execSync("ollama run llama3.1:8b", {
    input: prompt,
    stdio: ["pipe", "pipe", "inherit"],
    encoding: "utf-8",
  });

  return result;
};

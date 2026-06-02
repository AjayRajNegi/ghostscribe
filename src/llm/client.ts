import { execSync } from "child_process";
import { llmPrompt } from "../prompts/commit";

export const callLLM = async () => {
  try {
    return execSync("ollama run llama3.1:8b", {
      input: `${await llmPrompt()}`,
      stdio: ["pipe", "inherit", "inherit"],
    });
  } catch (error) {
    console.error("Failed to get git diff:", error);
    throw error;
  }
};

callLLM();

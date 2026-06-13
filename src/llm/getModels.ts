import { execSync } from "child_process";

export const getModels = async (): Promise<string[]> => {
  const result = execSync("ollama list", {
    //const result = execSync("ollama run gemma3:1b", {
    stdio: ["pipe", "pipe", "inherit"],
    encoding: "utf-8",
  });

  const modelNames = result
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.trim().split(/\s+/)[0]!);

  return modelNames;
};

await getModels();

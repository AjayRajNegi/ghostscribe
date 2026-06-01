import { execSync } from "child_process";
import { appendFileSync, readFileSync } from "fs";

try {
  const diff = execSync("git diff --cached", { encoding: "utf8" });
  appendFileSync("diff.txt", diff);

  const prompt = readFileSync("prompt.txt", "utf8");
  const diffContent = readFileSync("diff.txt", "utf8");

  execSync("ollama run gemma3:1b", {
    input: `${prompt}\n${diffContent}`,
    stdio: ["pipe", "inherit", "inherit"],
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

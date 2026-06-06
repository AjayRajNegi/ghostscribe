import { execSync } from "child_process";

export const getDiff = (): string => {
  // const diff = execSync("git diff --cached", { encoding: "utf8" });
  const diff = execSync("git diff HEAD~1", { encoding: "utf8" });

  if (!diff) {
    throw new Error(
      'No staged changes found. Use "git add" to stage files before running ghostcribe.',
    );
  }
  return diff;
};

import { execSync } from "child_process";

export const getDiff = (): string => {
  try {
    const diff = execSync("git diff --cached", { encoding: "utf8" });
    if (!diff) {
      throw new Error(
        'No staged changes found. Use "git add" to stage files before running ghostcribe.',
      );
    }
    return diff;
  } catch (error) {
    console.error("Failed to get git diff:", error);
    throw error;
  }
};

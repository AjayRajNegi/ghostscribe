import { execSync } from "child_process";

export const getDiff = (): string => {
  try {
    return execSync("git diff HEAD~1", { encoding: "utf8" });
  } catch (error) {
    console.error("Failed to get git diff:", error);
    throw error;
  }
};

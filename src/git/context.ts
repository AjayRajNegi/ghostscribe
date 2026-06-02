import { execSync } from "child_process";
import { readFile } from "fs/promises";

const getName = async (): Promise<string> => {
  const { name } = JSON.parse(await readFile("package.json", "utf8")) as {
    name: string;
  };

  return name;
};
const getBranchName = (): string => {
  try {
    return execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
  } catch (error) {
    console.error("Failed to get branch name:", error);
    throw error;
  }
};
const getCommits = (count: number): string[] => {
  try {
    return execSync(`git log --pretty=format:"%s" -n ${count}`, {
      encoding: "utf8",
    })
      .trim()
      .split("\n");
  } catch (error) {
    console.error("Failed to get commits:", error);
    throw error;
  }
};

export const getContext = async (): Promise<string> => {
  return `The name of repo is ${await getName()}, current branch is ${getBranchName()}, latest 5 commits are [${getCommits(5)}].\n`;
};

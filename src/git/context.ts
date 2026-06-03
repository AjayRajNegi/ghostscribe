import { execSync } from "child_process";
import { readFile } from "fs/promises";

const getName = async (): Promise<string> => {
  try {
    const { name } = JSON.parse(await readFile("package.json", "utf8")) as {
      name: string;
    };
    return name ?? "unknown";
  } catch {
    return "unknown";
  }
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

export interface RepoContext {
  repoName: string;
  branchName: string;
  recentCommits: string[];
}
export const getContext = async (): Promise<RepoContext> => {
  return {
    repoName: await getName(),
    branchName: getBranchName(),
    recentCommits: getCommits(10),
  };
};

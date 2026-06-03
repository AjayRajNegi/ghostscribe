import { type FileDiff } from "../diff/parser";
import { type RepoContext } from "../git/context";

interface GenerationInput {
  systemPrompt: string;
  userMessage: string;
}

export const llmPrompt = async ({
  context,
  fileDiffs,
}: {
  context: RepoContext;
  fileDiffs: FileDiff[];
}): Promise<GenerationInput> => {
  const systemPrompt = `
  You are an expert software engineer writing git commit messages based on the git diffs provided to you.
  Output only the commit message - no explanations, no markdown, no backticks.
  Use imperative mood ("Fix bug", not "Fixed bug").
  Keep the first line under 100 characters.
  Follow Conventional Commits format: <type>(<scope>): <description>
  Allowed types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
  Do not use vague words like "update", "improve", or "modify" without specifics.`;

  const userMessage = `
  Repository: ${context.repoName}
  Branch: ${context.branchName}
  Recent commits for style reference: ${context.recentCommits.join("\n")}
  
  Git diff: ${JSON.stringify(fileDiffs, null, 2)}`;

  return { systemPrompt, userMessage };
};

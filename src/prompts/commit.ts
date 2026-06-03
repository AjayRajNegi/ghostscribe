import { parseDiff } from "../diff/parser";
import { getContext } from "../git/context";
import { getDiff } from "../git/diff";

interface GenerationInput {
  systemPrompt: string;
  userMessage: string;
}

export const llmPrompt = async (): Promise<GenerationInput> => {
  const context = await getContext();
  const diff = parseDiff(getDiff());

  const systemPrompt = `
  You are an expert software engineer writing git commit messages.
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
  
  Git diff: ${JSON.stringify(diff, null, 2)}`;

  return { systemPrompt, userMessage };
};

import { parseDiff } from "../diff/parser";
import { getContext } from "../git/context";
import { getDiff } from "../git/diff";

export const llmPrompt = async (): Promise<string> => {
  const systemPrompt = `You are an expert software engineer. Your sole task is to generate professional, concise git commit messages based on the provided project context and git diff.
  Output only the commit message — no explanations, no summaries, no introductions, no extra text.
  Use the imperative mood, present tense (e.g., "Fix bug" not "Fixes bug" or "Fixed bug").
  Keep the first line under 72 characters.
  Optionally follow Conventional Commits style (e.g., feat:, fix:, docs:, refactor:, test:, chore:), but prioritize clarity and professionalism.
  If multiple changes are present, produce one commit message that accurately describes the overall change.
  Do not include backticks, markdown, or any formatting — just the raw commit message text.
  Project details: ${await getContext()}
  Git diff: ${parseDiff(getDiff())}
  Remember: Your response must be only the commit message. Nothing else. `;
  return systemPrompt;
};

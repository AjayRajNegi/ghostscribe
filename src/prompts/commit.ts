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
  Output only a very specific commit message - no explanations, no markdown, no backticks.
  Use imperative mood ("Fix bug", not "Fixed bug").
  Keep the first line under 100 characters.
  Optionally follow Conventional Commits format: <type>(<scope>): <description>
  Allowed types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
  Do not use vague words like "update", "improve", or "modify" without specifics.`;

  const userMessage = `
  Git diff: ${JSON.stringify(fileDiffs, null, 2)}`;

  // const userMessage = `
  // Repository: ${context.repoName}
  // Branch: ${context.branchName}
  // Recent commits for style reference: ${context.recentCommits.join("\n")}

  // Git diff: ${JSON.stringify(fileDiffs, null, 2)}`;

  function summarizeFiles(fileDiffs: FileDiff[]): string {
    return fileDiffs
      .map((file) => {
        const additions = file.hunks
          .flatMap((h) => h.lines)
          .filter((l) => l.type === "addition")
          .slice(0, 20)
          .map((l) => `+ ${l.content}`);

        const deletions = file.hunks
          .flatMap((h) => h.lines)
          .filter((l) => l.type === "deletion")
          .slice(0, 20)
          .map((l) => `- ${l.content}`);

        return `
      File: ${file.path}
      Status: ${file.status}
      Additions: ${file.additions}
      Deletions: ${file.deletions}
      
      ${[...additions, ...deletions].join("\n")}
      `;
      })
      .join("\n\n");
  }
  console.log(JSON.stringify(fileDiffs, null, 2));
  console.log(summarizeFiles(fileDiffs));

  return { systemPrompt, userMessage };
};

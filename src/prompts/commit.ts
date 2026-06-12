import type { FileDiff } from "../diff/parser";
import type { RepoContext } from "../git/context";

interface GenerationInput {
  systemPrompt: string;
  userMessage: string;
}

export const llmPrompt = async ({
  fileDiffs,
}: {
  context: RepoContext;
  fileDiffs: FileDiff;
}): Promise<GenerationInput> => {
  const systemPrompt = `
  You are an expert software engineer that writes highly specific git commit message.
  
  Your task:
  1. Identify the primary behavioral change.
  2. Identify the most important files, functions, classes, APIs, tests, or configs affected.
  3. Determine the most appropriate commit type.
  4. Generate ONE commit message only.
  
  Rules:
  - Output ONLY the commit message.
  - No markdown.
  - No explanations.
  - No quotes.
  - No backticks.
  - No notes.
  - Keep under 100 characters.
  - User imperative mood.
  - Prefer Conventional Commits.
  
  Allowed types:
  feat
  fix
  refactor
  perf
  docs
  test
  build
  ci
  style
  chore
  
  Avoid generic descriptions such as:
  - update
  - improve
  - modify
  - enhance
  - miscellaneous changes
  `;

  const userMessage = `
  Analyze these code changes and generate the most specific commmit message possible.
  
  Changed files: ${fileDiffs.filesChanged}
  Files: ${fileDiffs.files.map(
    (file) => `name: ${file.name}
    oldPath: ${file.oldPath}
    newPath: ${file.newPath}
    status: ${file.status}
    isBinary: ${file.isBinary}
    additions: ${file.additions}
    reductions: ${file.additions}
  `,
  )}
  `;
  return { systemPrompt, userMessage };
};

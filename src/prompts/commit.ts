// import type { FileDiff } from "../diff/parser";
import type { FileDiff } from "../diff/parser2";
import type { RepoContext } from "../git/context";

interface GenerationInput {
  systemPrompt: string;
  userMessage: string;
}

export const llmPrompt = async ({
  context,
  fileDiffs,
}: {
  context: RepoContext;
  fileDiffs: FileDiff;
}): Promise<GenerationInput> => {
  const systemPrompt = `
  You are an expert software engineer that writes highly specific git commit messages.
  
  Your task:
  
  1. Identify the primary behavioral change.
  2. Identify the most important files, functions, classes, APIs, tests, or configs affected.
  3. Determine the most appropriate commit type.
  4. Generate ONE commit message.
  
  Rules:
  
  - Output ONLY the commit message.
  - No markdown.
  - No explanations.
  - No quotes.
  - No backticks.
  - No reference to the "the codebase", "the project", or "the repository".
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
  
  Changed files:
  

  
  Relevant code changes:
  `;
  // ${fileDiffs.map((file) => `- ${file.path} (${file.status}, +${file.additions}/-${file.deletions})`).join("\n")}
  // ${summarizeFiles(fileDiffs)}

  return { systemPrompt, userMessage };
};

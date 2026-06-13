import { parseDiff } from "../diff/parser";
import { getContext } from "../git/context";
import { getDiff } from "../git/diff";
import { callClaude } from "../llm/claude";
import { callLLM } from "../llm/client";
import { llmPrompt } from "../prompts/commit";

interface CommitOptions {
  dryRun: boolean;
  model: string;
}

export const runCommit = async ({
  dryRun,
  model,
}: CommitOptions): Promise<string> => {
  // console.log(" ");
  // console.log("Reading staged changes...");
  let rawDiff: string;
  try {
    rawDiff = getDiff();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // console.log("Reading repo context...");
  const context = await getContext();
  const fileDiffs = parseDiff(rawDiff);
  const { systemPrompt, userMessage } = await llmPrompt({ context, fileDiffs });

  let commitMessage: string;
  try {
    //commitMessage = await callClaude(generationInput);
    commitMessage = await callLLM({ systemPrompt, userMessage, model });
  } catch (error) {
    console.error(
      "LLM call failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }

  // console.log("Suggested commit message:");
  // console.log(" ");
  // console.log(commitMessage);

  if (dryRun) {
    console.log("\n[dry-run] Skipping git commit.");
    return "";
  }

  return commitMessage;
};

import { execSync } from "child_process";
// import { parseDiff } from "../diff/parser";
import { parseDiff } from "../diff/parser2";
import { getContext } from "../git/context";
import { getDiff } from "../git/diff";
import { callClaude } from "../llm/claude";
import { callLLM } from "../llm/client";
import { llmPrompt } from "../prompts/commit";

interface CommitOptions {
  dryRun: boolean;
}

export const runCommit = async ({ dryRun }: CommitOptions): Promise<void> => {
  console.log("Reading staged changes...");
  let rawDiff: string;
  try {
    rawDiff = getDiff();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log("Reading repo context...");
  const context = await getContext();
  // const fileDiffs = parseDiff(rawDiff);
  const fileDiffs = parseDiff(rawDiff);
  const generationInput = await llmPrompt({ context, fileDiffs });

  let commitMessage: string;
  try {
    //commitMessage = await callClaude(generationInput);
    commitMessage = await callLLM(generationInput);
    // console.log(commitMessage);
  } catch (error) {
    console.error(
      "LLM call failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }

  console.log("Suggested commit message:");
  console.log("─".repeat(50));
  console.log(commitMessage);
  console.log("─".repeat(50));

  if (dryRun) {
    console.log("\n[dry-run] Skipping git commit.");
    return;
  }

  try {
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
    console.log("\nCommit created successfully.");
  } catch (error) {
    console.error("git commit failed. You can commit manually with:");
    console.log(`  git commit -m "${commitMessage}"`);
    process.exit(1);
  }
};

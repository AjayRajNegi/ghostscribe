#!/usr/bin/env bun
import { Command } from "commander";
import { runCommit } from "./commit";

const program = new Command();

program
  .name("ghostscribe")
  .description("AI-powered git commit message generator")
  .version("0.1.0");

program
  .command("commit")
  .description("Generate a commit message form staged changes")
  //.option("--dry-run", "Print the commit message without committing")
  .action(async (options) => {
    let commit;
    commit = await runCommit({ dryRun: options.dryRun ?? false });
    console.log("newCommit", commit);
  });

program.parseAsync(process.argv);

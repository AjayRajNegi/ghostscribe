#!/usr/bin/env bun
import { Command } from "commander";
import { runCommit } from "./commit";
import { render } from "ink";
import React from "react";
import { UserInput } from "../tui/test";
import { Index } from "../tui";

const program = new Command();

program
  .name("ghostscribe")
  .description("AI-powered git commit message generator")
  .version("0.1.0")
  .action(async () => {
    const { waitUntilExit } = render(React.createElement(Index));
    await waitUntilExit();
  });

// program
//   .command("ghostscribe")
//   .description("Generate a commit message from staged changes")
//   .action(async (options) => {
//     const { waitUntilExit } = render(React.createElement(UserInput));
//     await waitUntilExit();
//   });

program.parseAsync(process.argv);

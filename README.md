# ghostscribe

### Phase 1: (01-06-2026)

- Basic working version:
  - File which reads diffs and pass them llm for a response.

### Phase 2: (03-06-2026)

- MVP:  
  Working CLI that takes a staged diff and returns a conventional commit message with interactive confirmation.
  - `src/git/diff.ts` — wraps `git diff --staged`, returns structured text
  - `src/git/context.ts` — reads repo name, branch name, recent commit messages (last 10) for style context
  - `src/diff/parser.ts` — parses unified diff format into structured `FileDiff[]` with hunks, before/after lines
  - `src/llm/client.ts` — abstraction interface: `generate(input: GenerationInput): Promise<string>`
  - `src/llm/claude.ts` — Claude implementation using `@anthropic-ai/sdk`
  - `src/llm/client.ts` — Local llm implementation using ollama
  - `src/prompts/commit.ts` — the commit generation prompt
  - `src/cli/commit.ts` — the command handler using Commander.js
  - Working `ghostscribe commit` command
  - `ghostscribe commit --dry-run` that prints without prompting

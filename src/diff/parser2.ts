import { getDiff } from "../git/diff";

let rawDiff = getDiff();

function splitIntoFileBlocks(rawDiff: string): string[] {
  const blocks = rawDiff.split(/(?=^diff --git)/m);
  return blocks.filter((block) => block.trim().length > 0);
}

function parseFileHeader(block: string) {
  const headerMatch = block.match(/^diff --git a\/(.+?) b\/(.+?)$/m);

  if (!headerMatch) {
    throw new Error("Invalid diff block: missing `diff --git` header.");
  }

  const oldPath = headerMatch[1];
  const newPath = headerMatch[2];

  if (!newPath) {
    throw new Error("Invalid diff block: missing newPath.");
  }

  const isAdded = block.includes("--- dev/null");
  const isDeleted = block.includes("+++ dev/null");
  const isRenamed = oldPath !== newPath;

  const status = isAdded
    ? "added"
    : isDeleted
      ? "deleted"
      : isRenamed
        ? "renamed"
        : "modified";

  const isBinary =
    /^Binary files .* differ$/m.test(block) ||
    /^GIT binary patch$/m.test(block);

  const lines = block.split("\n");

  const additions: string[] = [];
  const reductions: string[] = [];

  for (const line of lines) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      additions.push(line.slice(1));
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      reductions.push(line.slice(1));
    }
  }

  return { oldPath, newPath, status, isBinary, additions, reductions };
}

console.log(
  splitIntoFileBlocks(rawDiff).map((block) => parseFileHeader(block)),
);

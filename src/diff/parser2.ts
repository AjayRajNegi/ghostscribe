import { getDiff } from "../git/diff";

export interface FileDiff {
  filesChanged: number;
  files: Hunk[];
}

export interface Hunk {
  name: string;
  oldPath: string;
  newPath: string;
  status: string;
  isBinary: boolean;
  additions: string[];
  reductions: string[];
}

export function splitIntoFileBlocks(rawDiff: string): string[] {
  const blocks = rawDiff.split(/(?=^diff --git)/m);
  return blocks.filter((block) => block.trim().length > 0);
}

function parseFileHeader(block: string): Hunk {
  const headerMatch = block.match(/^diff --git a\/(.+?) b\/(.+?)$/m);

  if (!headerMatch) {
    throw new Error("Invalid diff block: missing `diff --git` header.");
  }

  const oldPath = headerMatch[1];
  const newPath = headerMatch[2];

  if (!newPath) {
    throw new Error("Invalid file path.");
  }

  let name = "";
  for (let i = newPath.length - 1; i >= 0; i--) {
    if (newPath[i] === "/") {
      break;
    }
    name = newPath[i] + name;
  }

  if (!newPath || !oldPath) {
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

  return {
    name,
    oldPath,
    newPath,
    status,
    isBinary,
    additions,
    reductions,
  };
}

export function parseDiff(rawDiff: string): FileDiff {
  const blocks = splitIntoFileBlocks(rawDiff);
  const filesChanged = blocks.length;
  const files = blocks.map((block) => parseFileHeader(block));

  return { filesChanged, files: files };
}

console.log(parseDiff(getDiff()));

import { getDiff } from "../git/diff";

export interface FileDiff {
  path: string;
  oldPath?: string;
  status: "modified" | "added" | "deleted" | "renamed";
  hunks: Hunk[];
  additions: number;
  deletions: number;
  isBinary: boolean;
}

export interface Hunk {
  header: string;
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: HunkLine[];
}

export interface HunkLine {
  type: "context" | "addition" | "deletion";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

type FileHeader = Pick<FileDiff, "path" | "oldPath" | "status" | "isBinary">;

function splitIntoFileBlocks(rawDiff: string): string[] {
  const blocks = rawDiff.split(/(?=^diff --git)/m);
  return blocks.filter((block) => block.trim().length > 0);
}

function parseFileHeader(block: string): FileHeader {
  const headerMatch = block.match(/^diff --git a\/(.+?) b\/(.+?)$/m);
  if (!headerMatch) {
    throw new Error("Invalid diff block: missing `diff --git` header.");
  }

  const oldPath = headerMatch[1];
  const newPath = headerMatch[2];

  if (!newPath) {
    throw new Error("Invalid diff block: missing newPath.");
  }

  const isAdded = block.includes("--- /dev/null");
  const isDeleted = block.includes("+++ /dev/null");
  const isRenamed = oldPath !== newPath;

  const status: FileDiff["status"] = isAdded
    ? "added"
    : isDeleted
      ? "deleted"
      : isRenamed
        ? "renamed"
        : "modified";

  const isBinary =
    /^Binary files .* differ$/m.test(block) ||
    /^GIT binary patch$/m.test(block);

  return {
    path: newPath,
    oldPath: isRenamed ? undefined : oldPath,
    status,
    isBinary,
  };
}

function splitIntoHunks(fileBlock: string): string[] {
  const hunkStart = fileBlock.search(/^@@/m);
  if (hunkStart === -1) return [];

  const hunkSection = fileBlock.slice(hunkStart);
  const hunks = hunkSection.split(/(?=^@@)/m);

  return hunks.filter((h) => h.trim().length > 0);
}

function parseHunkHeader(hunkString: string): Omit<Hunk, "lines"> {
  const match = hunkString.match(
    /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@.*$/m,
  );

  if (!match) {
    throw new Error(`Invalid hunk header:\n${hunkString.split("\n")[0]}`);
  }
  if (!match[1] || !match[3]) {
    throw new Error(`Invalid hunk header:\n${hunkString.split("\n")[0]}`);
  }

  return {
    header: match[0],
    oldStart: parseInt(match[1], 10),
    oldCount: parseInt(match[2] ?? "1", 10),
    newStart: parseInt(match[3], 10),
    newCount: parseInt(match[4] ?? "1", 10),
  };
}

function parseHunkLines(
  hunkBody: string,
  oldStart: number,
  newStart: number,
): HunkLine[] {
  const rawLines = hunkBody.split("\n").slice(1);
  const lines: HunkLine[] = [];

  let oldLineNum = oldStart;
  let newLineNum = newStart;

  for (const rawLine of rawLines) {
    if (rawLine === "") continue;

    const prefix = rawLine[0];
    const content = rawLine.slice(1);

    if (prefix === " ") {
      lines.push({
        type: "context",
        content,
        oldLineNumber: oldLineNum,
        newLineNumber: newLineNum,
      });
      oldLineNum++;
      newLineNum++;
    } else if (prefix === "-") {
      lines.push({
        type: "deletion",
        content,
        oldLineNumber: oldLineNum,
      });
      oldLineNum++;
    } else if (prefix === "+") {
      lines.push({
        type: "addition",
        content,
        newLineNumber: newLineNum,
      });
      newLineNum++;
    } else if (prefix === "\\") {
      // `\ No newline at end of file`
      continue;
    }
  }

  return lines;
}

function computeCounts(hunks: Hunk[]): {
  additions: number;
  deletions: number;
} {
  let additions = 0;
  let deletions = 0;

  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      if (line.type === "addition") additions++;
      if (line.type === "deletion") deletions++;
    }
  }

  return { additions, deletions };
}

function parseFileDiff(block: string): FileDiff {
  const header = parseFileHeader(block);

  if (header.isBinary) {
    return {
      ...header,
      hunks: [],
      additions: 0,
      deletions: 0,
    };
  }

  const hunkStrings = splitIntoHunks(block);
  const hunks: Hunk[] = hunkStrings.map((hunkStr) => {
    const parsedHeader = parseHunkHeader(hunkStr);
    const lines = parseHunkLines(
      hunkStr,
      parsedHeader.oldStart,
      parsedHeader.newStart,
    );

    return { ...parsedHeader, lines };
  });

  const { additions, deletions } = computeCounts(hunks);

  return {
    ...header,
    hunks,
    additions,
    deletions,
  };
}

export function parseDiff(rawDiff: string): FileDiff[] {
  const blocks = splitIntoFileBlocks(rawDiff);
  return blocks.map(parseFileDiff);
}

console.log(parseDiff(getDiff()));

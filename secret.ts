import * as cheerio from "cheerio";
interface GridPoint {
  x: number;
  y: number;
  char: string;
}

async function printMessage(url: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Response is invalid.");
  }
  const html = await response.text();

  const $ = cheerio.load(html);

  const table = $("table").first();

  const rows = $("table tr").toArray();

  const points: GridPoint[] = [];

  $("table tr")
    .slice(1)
    .each((_, row) => {
      const cells = $(row).find("td");

      if (cells.length < 3) {
        return;
      }

      points.push({
        x: Number(cells.eq(0).text().trim()),
        char: cells.eq(1).text() || " ",
        y: Number(cells.eq(2).text().trim()),
      });
    });

  if (points.length === 0) {
    return;
  }

  const maxX = Math.max(...points.map((p) => p.x));
  const maxY = Math.max(...points.map((p) => p.y));

  const grid: string[][] = Array.from({ length: maxY + 1 }, () =>
    Array(maxX + 1).fill(" "),
  );
  for (const { x, y, char } of points) {
    grid[y][x] = char;
  }

  for (let y = maxY; y >= 0; y--) {
    console.log(grid[y].join(""));
  }
}

await printMessage(
  "https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub",
);

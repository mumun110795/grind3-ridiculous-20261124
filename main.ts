import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The whole entry is this one sentence: an absurd service (renting out fake
// diners) whose payer and profit logic are spelled out inside the line itself.
const PITCH =
  "We rent fake diners to empty restaurants, which pay per seated stranger because a room that looks busy pulls in real customers, and our actors order only tap water and the cheapest soup.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

function checkPitch(text: string): void {
  const length = [...text].length;
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `Pitch must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${length}.`
    );
  }
  if (text.trim().length === 0) {
    throw new Error("Pitch must not be blank.");
  }
}

function main(): void {
  checkPitch(PITCH);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output directory can be a mounted volume, so create it if needed and
  // never remove it; just write our file into it.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, PITCH, { encoding: "utf8" });

  // Read the file back and check it landed intact: a short or altered write
  // would otherwise ship silently as a broken entry.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== PITCH) {
    throw new Error(
      `entry.txt does not match the intended pitch (wrote ${[...PITCH].length} characters, read back ${[...written].length}).`
    );
  }

  console.log(`Wrote ${[...PITCH].length} characters to ${target}`);
}

main();

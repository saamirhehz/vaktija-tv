import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const source = join(process.cwd(), "dist");
const destination = join(
  process.cwd(),
  "android",
  "app",
  "src",
  "main",
  "assets",
  "web"
);

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

console.log(`Synced ${source} -> ${destination}`);

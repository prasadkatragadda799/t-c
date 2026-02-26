import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { ...opts, shell: false }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      if (err) reject(err);
      else resolve();
    });
  });
}

async function rimraf(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
}

async function main() {
  const publicDir = path.join(rootDir, "public");

  await rimraf(publicDir);
  await fs.mkdir(publicDir, { recursive: true });

  // Copy static assets
  await fs.copyFile(path.join(rootDir, "index.html"), path.join(publicDir, "index.html"));
  await fs.copyFile(path.join(rootDir, "styles.css"), path.join(publicDir, "styles.css"));

  // Compile TypeScript -> public/script.js
  const nodeBin = process.execPath;
  const tscJs = path.join(rootDir, "node_modules", "typescript", "bin", "tsc");
  await run(nodeBin, [tscJs, "-p", path.join(rootDir, "tsconfig.build.json")], { cwd: rootDir });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


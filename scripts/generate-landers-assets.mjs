import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const vis = resolve(root, "public/projects/landers/visualize_attitude.py");
const outDir = resolve(root, "public/projects/landers/generated");

mkdirSync(outDir, { recursive: true });

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// This generates an embeddable MP4 if your Python environment supports it (ffmpeg).
// In this environment ffmpeg isn't guaranteed, so we generate a GIF by default.
const gifOut = resolve(outDir, "attitude_animation.gif");

mkdirSync(dirname(gifOut), { recursive: true });

// If the repo is built somewhere without Python/matplotlib/ffmpeg, we skip gracefully.
// You can run this locally (where your env is set up) and commit the generated assets.
try {
  // Prefer python3, fall back to python.
  const python = existsSync("/usr/bin/python3") ? "python3" : "python";
  run(python, [
    vis,
    "--mode",
    "animate",
    "--save-gif",
    gifOut,
    "--step",
    "2",
  ]);
} catch (e) {
  console.warn("[warn] failed to generate landers assets:", e);
  console.warn("[warn] run this script locally with python3 + matplotlib installed, then commit the generated files.");
}


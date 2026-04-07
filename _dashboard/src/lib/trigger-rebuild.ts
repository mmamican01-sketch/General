import { spawn } from "child_process";
import { ASTRO_ROOT } from "./workspace";

let rebuildInProgress = false;

export function triggerRebuild(): void {
  if (rebuildInProgress) return;
  rebuildInProgress = true;

  const isWin = process.platform === "win32";
  const cmd = isWin ? "npm.cmd" : "npm";
  const args = ["run", "build:publish"];

  const proc = spawn(cmd, args, {
    cwd: ASTRO_ROOT,
    shell: isWin,
    stdio: "ignore",
  });

  proc.on("close", () => {
    rebuildInProgress = false;
  });

  proc.on("error", () => {
    rebuildInProgress = false;
  });
}

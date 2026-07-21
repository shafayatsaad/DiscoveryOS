// Purpose: Launch the Next standalone server for Playwright with static assets in place.

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const standaloneRoot = join(root, ".next", "standalone", "apps", "web");
const staticSource = join(root, ".next", "static");
const staticTarget = join(standaloneRoot, ".next", "static");
const publicSource = join(root, "public");
const publicTarget = join(standaloneRoot, "public");

if (!existsSync(join(standaloneRoot, "server.js"))) {
  throw new Error("Next standalone server is missing. Run `npm run build` first.");
}

mkdirSync(join(standaloneRoot, ".next"), { recursive: true });
cpSync(staticSource, staticTarget, { recursive: true });

if (existsSync(publicSource)) {
  cpSync(publicSource, publicTarget, { recursive: true });
}

const child = spawn(process.execPath, [join(standaloneRoot, "server.js")], {
  env: {
    ...process.env,
    HOSTNAME: process.env.HOSTNAME ?? "127.0.0.1",
    PORT: process.env.PORT ?? "3100",
  },
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

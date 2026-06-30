/**
 * Postinstall script: ensures NativeWind gets tailwindcss v3
 * even though the root workspace uses tailwindcss v4.
 *
 * NativeWind (v4) checks `require("tailwindcss/package.json").version`
 * at load time and throws if it's not v3. Because npm hoists
 * tailwindcss v4 to the root node_modules, NativeWind always
 * resolves to v4 and crashes.
 *
 * This script installs tailwindcss v3 as a nested dependency inside
 * node_modules/nativewind/node_modules so Node.js resolves it first.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const nativewindDir = path.join(root, "node_modules", "nativewind");
const nestedTw = path.join(nativewindDir, "node_modules", "tailwindcss");

if (!fs.existsSync(nativewindDir)) {
  // nativewind not installed — nothing to fix
  process.exit(0);
}

// Check if tailwindcss v3 is already nested inside nativewind
let needsInstall = true;
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(nestedTw, "package.json"), "utf8"));
  if (pkg.version && pkg.version.startsWith("3.")) {
    needsInstall = false;
  }
} catch {
  // not found or unreadable — needs install
}

if (needsInstall) {
  console.log("[fix-nativewind] Installing tailwindcss@3.4.10 inside nativewind…");
  try {
    execSync("npm install tailwindcss@3.4.10 --no-save --legacy-peer-deps", {
      cwd: nativewindDir,
      stdio: "inherit",
    });
    console.log("[fix-nativewind] Done.");
  } catch (err) {
    console.error("[fix-nativewind] Failed:", err.message);
    process.exit(1);
  }
} else {
  console.log("[fix-nativewind] tailwindcss v3 already present — skipping.");
}

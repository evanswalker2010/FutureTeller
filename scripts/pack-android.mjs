import { spawn } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const androidHome = process.env.ANDROID_HOME || path.join(process.env.HOME || "", "android-sdk");

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || root,
      stdio: "inherit",
      env: { ...process.env, ...options.env },
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}`));
    });
  });
}

await run(process.execPath, [path.join(root, "scripts/brand-icons.mjs")]);
await run(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build"], {
  env: { DESKTOP_EXPORT: "1" },
});
await rm(path.join(root, ".next-desktop", "download"), { recursive: true, force: true });
await run(process.execPath, [path.join(root, "node_modules/@capacitor/cli/bin/capacitor"), "sync", "android"]);
await run(process.execPath, [path.join(root, "node_modules/@capacitor/cli/bin/capacitor"), "sync", "ios"]);
await writeFile(path.join(root, "android/local.properties"), `sdk.dir=${androidHome}\n`);
await run("./gradlew", ["clean", "assembleDebug", "--no-daemon"], {
  cwd: path.join(root, "android"),
  env: {
    ANDROID_HOME: androidHome,
    ANDROID_SDK_ROOT: androidHome,
  },
});
const apk = path.join(root, "android/app/build/outputs/apk/debug/app-debug.apk");
const download = path.join(root, "public/download");
await mkdir(download, { recursive: true });
await copyFile(apk, path.join(download, "yijing-android.apk"));
console.log(`packed android: ${path.join(download, "yijing-android.apk")}`);

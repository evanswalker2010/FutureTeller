import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const { packager } = createRequire(import.meta.url)("@electron/packager");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseDir = path.join(root, "release");
const stageDir = path.join(releaseDir, "stage");
const downloadDir = path.join(root, "public", "download");
const arches = ["arm64", "x64"];

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

function renderPng(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "#14110e",
  });
  return Buffer.from(resvg.render().asPng());
}

function buildIcns(images) {
  const chunks = images.map(({ type, png }) => {
    const header = Buffer.alloc(8);
    header.write(type, 0, 4, "ascii");
    header.writeUInt32BE(png.length + 8, 4);
    return Buffer.concat([header, png]);
  });
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(8);
  header.write("icns", 0, 4, "ascii");
  header.writeUInt32BE(body.length + 8, 4);
  return Buffer.concat([header, body]);
}

async function writeIcon() {
  const svg = await readFile(path.join(root, "app", "icon.svg"));
  const sizes = [
    ["ic11", 64],
    ["ic12", 128],
    ["ic07", 128],
    ["ic08", 256],
    ["ic13", 512],
    ["ic09", 512],
    ["ic14", 1024],
    ["ic10", 1024],
  ];
  const images = sizes.map(([type, size]) => ({ type, png: renderPng(svg, size) }));
  const iconPath = path.join(root, "desktop", "icon.icns");
  await writeFile(iconPath, buildIcns(images));
  return iconPath;
}

async function exportSite() {
  await run(process.execPath, [path.join(root, "node_modules", "next", "dist", "bin", "next"), "build"], {
    DESKTOP_EXPORT: "1",
  });
}

async function stageApp() {
  await rm(stageDir, { recursive: true, force: true });
  await mkdir(stageDir, { recursive: true });
  await writeFile(
    path.join(stageDir, "package.json"),
    JSON.stringify(
      {
        name: "yijing",
        productName: "易经算卦",
        version: "0.1.0",
        private: true,
        main: "main.cjs",
      },
      null,
      2,
    ),
  );
  await rm(path.join(root, ".next-desktop", "download"), { recursive: true, force: true });
  await cp(path.join(root, "desktop", "main.cjs"), path.join(stageDir, "main.cjs"));
  await cp(path.join(root, "desktop", "preload.cjs"), path.join(stageDir, "preload.cjs"));
  await cp(path.join(root, ".next-desktop"), path.join(stageDir, "out"), { recursive: true });
}

async function main() {
  const icon = await writeIcon();
  await exportSite();
  await stageApp();
  await mkdir(downloadDir, { recursive: true });

  for (const arch of arches) {
    const out = path.join(releaseDir, arch);
    await rm(out, { recursive: true, force: true });
    const appPaths = await packager({
      dir: stageDir,
      name: "易经算卦",
      platform: "darwin",
      arch,
      out,
      overwrite: true,
      icon,
      asar: false,
      prune: false,
      appBundleId: "app.yijing.divination",
      appCategoryType: "public.app-category.lifestyle",
      appVersion: "0.1.0",
      darwinDarkModeSupport: true,
      extendInfo: {
        CFBundleDisplayName: "易经算卦",
        CFBundleName: "易经算卦",
        NSHighResolutionCapable: true,
      },
    });
    const packed = appPaths[0];
    const appPath = packed.endsWith(".app") ? packed : path.join(packed, "易经算卦.app");
    await copyFile(icon, path.join(appPath, "Contents", "Resources", "electron.icns"));
    const zipName = arch === "arm64" ? "yijing-mac-apple-silicon.zip" : "yijing-mac-intel.zip";
    const zipPath = path.join(downloadDir, zipName);
    await rm(zipPath, { force: true });
    await new Promise((resolve, reject) => {
      const child = spawn("zip", ["-r", "-y", "-q", zipPath, "易经算卦.app"], {
        cwd: path.dirname(appPath),
        stdio: "inherit",
      });
      child.on("error", reject);
      child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`zip exited ${code}`))));
    });
    console.log(`packed ${arch}: ${zipPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

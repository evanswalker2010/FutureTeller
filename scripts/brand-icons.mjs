import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function png(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "#14110e",
  });
  return Buffer.from(resvg.render().asPng());
}

const icon = await readFile(path.join(root, "app", "icon.svg"));
const splash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#14110e"/>
  <g transform="translate(348 768) scale(6)">
    ${icon.toString("utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}
  </g>
</svg>`;

const launchers = [
  ["mipmap-mdpi", 48],
  ["mipmap-hdpi", 72],
  ["mipmap-xhdpi", 96],
  ["mipmap-xxhdpi", 144],
  ["mipmap-xxxhdpi", 192],
];
for (const [dir, size] of launchers) {
  const image = png(icon, size);
  const folder = path.join(root, "android/app/src/main/res", dir);
  await writeFile(path.join(folder, "ic_launcher.png"), image);
  await writeFile(path.join(folder, "ic_launcher_round.png"), image);
}
const foregrounds = [
  ["mipmap-mdpi", 108],
  ["mipmap-hdpi", 162],
  ["mipmap-xhdpi", 216],
  ["mipmap-xxhdpi", 324],
  ["mipmap-xxxhdpi", 432],
];
for (const [dir, size] of foregrounds) {
  const image = png(icon, size);
  await writeFile(path.join(root, "android/app/src/main/res", dir, "ic_launcher_foreground.png"), image);
}

const splashPng = png(splash, 1080);
const splashDirs = [
  "drawable",
  "drawable-port-mdpi",
  "drawable-port-hdpi",
  "drawable-port-xhdpi",
  "drawable-port-xxhdpi",
  "drawable-port-xxxhdpi",
  "drawable-land-mdpi",
  "drawable-land-hdpi",
  "drawable-land-xhdpi",
  "drawable-land-xxhdpi",
  "drawable-land-xxxhdpi",
];
for (const dir of splashDirs) {
  await writeFile(path.join(root, "android/app/src/main/res", dir, "splash.png"), splashPng);
}

await writeFile(path.join(root, "app/apple-icon.png"), png(icon, 180));
await writeFile(
  path.join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"),
  png(icon, 1024),
);
const iosSplash = png(splash, 2732);
const splashSet = path.join(root, "ios/App/App/Assets.xcassets/Splash.imageset");
for (const name of ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]) {
  await writeFile(path.join(splashSet, name), iosSplash);
}
console.log("icons written");

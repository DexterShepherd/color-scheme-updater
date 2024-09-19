import { execSync } from "child_process";
import fs from "fs";
import { homedir } from "os";
import path from "path";

export function run() {
  const alacrittyConfigPath = path.join(
    homedir(),
    ".config/alacritty/alacritty.toml",
  );
  const dark = "~/.config/alacritty/kanagawa.toml";
  const light = "~/.config/alacritty/kanagawa-light.toml";

  const contents = fs.readFileSync(alacrittyConfigPath, "utf8").split("\n");

  const isDark = execSync(`dark-mode status`).toString().trim() === "off";
  if (isDark) {
    contents[0] = `import = ["${dark}"]`;
  } else {
    contents[0] = `import = ["${light}"]`;
  }

  fs.writeFileSync(alacrittyConfigPath, contents.join("\n"));
}

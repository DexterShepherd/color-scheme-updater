import { execSync } from "child_process";
import fs from "fs";
import { homedir } from "os";
import path from "path";

export function run() {
  const tmuxConfigPath = path.join(homedir(), "dotfiles/.tmux-colors.conf");
  const lightColorsPath = "~/dotfiles/.tmux-light.conf";
  const darkColorsPath = "~/dotfiles/.tmux-dark.conf";

  const contents = fs.readFileSync(tmuxConfigPath, "utf8").split("\n");

  const isDark = execSync(`dark-mode status`).toString().trim() === "on";
  if (isDark) {
    contents[0] = `source-file ${darkColorsPath}`;
  } else {
    contents[0] = `source-file ${lightColorsPath}`;
  }

  fs.writeFileSync(tmuxConfigPath, contents.join("\n"));
  try {
    execSync("tmux source-file ~/dotfiles/.tmux.conf");
  } catch (e) {
    // likely not running under tmux
  }
}

import { execSync } from "child_process";
import fs from "fs";
import { homedir } from "os";
import path from "path";

export function run() {
  const tmuxConfigPath = path.join(homedir(), "dotfiles/.tmux.conf");
  const dark = {
    thm_bg: "#2A2A37",
    thm_fg: "#dcd7ba",
    thm_secondary: "#7E9CD8",
  };
  const light = {
    thm_bg: "#f2ecbc",
    thm_fg: "#b35b79",
    thm_secondary: "#5d57a3",
  };

  type Theme = typeof dark | typeof light;

  const contents = fs.readFileSync(tmuxConfigPath, "utf8").split("\n");

  function replaceTheme(theme: Theme, contents: string[]) {
    const themeKeys = Object.keys(theme);
    for (let i = 0; i < contents.length; i++) {
      const line = contents[i];
      for (const [key, value] of Object.entries(theme)) {
        if (line.includes(`${key}=`)) {
          contents[i] = `${key}="${value}"`;
        }
      }
    }
  }

  const isDark = execSync(`dark-mode status`).toString().trim() === "on";
  if (isDark) {
    replaceTheme(dark, contents);
  } else {
    replaceTheme(light, contents);
  }

  fs.writeFileSync(tmuxConfigPath, contents.join("\n"));
  try {
    execSync("tmux source-file ~/.tmux.conf");
  } catch (e) {
    // likely not running under tmux
  }
}

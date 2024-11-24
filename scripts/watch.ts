import { debounce } from "@std/debounce";

const watch = (path: string) => Deno.watchFs(path);
const cp = (from: string | URL, to: string | URL) => Deno.copyFile(from, to);
const padStart = (n: number) => String(n).padStart(2, "0");
const dateTimeFormatted = (date: Date) => {
  const day = padStart(date.getDay());
  const month = padStart(date.getMonth());
  const year = padStart(date.getFullYear());
  const hours = padStart(date.getHours());
  const minutes = padStart(date.getMinutes());
  const seconds = padStart(date.getSeconds());

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
};

async function main() {
  const themePath = Deno.cwd() + "/themes/astronaut.json";
  const zedThemePath = Deno.env.get("HOME") +
    "/.config/zed/themes/astronaut.json";

  console.info("info: watching theme file for changes...");

  const debouncedOp = debounce(() => {
    cp(themePath, zedThemePath);
    console.info(
      `info: theme was updated at ${dateTimeFormatted(new Date())}.`,
    );
  }, 1000);

  for await (const fsEvt of watch(themePath)) {
    if (fsEvt.kind === "modify") {
      debouncedOp();
    }
  }
}

main();

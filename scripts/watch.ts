import { debounce } from "@std/debounce";

const watch = (path: string) => Deno.watchFs(path);
const cp = (from: string | URL, to: string | URL) => Deno.copyFile(from, to);
const padStart = (n: number) => String(n).padStart(2, "0");
const dateTimeFormatted = (date: Date) => {
  return `${padStart(date.getMonth())}/${padStart(date.getDay())}/${
    padStart(date.getFullYear())
  }, ${padStart(date.getHours())}:${padStart(date.getMinutes())}:${
    padStart(date.getSeconds())
  }`;
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

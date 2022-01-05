import { cosmiconfig } from "cosmiconfig";

export { load };

async function load(config, cwd) {
  const explorer = cosmiconfig("commitizen", {
    packageProp: "config.commitizen",
    searchPlaces: [".czrc", ".cz.json", "package.json"],
    searchFrom: cwd,
  });

  return await explorer.search().config;
}

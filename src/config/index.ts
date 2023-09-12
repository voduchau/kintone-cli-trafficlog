import { readFileSync, existsSync } from "fs";
import { getFilePath } from "../util/";
import { ERROR } from "../log/constant";

export const getConfig = (configPath: string) => {
  const path = getFilePath(configPath);
  if (!existsSync(path)) {
    throw new Error(ERROR.CONFIG.FILE_PATH_INVALID);
  }

  const configFileData = readFileSync(path, "utf8");
  const jsonData = JSON.parse(configFileData) as Config;
  return jsonData ?? {};
};
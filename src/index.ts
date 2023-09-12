import {Command} from "commander";
import { getProcess } from "./process";
import { CONFIG } from "./config/constant";
import { getConfig } from "./config";

const program = new Command();

program
  .version(CONFIG.VERSION)
  .description("This is a tool to track kintone-cli traffic logs.")
  .option("-c, --config <Config File>", "Specify config file.")
  .action((option) => {
    const config = getConfig(option.config);
    getProcess(config).run();
  });

program.parse(process.argv);
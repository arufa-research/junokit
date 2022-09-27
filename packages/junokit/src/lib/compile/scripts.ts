import chalk from "chalk";
import { execSync } from "child_process";

import { JunokitError } from "../../internal/core/errors";
import { ERRORS } from "../../internal/core/errors-list";

export async function buildTsScripts (): Promise<void> {
  console.log(
    `🛠 Compiling TS files in directories: ${chalk.gray("scripts/")}, ${chalk.gray("test/")}`
  );
  console.log("===========================================");
  // Compiles the ts files to js files in build/ directory
  try {
    execSync(`npx tsc --build .`, { stdio: 'inherit' });
  } catch (error) {
    if (error instanceof Error) {
      throw new JunokitError(ERRORS.GENERAL.TS_COMPILE_ERROR);
    } else {
      throw error;
    }
  }
}

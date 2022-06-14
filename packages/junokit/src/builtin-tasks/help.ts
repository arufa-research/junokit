import { HelpPrinter } from "../internal/cli/help-printer";
import { task } from "../internal/core/config/config-env";
import { JUNOKIT_PARAM_DEFINITIONS } from "../internal/core/params/junokit-params";
import { getPackageJson } from "../internal/util/packageInfo";
import { JunokitRuntimeEnvironment } from "../types";
import { TASK_HELP } from "./task-names";

const JUNOKIT_NAME = "junokit";
export default function (): void {
  task(TASK_HELP, "Prints this message")
    .addOptionalPositionalParam(
      "task",
      "An optional task to print more info about"
    )
    .setAction(help);
}

async function help (
  { task: taskName }: { task?: string }, env: JunokitRuntimeEnvironment
): Promise<void> {
  const packageJson = await getPackageJson();
  const helpPrinter = new HelpPrinter(
    JUNOKIT_NAME,
    packageJson.version,
    JUNOKIT_PARAM_DEFINITIONS,
    env.tasks
  );

  if (taskName !== undefined) {
    helpPrinter.printTaskHelp(taskName);
    return;
  }

  helpPrinter.printGlobalHelp();
}

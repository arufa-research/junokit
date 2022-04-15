import debug from "debug";
import fsExtra from "fs-extra";

import { task } from "../internal/core/config/config-env";
import { TrestleError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { SCRIPTS_DIR } from "../internal/core/project-structure";
import { runScript } from "../internal/util/script-runner";
import { assertDirChildren } from "../lib/files";
import { TrestleRuntimeEnvironment } from "../types";
import { TASK_RUN } from "./task-names";

interface Input {
  scripts: string[]
  skipCheckpoints: boolean
}

export function filterNonExistent (scripts: string[]): string[] {
  return scripts.filter(script => !fsExtra.pathExistsSync(script));
}

async function runScripts (
  runtimeEnv: TrestleRuntimeEnvironment,
  scriptNames: string[],
  force: boolean,
  logDebugTag: string,
  allowWrite: boolean
): Promise<void> {
  const log = debug(logDebugTag);

  // force boolean will be used when we have checkpoint support

  for (const relativeScriptPath of scriptNames) {
    log(`Running script ${relativeScriptPath}`);
    await runScript(
      relativeScriptPath,
      runtimeEnv
    );
  }
}

async function executeRunTask (
  { scripts, skipCheckpoints }: Input,
  runtimeEnv: TrestleRuntimeEnvironment
  // eslint-disable-next-line
): Promise<any> {
  const logDebugTag = "trestle:tasks:run";

  const nonExistent = filterNonExistent(scripts);
  if (nonExistent.length !== 0) {
    throw new TrestleError(ERRORS.BUILTIN_TASKS.RUN_FILES_NOT_FOUND, {
      scripts: nonExistent
    });
  }

  if (skipCheckpoints) { // used by Contract() class to skip checkpoints
    runtimeEnv.runtimeArgs.useCheckpoints = false;
  }

  await runScripts(
    runtimeEnv,
    assertDirChildren(SCRIPTS_DIR, scripts),
    true,
    logDebugTag,
    false
  );
}

export default function (): void {
  task(TASK_RUN, "Runs a user-defined script after compiling the project")
    .addVariadicPositionalParam(
      "scripts",
      "A js file to be run within trestle's environment"
    )
    .addFlag("skipCheckpoints", "do not read from or write checkpoints")
    .setAction((input, env) => executeRunTask(input, env));
}

import debug from "debug";
import * as path from "path";

import { JunokitRuntimeEnvironment } from "../../types";
import { JunokitError } from "../core/errors";
import { ERRORS } from "../core/errors-list";

const log = debug("junokit:core:scripts-runner");
// eslint-disable-next-line
async function loadScript (relativeScriptPath: string): Promise<any> {
  const absoluteScriptPath = path.join(process.cwd(), relativeScriptPath);
  try {
    return require(absoluteScriptPath);
  } catch (err) {
    throw new JunokitError(ERRORS.GENERAL.SCRIPT_LOAD_ERROR, {
      script: absoluteScriptPath,
      error: (err as Error).message
    });
  }
}

/** Returns error line number and position at line attached with path.
 * @param error Error
 * @param scriptPath relative path to script where error occured
 */
function attachLineNumbertoScriptPath (
  // eslint-disable-next-line
  error: Error | JunokitError | any, scriptPath: string
): string {
  const stackTraces = error.stack.split('\n');
  for (const trace of stackTraces) {
    const line = trace?.split(scriptPath.concat(':'))[1]?.slice(0, -1); // extract line number
    if (line) {
      const [lineNo, position] = line.split(':') as [string, string];
      return scriptPath.concat(`:Line:${lineNo},Position:${position}`);
    }
  }
  return scriptPath;
}
// eslint-disable-next-line
function displayErr (error: Error | JunokitError | any, relativeScriptPath: string): void {
  if (error instanceof JunokitError) {
    throw error;
  }
  const relativeScriptPathWithLine = attachLineNumbertoScriptPath(error, relativeScriptPath);

  throw new JunokitError(
    ERRORS.BUILTIN_TASKS.RUN_SCRIPT_ERROR, {
      script: relativeScriptPathWithLine,
      error: error.message
    },
    error
  );
}

export async function runScript (
  relativeScriptPath: string,
  runtimeEnv: JunokitRuntimeEnvironment
): Promise<void> {
  if (relativeScriptPath.endsWith('.ts')) {
    relativeScriptPath = path.join('build', relativeScriptPath.split('.ts')[0] + '.js');
  }

  log(`Running ${relativeScriptPath}.default()`);
  const requiredScript = await loadScript(relativeScriptPath);
  if (!requiredScript.default) {
    throw new JunokitError(ERRORS.GENERAL.NO_DEFAULT_EXPORT_IN_SCRIPT, {
      script: relativeScriptPath
    });
  }
  try {
    await requiredScript.default(runtimeEnv);
  } catch (error) {
    displayErr(error, relativeScriptPath);
  }
}

/**
 * Ensure junokit/register source file path is resolved to compiled JS file
 * instead of TS source file, so we don't need to run ts-node unnecessarily.
 */
export function resolveBuilderRegisterPath (): string {
  const junokitCoreBaseDir = path.join(__dirname, "..", "..", "..");

  return path.join(
    junokitCoreBaseDir,
    "dist/register.js"
  );
}

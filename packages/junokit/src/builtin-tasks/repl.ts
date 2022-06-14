import chalk from "chalk";
import repl from "repl";
import { runInNewContext } from "vm";

import * as junokit from "../index";
import { task } from "../internal/core/config/config-env";
import { isRecoverableError, preprocess } from "../internal/util/repl";
import { JunokitRuntimeEnvironment, TaskArguments } from "../types";
import { TASK_REPL } from "./task-names";

// handles top level await by preprocessing input and awaits the output before returning
async function evaluate (code: string, context: Record<string, unknown>, filename: string,
  callback: (err: Error | null, result?: Record<string, unknown>) => void): Promise<void> {
  try {
    const result = await runInNewContext(preprocess(code), context);
    callback(null, result);
  } catch (e) {
    if (e instanceof Error && isRecoverableError(e)) {
      callback(new repl.Recoverable(e));
    } else {
      console.error(e);
      callback(null);
    }
  }
}

async function startConsole (runtimeEnv: JunokitRuntimeEnvironment): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    console.log("★★★", chalk.blueBright(" Welcome to junokit REPL"), "★★★");
    console.log(chalk.green('Try typing: config\n'));

    const server = repl.start({
      prompt: 'junokit> ',
      eval: evaluate
    });

    // assign repl context
    server.context.junokit = junokit;
    server.context.config = runtimeEnv.network;
    server.context.env = runtimeEnv;

    server.on('exit', () => {
      resolve();
    });
  });
}

export default function (): void {
  task(TASK_REPL, "Opens junokit console")
    .setAction(
      async (
        _taskArgs: TaskArguments,
        runtimeEnv: JunokitRuntimeEnvironment
      ) => {
        if (!runtimeEnv.config.paths) {
          return;
        }
        await startConsole(runtimeEnv);
      }
    );
}

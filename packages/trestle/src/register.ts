import debug from "debug";

import { TrestleContext } from "./internal/context";
import { loadConfigAndTasks } from "./internal/core/config/config-loading";
import { getEnvRuntimeArgs } from "./internal/core/params/env-variables";
import { TRESTLE_PARAM_DEFINITIONS } from "./internal/core/params/trestle-params";
import { Environment } from "./internal/core/runtime-env";
import {
  disableReplWriterShowProxy,
  isNodeCalledWithoutAScript
} from "./internal/util/console";

async function registerEnv (): Promise<void> {
  if (!TrestleContext.isCreated()) { return; }

  require("source-map-support/register");

  const ctx = TrestleContext.createTrestleContext();

  if (isNodeCalledWithoutAScript()) { disableReplWriterShowProxy(); }

  const runtimeArgs = getEnvRuntimeArgs(
    TRESTLE_PARAM_DEFINITIONS,
    process.env
  );

  if (runtimeArgs.verbose) { debug.enable("trestle*"); }

  const config = await loadConfigAndTasks(runtimeArgs);

  if (!runtimeArgs.network) { runtimeArgs.network = "default"; }

  const env = new Environment(
    config,
    runtimeArgs,
    ctx.tasksDSL.getTaskDefinitions(),
    ctx.extendersManager.getExtenders(),
    false
  );
  ctx.setRuntimeEnv(env);

  env.injectToGlobal();
}

registerEnv().catch((err) => console.error(err));

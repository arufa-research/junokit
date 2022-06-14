import debug from "debug";

import { JunokitContext } from "./internal/context";
import { loadConfigAndTasks } from "./internal/core/config/config-loading";
import { getEnvRuntimeArgs } from "./internal/core/params/env-variables";
import { JUNOKIT_PARAM_DEFINITIONS } from "./internal/core/params/junokit-params";
import { Environment } from "./internal/core/runtime-env";
import {
  disableReplWriterShowProxy,
  isNodeCalledWithoutAScript
} from "./internal/util/console";

async function registerEnv (): Promise<void> {
  if (!JunokitContext.isCreated()) { return; }

  require("source-map-support/register");

  const ctx = JunokitContext.createJunokitContext();

  if (isNodeCalledWithoutAScript()) { disableReplWriterShowProxy(); }

  const runtimeArgs = getEnvRuntimeArgs(
    JUNOKIT_PARAM_DEFINITIONS,
    process.env
  );

  if (runtimeArgs.verbose) { debug.enable("junokit*"); }

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

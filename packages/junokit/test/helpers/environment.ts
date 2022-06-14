import debug from "debug";

import { JunokitContext } from "../../src/internal/context";
import { loadConfigAndTasks } from "../../src/internal/core/config/config-loading";
import { JunokitError } from "../../src/internal/core/errors";
import { ERRORS } from "../../src/internal/core/errors-list";
import { getEnvRuntimeArgs } from "../../src/internal/core/params/env-variables";
import { JUNOKIT_PARAM_DEFINITIONS } from "../../src/internal/core/params/junokit-params";
import { Environment } from "../../src/internal/core/runtime-env";
import { resetJunokitContext } from "../../src/internal/reset";
import { JunokitNetworkConfig, JunokitRuntimeEnvironment, NetworkConfig, PromiseAny } from "../../src/types";

declare module "mocha" {
  interface Context {
    env: JunokitRuntimeEnvironment
  }
}

let ctx: JunokitContext;

export const defaultNetCfg: JunokitNetworkConfig = {
  accounts: [],
  endpoint: "http://localhost:1337/"
};

export function useEnvironment (
  beforeEachFn?: (junokitRuntimeEnv: JunokitRuntimeEnvironment) => PromiseAny
): void {
  beforeEach("Load environment", async function () {
    this.env = await getEnv(defaultNetCfg);
    if (beforeEachFn) {
      return await beforeEachFn(this.env);
    }
  });

  afterEach("reset builder context", function () {
    resetJunokitContext();
  });
}

export async function getEnv (
  defaultNetworkCfg?: NetworkConfig
): Promise<JunokitRuntimeEnvironment> {
  if (JunokitContext.isCreated()) {
    ctx = JunokitContext.getJunokitContext();

    // The most probable reason for this to happen is that this file was imported
    // from the config file
    if (ctx.environment === undefined) {
      throw new JunokitError(ERRORS.GENERAL.LIB_IMPORTED_FROM_THE_CONFIG);
    }

    return ctx.environment;
  }

  ctx = JunokitContext.createJunokitContext();
  const runtimeArgs = getEnvRuntimeArgs(
    JUNOKIT_PARAM_DEFINITIONS,
    process.env
  );

  if (runtimeArgs.verbose) {
    debug.enable("junokit*");
  }

  const config = await loadConfigAndTasks(runtimeArgs);

  if (runtimeArgs.network == null) {
    throw new Error("INTERNAL ERROR. Default network should be registered in `register.ts` module");
  }

  if (defaultNetworkCfg !== undefined) {
    config.networks.default = defaultNetworkCfg;
  }

  const env = new Environment(
    config,
    runtimeArgs,
    ctx.tasksDSL.getTaskDefinitions(),
    ctx.extendersManager.getExtenders(),
    true);
  ctx.setRuntimeEnv(env);

  return env;
}

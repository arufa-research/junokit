import debug from "debug";

import { TrestleContext } from "../../src/internal/context";
import { loadConfigAndTasks } from "../../src/internal/core/config/config-loading";
import { TrestleError } from "../../src/internal/core/errors";
import { ERRORS } from "../../src/internal/core/errors-list";
import { getEnvRuntimeArgs } from "../../src/internal/core/params/env-variables";
import { TRESTLE_PARAM_DEFINITIONS } from "../../src/internal/core/params/trestle-params";
import { Environment } from "../../src/internal/core/runtime-env";
import { resetTrestleContext } from "../../src/internal/reset";
import { NetworkConfig, PromiseAny, TrestleNetworkConfig, TrestleRuntimeEnvironment } from "../../src/types";

declare module "mocha" {
  interface Context {
    env: TrestleRuntimeEnvironment
  }
}

let ctx: TrestleContext;

export const defaultNetCfg: TrestleNetworkConfig = {
  accounts: [],
  endpoint: "http://localhost:1337/"
};

export function useEnvironment (
  beforeEachFn?: (trestleRuntimeEnv: TrestleRuntimeEnvironment) => PromiseAny
): void {
  beforeEach("Load environment", async function () {
    this.env = await getEnv(defaultNetCfg);
    if (beforeEachFn) {
      return await beforeEachFn(this.env);
    }
  });

  afterEach("reset builder context", function () {
    resetTrestleContext();
  });
}

export async function getEnv (
  defaultNetworkCfg?: NetworkConfig
): Promise<TrestleRuntimeEnvironment> {
  if (TrestleContext.isCreated()) {
    ctx = TrestleContext.getTrestleContext();

    // The most probable reason for this to happen is that this file was imported
    // from the config file
    if (ctx.environment === undefined) {
      throw new TrestleError(ERRORS.GENERAL.LIB_IMPORTED_FROM_THE_CONFIG);
    }

    return ctx.environment;
  }

  ctx = TrestleContext.createTrestleContext();
  const runtimeArgs = getEnvRuntimeArgs(
    TRESTLE_PARAM_DEFINITIONS,
    process.env
  );

  if (runtimeArgs.verbose) {
    debug.enable("trestle*");
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

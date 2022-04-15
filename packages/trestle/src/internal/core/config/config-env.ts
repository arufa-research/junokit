import {
  ActionType,
  ConfigExtender,
  ConfigurableTaskDefinition,
  EnvironmentExtender,
  TaskArguments
} from "../../../types";
import { TrestleContext } from "../../context";
import * as argumentTypes from "../params/argument-types";
import { usePlugin as usePluginImplementation } from "../plugins";

export function task<ArgsT extends TaskArguments> (
  name: string,
  description?: string,
  action?: ActionType<ArgsT>
): ConfigurableTaskDefinition;

export function task<ArgsT extends TaskArguments> (
  name: string,
  action: ActionType<ArgsT>
): ConfigurableTaskDefinition;

export function task<ArgsT extends TaskArguments> (
  name: string,
  descriptionOrAction?: string | ActionType<ArgsT>,
  action?: ActionType<ArgsT>
): ConfigurableTaskDefinition {
  const ctx = TrestleContext.getTrestleContext();
  const dsl = ctx.tasksDSL;

  if (descriptionOrAction === undefined) {
    return dsl.task(name);
  }

  if (typeof descriptionOrAction !== "string") {
    return dsl.task(name, descriptionOrAction);
  }

  return dsl.task(name, descriptionOrAction, action);
}

export function internalTask<ArgsT extends TaskArguments> (
  name: string,
  description?: string,
  action?: ActionType<ArgsT>
): ConfigurableTaskDefinition;

export function internalTask<ArgsT extends TaskArguments> (
  name: string,
  action: ActionType<ArgsT>
): ConfigurableTaskDefinition;

export function internalTask<ArgsT extends TaskArguments> (
  name: string,
  descriptionOrAction?: string | ActionType<ArgsT>,
  action?: ActionType<ArgsT>
): ConfigurableTaskDefinition {
  const ctx = TrestleContext.getTrestleContext();
  const dsl = ctx.tasksDSL;

  if (descriptionOrAction === undefined) {
    return dsl.internalTask(name);
  }

  if (typeof descriptionOrAction !== "string") {
    return dsl.internalTask(name, descriptionOrAction);
  }

  return dsl.internalTask(name, descriptionOrAction, action);
}

export const types = argumentTypes;

/**
 * Register an environment extender what will be run after the
 * trestle Runtime Environment is initialized.
 *
 * @param extender A function that receives the trestle Runtime
 * Environment.
 */
export function extendEnvironment (extender: EnvironmentExtender): void {
  const ctx = TrestleContext.getTrestleContext();
  const extenderManager = ctx.extendersManager;
  extenderManager.add(extender);
}

export function extendConfig (extender: ConfigExtender): void {
  const ctx = TrestleContext.getTrestleContext();
  ctx.configExtenders.push(extender);
}

/**
 * Loads a trestle plugin
 * @param pluginName The plugin name.
 */
export function usePlugin (pluginName: string): void {
  const ctx = TrestleContext.getTrestleContext();
  usePluginImplementation(ctx, pluginName);
}

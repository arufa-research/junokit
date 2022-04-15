import { ConfigExtender, TrestleRuntimeEnvironment } from '../types';
import { ExtenderManager } from './core/config/extenders';
import { TrestleError } from './core/errors';
import { ERRORS } from './core/errors-list';
import { TasksDSL } from './core/tasks/dsl';

export type GlobalWithTrestleContext = NodeJS.Global & {
  // eslint-disable-next-line no-use-before-define
  __trestleContext: TrestleContext
};

export class TrestleContext {
  public static isCreated (): boolean {
    const globalWithTrestleContext = global as unknown as GlobalWithTrestleContext;
    return globalWithTrestleContext.__trestleContext !== undefined;
  }

  public static createTrestleContext (): TrestleContext {
    if (this.isCreated()) {
      throw new TrestleError(ERRORS.GENERAL.CONTEXT_ALREADY_CREATED);
    }

    const globalWithTrestleContext = global as unknown as GlobalWithTrestleContext;
    const ctx = new TrestleContext();
    globalWithTrestleContext.__trestleContext = ctx;
    return ctx;
  }

  public static getTrestleContext (): TrestleContext {
    const globalWithTrestleContext = global as unknown as GlobalWithTrestleContext;
    const ctx = globalWithTrestleContext.__trestleContext;

    if (ctx === undefined) {
      throw new TrestleError(ERRORS.GENERAL.CONTEXT_NOT_CREATED);
    }

    return ctx;
  }

  public static deleteTrestleContext (): void {
    // eslint-disable-next-line
    const globalAsAny = global as any;

    globalAsAny.__trestleContext = undefined;
  }

  public readonly tasksDSL = new TasksDSL();
  public readonly extendersManager = new ExtenderManager();
  public readonly loadedPlugins: string[] = [];
  public environment?: TrestleRuntimeEnvironment;
  public readonly configExtenders: ConfigExtender[] = [];

  public setRuntimeEnv (env: TrestleRuntimeEnvironment): void {
    if (this.environment !== undefined) {
      throw new TrestleError(ERRORS.GENERAL.CONTEXT_PRE_ALREADY_DEFINED);
    }
    this.environment = env;
  }

  public getRuntimeEnv (): TrestleRuntimeEnvironment {
    if (this.environment === undefined) {
      throw new TrestleError(ERRORS.GENERAL.CONTEXT_PRE_NOT_DEFINED);
    }
    return this.environment;
  }

  public setPluginAsLoaded (pluginName: string): void {
    this.loadedPlugins.push(pluginName);
  }
}

import { ConfigExtender, JunokitRuntimeEnvironment } from '../types';
import { ExtenderManager } from './core/config/extenders';
import { JunokitError } from './core/errors';
import { ERRORS } from './core/errors-list';
import { TasksDSL } from './core/tasks/dsl';

export type GlobalWithJunokitContext = NodeJS.Global & {
  // eslint-disable-next-line no-use-before-define
  __junokitContext: JunokitContext
};

export class JunokitContext {
  public static isCreated (): boolean {
    const globalWithJunokitContext = global as unknown as GlobalWithJunokitContext;
    return globalWithJunokitContext.__junokitContext !== undefined;
  }

  public static createJunokitContext (): JunokitContext {
    if (this.isCreated()) {
      throw new JunokitError(ERRORS.GENERAL.CONTEXT_ALREADY_CREATED);
    }

    const globalWithJunokitContext = global as unknown as GlobalWithJunokitContext;
    const ctx = new JunokitContext();
    globalWithJunokitContext.__junokitContext = ctx;
    return ctx;
  }

  public static getJunokitContext (): JunokitContext {
    const globalWithJunokitContext = global as unknown as GlobalWithJunokitContext;
    const ctx = globalWithJunokitContext.__junokitContext;

    if (ctx === undefined) {
      throw new JunokitError(ERRORS.GENERAL.CONTEXT_NOT_CREATED);
    }

    return ctx;
  }

  public static deleteJunokitContext (): void {
    // eslint-disable-next-line
    const globalAsAny = global as any;

    globalAsAny.__junokitContext = undefined;
  }

  public readonly tasksDSL = new TasksDSL();
  public readonly extendersManager = new ExtenderManager();
  public readonly loadedPlugins: string[] = [];
  public environment?: JunokitRuntimeEnvironment;
  public readonly configExtenders: ConfigExtender[] = [];

  public setRuntimeEnv (env: JunokitRuntimeEnvironment): void {
    if (this.environment !== undefined) {
      throw new JunokitError(ERRORS.GENERAL.CONTEXT_PRE_ALREADY_DEFINED);
    }
    this.environment = env;
  }

  public getRuntimeEnv (): JunokitRuntimeEnvironment {
    if (this.environment === undefined) {
      throw new JunokitError(ERRORS.GENERAL.CONTEXT_PRE_NOT_DEFINED);
    }
    return this.environment;
  }

  public setPluginAsLoaded (pluginName: string): void {
    this.loadedPlugins.push(pluginName);
  }
}

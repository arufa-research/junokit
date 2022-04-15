import { getClosestCallerPackage } from '../util/caller-package';
import { replaceAll } from '../util/strings';
import { ErrorDescriptor, ERRORS, getErrorCode } from './errors-list';

export class TrestleError extends Error {
  public static isTrestleError (other: any): other is TrestleError { // eslint-disable-line  
    return (
      other !== undefined && other !== null && other._isTrestleError === true
    );
  }

  public static isTrestleErrorType (
    other: any, // eslint-disable-line  
    descriptor: ErrorDescriptor
  ): other is TrestleError {
    return (
      TrestleError.isTrestleError(other) &&
      other.errorDescriptor.number === descriptor.number
    );
  }

  public readonly errorDescriptor: ErrorDescriptor;
  public readonly number: number;
  public readonly messageArguments: Record<string, any>; // eslint-disable-line  @typescript-eslint/no-explicit-any
  public readonly parent?: Error;

  private readonly _isTrestleError: boolean;

  constructor (
    errorDescriptor: ErrorDescriptor,
    messageArguments: Record<string, any> = {}, // eslint-disable-line  @typescript-eslint/no-explicit-any
    parentError?: Error
  ) {
    const prefix = `${getErrorCode(errorDescriptor)}: `;

    const formattedMessage = applyErrorMessageTemplate(
      errorDescriptor.message,
      messageArguments
    );

    super(prefix + formattedMessage);

    this.errorDescriptor = errorDescriptor;
    this.number = errorDescriptor.number;
    this.messageArguments = messageArguments;

    if (parentError instanceof Error) {
      this.parent = parentError;
    }

    this._isTrestleError = true;
    Object.setPrototypeOf(this, TrestleError.prototype);
  }
}

/**
 * This class is used to throw errors from trestle plugins made by third parties.
 */
export class TrestlePluginError extends Error {
  public static isTrestlePluginError (other: any): other is TrestlePluginError { // eslint-disable-line  
    return (
      other !== undefined &&
      other !== null &&
      other._isTrestlePluginError === true
    );
  }

  public readonly parent?: Error;
  public readonly pluginName: string;

  private readonly _isTrestlePluginError: boolean;

  /**
   * Creates a TrestlePluginError.
   *
   * @param pluginName The name of the plugin.
   * @param message An error message that will be shown to the user.
   * @param parent The error that causes this error to be thrown.
   */
  public constructor (pluginName: string, message: string, parent?: Error);

  /**
   * A DEPRECATED constructor that automatically obtains the caller package and
   * use it as plugin name.
   *
   * @deprecated Use the above constructor.
   *
   * @param message An error message that will be shown to the user.
   * @param parent The error that causes this error to be thrown.
   */
  public constructor (message: string, parent?: Error);

  public constructor (
    pluginNameOrMessage: string,
    messageOrParent?: string | Error,
    parent?: Error
  ) {
    if (typeof messageOrParent === 'string') {
      super(messageOrParent);
      this.pluginName = pluginNameOrMessage;
      this.parent = parent;
    } else {
      super(pluginNameOrMessage);
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this.pluginName = getClosestCallerPackage()!;
      this.parent = messageOrParent;
    }

    this._isTrestlePluginError = true;
    Object.setPrototypeOf(this, TrestlePluginError.prototype);
  }
}

/**
 * This function applies error messages templates like this:
 *
 *  - Template is a string which contains a variable tags. A variable tag is a
 *    a variable name surrounded by %. Eg: %plugin1%
 *  - A variable name is a string of alphanumeric ascii characters.
 *  - Every variable tag is replaced by its value.
 *  - %% is replaced by %.
 *  - Values can't contain variable tags.
 *  - If a variable is not present in the template, but present in the values
 *    object, an error is thrown.
 *
 * @param template The template string.
 * @param values A map of variable names to their values.
 */
export function applyErrorMessageTemplate (
  template: string,
  // eslint-disable-next-line
  values: { [templateVar: string]: any }
): string {
  return _applyErrorMessageTemplate(template, values);
}

/* eslint-disable sonarjs/cognitive-complexity */
function _applyErrorMessageTemplate (
  template: string,
  // eslint-disable-next-line
  values: { [templateVar: string]: any }
): string {
  if (template.includes('%%')) {
    return template
      .split('%%')
      .map((part) => _applyErrorMessageTemplate(part, values))
      .join('%');
  }

  for (const variableName of Object.keys(values)) {
    let value: string;

    if (values[variableName] === undefined) {
      value = 'undefined';
    } else if (values[variableName] === null) {
      value = 'null';
    } else {
      value = values[variableName].toString();
    }

    if (value === undefined) {
      value = 'undefined';
    }

    const variableTag = `%${variableName}%`;
    template = replaceAll(template, variableTag, value);
  }

  return template;
}

export function assertTrestleInvariant (
  invariant: boolean,
  message: string
): asserts invariant {
  if (!invariant) {
    throw new TrestleError(ERRORS.GENERAL.ASSERTION_ERROR, { message });
  }
}

import { assert, AssertionError } from "chai";

import { TrestleError } from "../../src/internal/core/errors";
import { ErrorDescriptor } from "../../src/internal/core/errors-list";

export async function expectErrorAsync (
  f: () => Promise<any>,
  matchMessage?: string | RegExp
): Promise<void> {
  const noError = new AssertionError("Async error was expected but no error was thrown");
  const message = `Async error should have had message "${String(matchMessage)}" but got "`;
  const notExactMatch = new AssertionError(message);
  const notRegexpMatch = new AssertionError(message);
  try {
    await f();
  } catch (err) {
    if (matchMessage === undefined) {
      return;
    }
    if (typeof matchMessage === "string") {
      if (err.message !== matchMessage) {
        notExactMatch.message += `${String(err.message)}"`;
        throw notExactMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
      }
    } else {
      if (matchMessage.exec(err.message) === null) {
        notRegexpMatch.message += `${String(err.message)}"`;
        throw notRegexpMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
      }
    }
    return;
  }
  throw noError; // eslint-disable-line @typescript-eslint/no-throw-literal
}

export function expectJunokitError (
  f: () => any,
  errorDescriptor: ErrorDescriptor,
  matchMessage?: string | RegExp,
  errorMessage?: string
): void {
  try {
    const returnValue = f();
    if (returnValue instanceof Promise) {
      throw new Error("Please use expectJunokitErrorAsync() when working with async code");
    }
  } catch (error) {
    assert.instanceOf(error, TrestleError, errorMessage);
    assert.equal(error.number, errorDescriptor.number, errorMessage);
    assert.notMatch(
      error.message,
      /%[a-zA-Z][a-zA-Z0-9]*%/,
      "TrestleError has an non-replaced variable tag"
    );

    if (typeof matchMessage === "string") {
      assert.include(error.message, matchMessage, errorMessage);
    } else if (matchMessage !== undefined) {
      assert.match(error.message, matchMessage, errorMessage);
    }

    return;
  }
  throw new AssertionError( // eslint-disable-line @typescript-eslint/no-throw-literal
    `TrestleError number ${errorDescriptor.number} expected, but no Error was thrown`
  );
}

export async function expectJunokitErrorAsync (
  f: () => Promise<any>,
  errorDescriptor: ErrorDescriptor,
  matchMessage?: string | RegExp
): Promise<void> {
  const error = new AssertionError(
    `TrestleError number ${errorDescriptor.number} expected, but no Error was thrown`
  );

  const match = String(matchMessage);
  const notExactMatch = new AssertionError(
    `TrestleError was correct, but should have include "${match}" but got "`
  );

  const notRegexpMatch = new AssertionError(
    `TrestleError was correct, but should have matched regex ${match} but got "`
  );

  try {
    await f();
  } catch (error) {
    assert.instanceOf(error, TrestleError);
    assert.equal(error.number, errorDescriptor.number);
    assert.notMatch(
      error.message,
      /%[a-zA-Z][a-zA-Z0-9]*%/,
      "TrestleError has an non-replaced variable tag"
    );

    if (matchMessage !== undefined) {
      if (typeof matchMessage === "string") {
        if (!error.message.includes(matchMessage)) {
          notExactMatch.message += `${String(error.message)}`;
          throw notExactMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
        }
      } else {
        if (matchMessage.exec(error.message) === null) {
          notRegexpMatch.message += `${String(error.message)}`;
          throw notRegexpMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
        }
      }
    }

    return;
  }

  throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
}

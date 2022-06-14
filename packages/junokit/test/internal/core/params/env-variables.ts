import { assert } from "chai";

import { ERRORS } from "../../../../src/internal/core/errors-list";
import {
  getEnvRuntimeArgs,
  getEnvVariablesMap,
  paramNameToEnvVariable
} from "../../../../src/internal/core/params/env-variables";
import { JUNOKIT_PARAM_DEFINITIONS } from "../../../../src/internal/core/params/junokit-params";
import { expectJunokitError } from "../../../helpers/errors";

describe("paramNameToEnvVariable", () => {
  it("should convert camelCase to UPPER_CASE and prepend JUNOKIT_", () => {
    assert.equal(paramNameToEnvVariable("a"), "JUNOKIT_A");
    assert.equal(paramNameToEnvVariable("B"), "JUNOKIT_B");
    assert.equal(paramNameToEnvVariable("AC"), "JUNOKIT_A_C");
    assert.equal(paramNameToEnvVariable("aC"), "JUNOKIT_A_C");
    assert.equal(
      paramNameToEnvVariable("camelCaseRight"),
      "JUNOKIT_CAMEL_CASE_RIGHT"
    );
    assert.equal(
      paramNameToEnvVariable("somethingAB"),
      "JUNOKIT_SOMETHING_A_B"
    );
  });
});

describe("Env vars arguments parsing", () => {
  it("Should use the default values if arguments are not defined", () => {
    const args = getEnvRuntimeArgs(JUNOKIT_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123"
    });
    assert.equal(args.help, JUNOKIT_PARAM_DEFINITIONS.help.defaultValue);
    assert.equal(args.network, JUNOKIT_PARAM_DEFINITIONS.network.defaultValue);
    assert.equal(
      args.showStackTraces,
      JUNOKIT_PARAM_DEFINITIONS.showStackTraces.defaultValue
    );
    assert.equal(args.version, JUNOKIT_PARAM_DEFINITIONS.version.defaultValue);
  });

  it("Should accept values", () => {
    const args = getEnvRuntimeArgs(JUNOKIT_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123",
      JUNOKIT_NETWORK: "asd",
      JUNOKIT_SHOW_STACK_TRACES: "true",
      JUNOKIT_VERSION: "true",
      JUNOKIT_HELP: "true"
    });

    assert.equal(args.network, "asd");

    // These are not really useful, but we test them anyway
    assert.equal(args.showStackTraces, true);
    assert.equal(args.version, true);
    assert.equal(args.help, true);
  });

  it("should throw if an invalid value is passed", () => {
    expectJunokitError(
      () =>
        getEnvRuntimeArgs(JUNOKIT_PARAM_DEFINITIONS, {
          JUNOKIT_HELP: "123"
        }),
      ERRORS.ARGUMENTS.INVALID_ENV_VAR_VALUE
    );
  });
});

describe("getEnvVariablesMap", () => {
  it("Should return the right map", () => {
    assert.deepEqual(
      getEnvVariablesMap({
        network: "asd",
        help: true,
        showStackTraces: true,
        version: false,
        verbose: true,
        config: undefined // config is optional
      }),
      {
        JUNOKIT_NETWORK: "asd",
        JUNOKIT_HELP: "true",
        JUNOKIT_SHOW_STACK_TRACES: "true",
        JUNOKIT_VERSION: "false",
        JUNOKIT_VERBOSE: "true"
      }
    );
  });
});

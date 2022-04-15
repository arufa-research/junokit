import { assert } from "chai";

import { ERRORS } from "../../../../src/internal/core/errors-list";
import {
  getEnvRuntimeArgs,
  getEnvVariablesMap,
  paramNameToEnvVariable
} from "../../../../src/internal/core/params/env-variables";
import { TRESTLE_PARAM_DEFINITIONS } from "../../../../src/internal/core/params/trestle-params";
import { expectTrestleError } from "../../../helpers/errors";

describe("paramNameToEnvVariable", () => {
  it("should convert camelCase to UPPER_CASE and prepend TRESTLE_", () => {
    assert.equal(paramNameToEnvVariable("a"), "TRESTLE_A");
    assert.equal(paramNameToEnvVariable("B"), "TRESTLE_B");
    assert.equal(paramNameToEnvVariable("AC"), "TRESTLE_A_C");
    assert.equal(paramNameToEnvVariable("aC"), "TRESTLE_A_C");
    assert.equal(
      paramNameToEnvVariable("camelCaseRight"),
      "TRESTLE_CAMEL_CASE_RIGHT"
    );
    assert.equal(
      paramNameToEnvVariable("somethingAB"),
      "TRESTLE_SOMETHING_A_B"
    );
  });
});

describe("Env vars arguments parsing", () => {
  it("Should use the default values if arguments are not defined", () => {
    const args = getEnvRuntimeArgs(TRESTLE_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123"
    });
    assert.equal(args.help, TRESTLE_PARAM_DEFINITIONS.help.defaultValue);
    assert.equal(args.network, TRESTLE_PARAM_DEFINITIONS.network.defaultValue);
    assert.equal(
      args.showStackTraces,
      TRESTLE_PARAM_DEFINITIONS.showStackTraces.defaultValue
    );
    assert.equal(args.version, TRESTLE_PARAM_DEFINITIONS.version.defaultValue);
  });

  it("Should accept values", () => {
    const args = getEnvRuntimeArgs(TRESTLE_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123",
      TRESTLE_NETWORK: "asd",
      TRESTLE_SHOW_STACK_TRACES: "true",
      TRESTLE_VERSION: "true",
      TRESTLE_HELP: "true"
    });

    assert.equal(args.network, "asd");

    // These are not really useful, but we test them anyway
    assert.equal(args.showStackTraces, true);
    assert.equal(args.version, true);
    assert.equal(args.help, true);
  });

  it("should throw if an invalid value is passed", () => {
    expectTrestleError(
      () =>
        getEnvRuntimeArgs(TRESTLE_PARAM_DEFINITIONS, {
          TRESTLE_HELP: "123"
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
        TRESTLE_NETWORK: "asd",
        TRESTLE_HELP: "true",
        TRESTLE_SHOW_STACK_TRACES: "true",
        TRESTLE_VERSION: "false",
        TRESTLE_VERBOSE: "true"
      }
    );
  });
});

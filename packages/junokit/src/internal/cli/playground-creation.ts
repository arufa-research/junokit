/* eslint-disable @typescript-eslint/no-this-alias */
import chalk from "chalk";
import * as fs from 'fs';
import fsExtra from "fs-extra";
import os from "os";
import path from "path";

import { JUNOKIT_NAME } from "../../lib/constants";
import { JunokitError } from "../core/errors";
import { ERRORS } from "../core/errors-list";
import { ExecutionMode, getExecutionMode } from "../core/execution-mode";
import { ARTIFACTS_DIR } from "../core/project-structure";
import { getPackageJson, getPackageRoot } from "../util/packageInfo";
import { initialize } from "./initialize-playground";

const SAMPLE_PROJECT_DEPENDENCIES = [
  "chai"
];
const projectName = "Playground"; // hard code default project name... can be removed later
export async function printWelcomeMessage (): Promise<void> {
  const packageJson = await getPackageJson();

  console.log(
    // chalk.cyan(`★ Welcome to ${JUNOKIT_NAME} v${packageJson.version}`));
    chalk.cyan(`★ Welcome to Junokit Playground v1.0`));
}

export function printSuggestedCommands (projectName: string): void {
  const currDir = process.cwd();
  const projectPath = path.join(currDir, projectName);
  console.log(`Success! Created project at ${chalk.greenBright(projectPath)}.`);
  // TODO: console.log(`Inside that directory, you can run several commands:`);
  // list commands and respective description

  console.log(`Begin by typing:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm start`);
}

function directoryExists (path: string): boolean {
  try {
    return fs.statSync(path).isDirectory();
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false; // directory does not exist
    } else {
      throw error; // other error occurred
    }
  }
}
export async function createPlayground (
  projectName: string, templateName: string
): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
  if (templateName !== undefined) {
    const currDir = process.cwd();
    const artifacts = path.join(currDir, "artifacts");
    // const artifactDir = fse.readdirSync(artifacts);
    console.log(artifacts);
    if (!directoryExists(artifacts)) {
      console.log("no artifacts");
      return;
    }

    console.log("chjk", currDir);

    const projectPath = path.join(currDir, projectName);
    await initialize({
      force: false,
      projectName: projectName,
      templateName: templateName,
      destination: projectPath
    });
    return;
  }
  await printWelcomeMessage();

  console.log("\n★", chalk.cyan("Project created"), "★\n");

  printSuggestedCommands(projectName);
}

export function createConfirmationPrompt (name: string, message: string): any { // eslint-disable-line  @typescript-eslint/no-explicit-any
  return {
    type: "confirm",
    name,
    message,
    initial: "y",
    default: "(Y/n)",
    isTrue (input: string | boolean) {
      if (typeof input === "string") {
        return input.toLowerCase() === "y";
      }

      return input;
    },
    isFalse (input: string | boolean) {
      if (typeof input === "string") {
        return input.toLowerCase() === "n";
      }

      return input;
    },
    format (): string {
      const that = this; // eslint-disable-line @typescript-eslint/no-explicit-any
      const value = that.value === true ? "y" : "n";

      if (that.state.submitted === true) {
        return that.styles.submitted(value);
      }

      return value;
    }
  };
}

function isInstalled (dep: string): boolean {
  const packageJson = fsExtra.readJSONSync("package.json");
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies
  };

  return dep in allDependencies;
}

function isYarnProject (): boolean {
  return fsExtra.pathExistsSync("yarn.lock");
}

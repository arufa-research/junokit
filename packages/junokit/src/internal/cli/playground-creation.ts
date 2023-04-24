/* eslint-disable @typescript-eslint/no-this-alias */
import chalk from "chalk";
import * as fs from 'fs';
import fsExtra from "fs-extra";
// import fs from "fs-extra"
import os from "os";
import path from "path";
import * as ts from "typescript";

import { JUNOKIT_NAME } from "../../lib/constants";
import { JunokitError } from "../core/errors";
import { ERRORS } from "../core/errors-list";
import { ExecutionMode, getExecutionMode } from "../core/execution-mode";
import { ARTIFACTS_DIR } from "../core/project-structure";
import { getPackageJson, getPackageRoot } from "../util/packageInfo";
import { initialize } from "./initialize-playground";
import { TYPESCRIPT_TYPES } from "@babel/types";
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

function readDirectory(path: string): string[] {
  try {
    const filesAndFolders = fs.readdirSync(path);
    return filesAndFolders;
  } catch (err) {
    console.error(err);
    return [];
  }
}


// function createTsxFiles(fileNames: string[], directory:string): void {
//   const template = (fileName: string) => `
//   import React from 'react';

//   export default function ${fileName}() {
//     return (
//       <div>
//         <h1>Welcome to ${fileName}!</h1>
//       </div>
//     );
//   }
//   `;

//   const directoryPath = directory;
//   for (const fileName of fileNames) {
//     const filePath = path.join(directoryPath,fileName+'.js');
//     const fileContent = template(fileName);
//     console.log("\n",filePath);
//     fs.writeFileSync(filePath, fileContent, {
//       flag: 'w',
//     });
//   }
// }
function createArtifactJson(contractDir: string,destinationDir:string): void {
  // const artifactDir = './artifact'; // Specify the directory path here
  const files = fs.readdirSync(contractDir); // Get an array of all files in the directory
  const json = [];
   console.log("\n",files);
  for (const file of files) {
    if (file.endsWith('.wasm')) {
      const name = file.slice(0, -5); // Remove the last 5 characters (".wasm") from the filename
      json.push(name);
    }
  }
  const dest = path.join(destinationDir,'contracts.json');

  fs.writeFileSync(dest, JSON.stringify(json)); // Write the JSON file to disk
}

// import * as ts from "typescript";
// import * as fs from "fs";

interface Property {
  name: string;
  type: string;
  modifiers?: string[];
}

interface Structure {
  kind: string;
  name: string;
  properties?: Property[];
}

function convertTypescriptFileToJson(inputFilePath: string, outputFilePath: string) {
  const sourceFile = ts.createSourceFile(
    inputFilePath,
    fs.readFileSync(inputFilePath).toString(),
    ts.ScriptTarget.Latest
  );

  const structures: Structure[] = [];

  function parseNode(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      const properties: Property[] = node.members
        .filter(ts.isPropertyDeclaration)
        .map((member) => ({
          name: member.name.getText(sourceFile),
          type: member.type?.getText(sourceFile) || "unknown",
          modifiers: member.modifiers?.map((modifier) =>
            modifier.getText(sourceFile)
          ),
        }));
      structures.push({
        kind: "class",
        name: node.name?.getText(sourceFile) || "unknown",
        properties,
      });
    } else if (ts.isInterfaceDeclaration(node)) {
      const properties: Property[] = node.members
        .filter(ts.isPropertySignature)
        .map((member) => ({
          name: member.name.getText(sourceFile),
          type: member.type?.getText(sourceFile) || "unknown",
          modifiers: member.modifiers?.map((modifier) =>
            modifier.getText(sourceFile)
          ),
        }));
      structures.push({
        kind: "interface",
        name: node.name?.getText(sourceFile) || "unknown",
        properties,
      });
    } else if (ts.isTypeAliasDeclaration(node)) {
      structures.push({
        kind: "typeAlias",
        name: node.name?.getText(sourceFile) || "unknown",
        properties: [
          {
            name: "type",
            type: node.type?.getText(sourceFile) || "unknown",
          },
        ],
      });
    }
    ts.forEachChild(node, parseNode);
  }

  parseNode(sourceFile);

  fs.writeFileSync(outputFilePath, JSON.stringify(structures, null, 2));
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

    // console.log("chjk", currDir);

    const projectPath = path.join(currDir, projectName);
    await initialize({
      force: false,
      projectName: projectName,
      templateName: templateName,
      destination: projectPath
    });

    const playground = path.join(currDir,'playground');
    const playgroundP= path.join(playground,'src');
    const playgroundPages= path.join(playgroundP,'pages');
    const contracts = path.join(artifacts,"contracts");
     const files = readDirectory(contracts);
    //  console.log(files);
     //createTsxFiles(files, playgroundPages);
     createArtifactJson(contracts,playgroundP)
    // fs.writeFile("p1.js","hello");
      // console.log("\n",playgroundP);
      const ty_counter = path.join(artifacts,"typescript_schema");
      const count = path.join(ty_counter,"Counter.ts");
      const counter = fs.readFileSync(count,'utf8');
      const jobj = JSON.stringify(counter);
      const dest = path.join(playgroundP,"counterInf.json");
      convertTypescriptFileToJson(count,dest);
      // console.log(jobj);
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

import { createProject } from "../internal/cli/project-creation";
import { task } from "../internal/core/config/config-env";
import { TASK_INIT } from "./task-names";

export default function (): void {
  task(TASK_INIT, "Initializes a new project in the given directory")
    .addPositionalParam<string>("projectName", "Name of project")
    .addFlag("typescript", "Initializes a new typescript project in the given directory")
    .addOptionalPositionalParam<string>(
    "templateName",
    "Name of the template. If no template is specified, a default " +
          "template(counter) will be downloaded."
  )
    .addOptionalPositionalParam<string>(
    "destination",
    "Path to the directory in which you would like to initialize the project files. " +
        "If destination is\n                not provided, this defaults to the current directory.\n"
  )
    .setAction(async ({ projectName, typescript, templateName, destination }:
    { projectName: string, typescript: boolean, templateName: string, destination: string }, _) => {
      await createProject(projectName, typescript, templateName, destination);
    });
}

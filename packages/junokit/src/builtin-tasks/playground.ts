import { createPlayground } from "../internal/cli/playground-creation";
import { task } from "../internal/core/config/config-env";
import { TASK_CREATE_PLAYGROUND } from "./task-names";

export default function (): void {
  const destination = process.cwd();

  task(TASK_CREATE_PLAYGROUND, "Initialize the playground in the project directory")

    .setAction(async ({ projectName = "Playground", templateName = "client" }:
    { projectName: string, templateName: string, destination: string }, _) => {
      await createPlayground(projectName, templateName);
    });
}

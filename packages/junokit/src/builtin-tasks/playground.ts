import { createPlayground } from "../internal/cli/playground-creation";
import { task } from "../internal/core/config/config-env";
import { TASK_CREATE_PLAYGROUND } from "./task-names";

export default function (): void {
  task(TASK_CREATE_PLAYGROUND, "Initialize the playground in the project directory").setAction(
    async (
      {
        projectName = "playground",
        templateName = "playground",
        destination = process.cwd()
      }: { projectName: string, templateName: string, destination: string },
      _
    ) => {
      await createPlayground(projectName, templateName, destination);
    }
  );
}

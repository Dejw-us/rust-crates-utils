import { window } from "vscode";
import { CargoProject } from "../../cargo/cargo";

async function showCargoProjectsQuickPick(
  projects: CargoProject[]
): Promise<CargoProject | undefined> {
  if (projects.length === 0) {
    window.showErrorMessage("Could not find any cargo project");
    return undefined;
  }
  if (projects.length === 1) {
    return projects[0];
  }
  const labels = projects.map((project) => {
    return {
      label: project.name,
      project,
    };
  });
  return window.showQuickPick(labels).then((pick) => pick?.project);
}

export { showCargoProjectsQuickPick };

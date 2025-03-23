import { commands, window } from "vscode";
import { cargoAdd, findCargoProjects } from "../cargo/cargo";
import { getCrate } from "../requests/crate";
import { showCargoProjectsQuickPick } from "../window/quickPicks/showCargoProjectsQuickPick";
import { showCrateQuickPick } from "../window/quickPicks/showCrateQuickPick";
import { showFeaturesQuickPick } from "../window/quickPicks/showFeaturesQuickPick";
import { showVersionQuickPick } from "../window/quickPicks/showVersionQuickPick";

const addCrates = commands.registerCommand(
  "rust-crates-utils.AddCrates",
  async () => {
    const crateName = await showCrateQuickPick();

    if (!crateName) {
      return;
    }

    const crate = await getCrate(crateName);
    const version = await showVersionQuickPick(crate);

    if (!version) {
      return;
    }
    for (const key in Object.keys(crate.versions[0].features)) {
      console.log(`key: ${key} = ${crate.versions[0].features[key]}`);
    }

    const features = await showFeaturesQuickPick(crate.versions[0].features);
    const projects = await findCargoProjects();
    const cargoProject = await showCargoProjectsQuickPick(projects);

    if (!cargoProject) {
      return;
    }

    window.showInformationMessage(
      `Adding crate to ${cargoProject?.name} project`
    );

    cargoAdd(cargoProject, crateName, version, features);
  }
);

export { addCrates };

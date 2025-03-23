import { window } from "vscode";
import { Crate, CrateVersion } from "../../requests/crate";

async function showVersionQuickPick(crate: Crate): Promise<string | undefined> {
  const version = await window
    .showQuickPick([{ label: "default" }, ...crate.versions.map(mapVersions)])
    .then((label) => label?.label)
    .then((label) => {
      if (label === "default") {
        return crate.crate.default_version;
      }
      return label;
    });

  return version;
}

function mapVersions(version: CrateVersion) {
  return { label: version.num };
}

export { showVersionQuickPick };

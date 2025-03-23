import path from "path";
import { Terminal, Uri, window, workspace } from "vscode";

let terminal: Terminal | undefined;

function cargoAdd(
  project: CargoProject,
  crate: string,
  version: string,
  features: string[]
) {
  if (!terminal) {
    terminal = window.createTerminal("Adding crates...");

    const disposable = window.onDidCloseTerminal((closedTerminal) => {
      if (closedTerminal === terminal) {
        terminal = undefined;
        disposable.dispose();
      }
    });
  }

  terminal.show();

  const featuresJoin = features.join(",");

  terminal.sendText(`cd ${project.uri.fsPath.replace("Cargo.toml", "")}`);

  if (features.length === 0) {
    terminal.sendText(`cargo add ${crate}@${version}`);
  } else {
    terminal.sendText(
      `cargo add ${crate}@${version} --features ${featuresJoin}`
    );
  }
}

async function findCargoProjects(): Promise<CargoProject[]> {
  const files = await workspace.findFiles("**/Cargo.toml", "**/target/**");
  return files.map(createCargoProject);
}

function createCargoProject(uri: Uri) {
  const name = path.basename(path.dirname(uri.fsPath));
  return { name, uri };
}

type CargoProject = {
  name: string;
  uri: Uri;
};

export { cargoAdd, CargoProject, findCargoProjects };

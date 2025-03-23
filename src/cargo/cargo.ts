import { window } from "vscode";

function cargoAdd(crate: string, version: string, features: string[]) {
  const featuresJoin = features.join(",");
  const terminal = window.createTerminal("Adding crates...");

  terminal.sendText(`cargo add ${crate}@${version} --features ${featuresJoin}`);
}

export { cargoAdd };

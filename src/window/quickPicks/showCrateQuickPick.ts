import { window } from "vscode";
import { CrateInfo, getCratesSearch, getSummary } from "../../requests/crate";

async function showCrateQuickPick() {
  const summary = await getSummary();
  const mostDownloaded = summary.most_downloaded.map(createLabel);
  const pick = window.createQuickPick();

  pick.placeholder = "Search for crates...";
  pick.items = mostDownloaded;

  pick.onDidChangeValue(async (value) => {
    pick.busy = true;
    const cratesSearch = await getCratesSearch(1, value);
    pick.items = cratesSearch.crates.map(createLabel);
    pick.busy = false;
  });

  return new Promise<string | undefined>((resolve) => {
    pick.onDidAccept(() => {
      resolve(pick.selectedItems[0]?.label);
      pick.hide();
    });

    pick.onDidHide(() => {
      resolve(undefined);
    });

    pick.show();
  });
}

function createLabel(crate: CrateInfo) {
  return { label: crate.name };
}

export { showCrateQuickPick };

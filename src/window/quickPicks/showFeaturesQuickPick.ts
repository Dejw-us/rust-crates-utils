import { window } from "vscode";

async function showFeaturesQuickPick(
  features: Record<string, string[]>
): Promise<string[]> {
  const selectedFeatures: string[] = [];

  while (true) {
    const input = await window.showQuickPick(
      ["finish", ...Object.keys(features)],
      { placeHolder: "Select features (choose 'finish' to confirm)" }
    );

    if (!input) {
      continue;
    }

    if (input === "finish") {
      return selectedFeatures;
    }

    if (!selectedFeatures.includes(input)) {
      selectedFeatures.push(input);
    }
  }
}

export { showFeaturesQuickPick };

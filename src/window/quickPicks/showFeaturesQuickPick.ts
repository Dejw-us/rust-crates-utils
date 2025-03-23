import { window } from "vscode";

async function showFeaturesQuickPick(
  features: Record<string, string[]>
): Promise<string[]> {
  const selectedFeatures: string[] = [];

  while (true) {
    const input = await window.showQuickPick(
      [
        {
          label: "Add crate",
          description: "Select this option to add crate to your cargo project",
        },
        ...Object.keys(features)
          .filter((feature) => !selectedFeatures.includes(feature))
          .map((key) => {
            return {
              label: key,
            };
          }),
      ],
      { placeHolder: "Select features (choose 'Add crate' to confirm)" }
    );

    if (!input || input.label === "Add crate") {
      break;
    }

    if (!selectedFeatures.includes(input.label)) {
      selectedFeatures.push(input.label);
    }
  }

  return selectedFeatures;
}

export { showFeaturesQuickPick };

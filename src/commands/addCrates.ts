import axios from "axios";
import { commands, Uri, window, workspace } from "vscode";

const SUMMARY_URL = "https://crates.io/api/v1/summary";
const SEARCH_URL = "https://crates.io/api/v1/crates";

const addCrates = commands.registerCommand(
  "rust-crates-utils.AddCrates",
  async () => {
    const crateName = await showCrateQuickPick();

    if (!crateName) {
      return;
    }

    const crate = await fetchCrate(crateName);

    console.log(crate.crate.max_version);

    const version = await window.showQuickPick([
      { label: "default" },
      ...crate.versions
        .filter((v) => v.num !== crate.crate.max_version)
        .map(mapVersions),
    ]);

    if (!version) {
      return;
    }

    const terminal = window.createTerminal("Addind crates");

    console.log(version);

    if (version.label === "default") {
      terminal.sendText(`cargo add ${crateName}`);
    } else {
      terminal.sendText(`cargo add ${crateName}@${version.label}`);
    }
  }
);

function mapVersions(version: CrateVersion) {
  return { label: version.num };
}

async function fetchCrate(crate: string): Promise<Crate> {
  const response = await axios.get(`${SEARCH_URL}/${crate}`);
  return response.data;
}

async function showCrateQuickPick() {
  const summary = await fetchSummary();
  const mostDownloaded = summary.most_downloaded.map(createLabel);
  const pick = window.createQuickPick();

  pick.placeholder = "Search for crates...";
  pick.items = mostDownloaded;

  pick.onDidChangeValue(async (value) => {
    pick.busy = true;
    const cratesSearch = await searchCrates(1, value);
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

async function findAllCargoFiles(): Promise<Uri[]> {
  return await workspace.findFiles("**/Cargo.toml");
}

async function searchCrates(
  page: number,
  search: string
): Promise<CrateSearch> {
  const params = {
    page,
    per_page: 10,
    q: search,
  };
  const response = await axios.get(SEARCH_URL, { params });
  return response.data;
}

async function fetchSummary(): Promise<CratesSummary> {
  const response = await axios.get(SUMMARY_URL);
  return response.data;
}

type CratesSummary = {
  num_downloads: number;
  num_crates: number;
  new_crates: CrateInfo[];
  most_downloaded: CrateInfo[];
  most_recently_downloaded: CrateInfo[];
  just_updated: CrateInfo[];
  popular_keywords: Keyword[];
  popular_categories: CrateInfo[];
};

type Crate = {
  crate: CrateData;
  versions: CrateVersion[];
};

type CrateData = {
  max_version: string;
};

type CrateVersion = {
  crate: string;
  num: string;
};

type CrateSearch = {
  crates: CrateInfo[];
};

type Keyword = {
  id: string;
  keyword: string;
  crated_at: string;
  crates_cnt: number;
};

type Category = {
  id: string;
  category: string;
  slug: string;
  description: string;
  created_at: string;
  crates_cnt: string;
};

type CrateInfo = {
  id: string;
  name: string;
  updated_at: string;
  versions: string[] | null;
  keywords: string[] | null;
  categories: string[] | null;
  badges: string[];
  created_at: string;
  downloads: number;
  recent_downloads: number | null;
  default_version: string;
  num_versions: number;
  yanked: boolean;
  max_version: string;
  newest_version: string;
  max_stable_version: string;
  description: string;
  homepage: string | null;
  documentation: string | null;
  repository: string | null;
  links: Record<string, string>;
  exact_match: boolean;
};

export { addCrates };

import axios from "axios";

const SEARCH_URL = "https://crates.io/api/v1/crates";
const SUMMARY_URL = "https://crates.io/api/v1/summary";

async function getCrate(crate: string): Promise<Crate> {
  const response = await axios.get(`${SEARCH_URL}/${crate}`);
  return response.data;
}

async function getCratesSearch(
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

async function getSummary(): Promise<CratesSummary> {
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
  default_version: string;
  max_version: string;
};

type CrateVersion = {
  crate: string;
  num: string;
  features: Record<string, string[]>;
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

export {
  Category,
  Crate,
  CrateData,
  CrateInfo,
  CrateSearch,
  CratesSummary,
  CrateVersion,
  getCrate,
  getCratesSearch,
  getSummary,
  Keyword,
};

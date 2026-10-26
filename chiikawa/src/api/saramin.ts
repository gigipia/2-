// 사람인 MCP 도구와 같은 이름·파라미터로 만든 데이터 레이어예요.
// 브라우저에서는 MCP를 직접 호출할 수 없어서 지금은 실제 응답에서 뽑은 샘플 데이터를 돌려줘요.
// 백엔드 프록시가 생기면 각 함수 안의 mock 부분만 fetch 호출로 바꾸면 돼요.
import {
  COMMUTE,
  COMPANIES,
  JOB_CATEGORIES,
  JOBS,
  LOCATIONS,
  STORE_PRODUCTS,
  SUB_JOB_CATEGORIES,
  SUBWAYS,
} from "./mock";

export type JobCategory = { jobCategoryName: string; jobCategoryCode: string };
export type SubJobCategory = { subJobCategoryName: string; subJobCategoryCode: string };
export type Location = { locationName: string; locationCode: string; details: string };
export type Subway = { subwayName: string; subwayCode: string };

export type CompanyType = "LARGE" | "TOP1000" | "MIDSIZE" | "SMALLSIZE" | "STARTUP" | "FOREIGN";
export type JobSort = "Relation" | "RegDt" | "ClosingDt" | "ReadCnt" | "ApplyCnt";
export type StoreSort = "REVEIWS" | "RATING" | "SALES" | "NEWEST" | "VIEWS";

export type Job = {
  jobId: string;
  title: string;
  company: string;
  logo: string;
  deadline: string;
  career: "신입" | "경력" | "경력 무관";
  location: string;
  badge?: string;
  jobCategoryCode: string;
  subJobCategoryCodes: string[];
  locationCode: string;
  subwayCodes: string[];
  companyType: CompanyType;
  url: string;
};

export type Company = {
  name: string;
  logo: string;
  hiring: boolean;
  url: string;
  jobs: Pick<Job, "jobId" | "title" | "deadline" | "career" | "location" | "url">[];
};

export type StoreProduct = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  url: string;
};

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 250));
const includes = (text: string, word: string) => text.toLowerCase().includes(word.trim().toLowerCase());

// 사람들이 흔히 치는 말을 공고에 실제로 쓰이는 말로 넓혀서 찾아요.
const ALIASES: Record<string, string[]> = {
  개발자: ["개발"],
  디자이너: ["디자인", "design"],
  프론트: ["프론트엔드", "frontend"],
  백엔드: ["백엔드", "서버", "backend"],
  서버: ["백엔드", "서버"],
  웹: ["웹", "web"],
  자바: ["java"],
  리액트: ["react"],
  토스: ["토스", "비바리퍼블리카"],
  자소서: ["자소서", "자기소개서"],
  면접: ["면접", "자기소개"],
};

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, "");

/** 검색어를 띄어쓰기로 나눠서, 모든 단어가 어딘가에 들어 있으면 맞는 것으로 봐요. */
export function matchesKeyword(haystack: string, keyword: string) {
  const text = normalize(haystack);
  return keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => {
      const t = token.toLowerCase();
      return [t, ...(ALIASES[t] ?? [])].some((w) => text.includes(normalize(w)));
    });
}

/** 하이라이트할 실제 단어 목록(별칭 포함) */
export function keywordTerms(keyword: string) {
  return keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((t) => [t, ...(ALIASES[t.toLowerCase()] ?? [])]);
}

const COMPANY_TYPE_LABEL: Record<CompanyType, string> = {
  LARGE: "대기업",
  TOP1000: "1000대기업",
  MIDSIZE: "중견기업",
  SMALLSIZE: "중소기업",
  STARTUP: "스타트업",
  FOREIGN: "외국계",
};

function jobHaystack(j: Job) {
  const category = JOB_CATEGORIES.find((c) => c.jobCategoryCode === j.jobCategoryCode)?.jobCategoryName ?? "";
  const subs = (SUB_JOB_CATEGORIES[j.jobCategoryCode] ?? [])
    .filter((s) => j.subJobCategoryCodes.includes(s.subJobCategoryCode))
    .map((s) => s.subJobCategoryName);
  return [j.title, j.company, j.location, j.career, category, ...subs, COMPANY_TYPE_LABEL[j.companyType]].join(" ");
}

/** fetch_job_categories */
export function fetchJobCategories() {
  return delay({ items: JOB_CATEGORIES });
}

/** fetch_sub_job_categories */
export function fetchSubJobCategories(jobCategoryCode: string) {
  return delay({ items: SUB_JOB_CATEGORIES[jobCategoryCode] ?? [] });
}

/** search_location_codes */
export function searchLocationCodes(location: string) {
  const items = LOCATIONS.filter((l) => includes(l.locationName + l.details, location));
  return delay({ items });
}

/** search_subway_info */
export function searchSubwayInfo(stationName: string, maxTimeMinutes = 0) {
  const name = stationName.trim().replace(/역$/, "");
  if (maxTimeMinutes > 0 && COMMUTE[name]) return delay({ items: COMMUTE[name] });
  return delay({ items: SUBWAYS.filter((s) => includes(s.subwayName, name)) });
}

export type JobSearchRequest = {
  searchWord: string;
  jobCategoryCodes: string[];
  subJobCategoryCodes: string[];
  locationCodes: string[];
  subwayCodes: string[];
  companyType: CompanyType[];
  minCareer: number;
  maxCareer: number;
  minSalary: number;
  sort: JobSort;
  page: number;
  pageCount: number;
};

/** search_saramin_jobs */
export function searchSaraminJobs(req: JobSearchRequest) {
  let items = JOBS.filter((j) => {
    if (req.searchWord && !matchesKeyword(jobHaystack(j), req.searchWord)) return false;
    if (req.jobCategoryCodes.length && !req.jobCategoryCodes.includes(j.jobCategoryCode)) return false;
    if (req.subJobCategoryCodes.length && !req.subJobCategoryCodes.some((c) => j.subJobCategoryCodes.includes(c))) return false;
    if (req.locationCodes.length && !req.locationCodes.includes(j.locationCode)) return false;
    if (req.subwayCodes.length && !req.subwayCodes.some((c) => j.subwayCodes.includes(c))) return false;
    if (req.companyType.length && !req.companyType.includes(j.companyType)) return false;
    // minCareer ≥ 1 이면 경력, maxCareer = 1 이면 신입(1년 이하) 공고만 남겨요.
    if (req.minCareer > 0 && j.career === "신입") return false;
    if (req.maxCareer === 1 && j.career === "경력") return false;
    return true;
  });
  if (req.sort === "ClosingDt") {
    const dday = (d: string) => (d.startsWith("D-") ? Number(d.slice(2)) : 999);
    items = [...items].sort((a, b) => dday(a.deadline) - dday(b.deadline));
  }
  const start = (req.page - 1) * req.pageCount;
  return delay({ total: items.length, items: items.slice(start, start + req.pageCount) });
}

export type RecommendType = "popular_job" | "popular_major" | "popular_school";

/** recommend_saramin_recruit */
export function recommendSaraminRecruit(req: {
  type: RecommendType;
  job: string;
  major: string;
  school: string;
  expCd: "1" | "2" | "3";
  limit: number;
}) {
  const label = req.type === "popular_job" ? req.job : req.type === "popular_major" ? req.major : req.school;
  const items = JOBS.filter((j) => req.expCd === "3" || (req.expCd === "1" ? j.career !== "경력" : j.career !== "신입"))
    .slice(0, req.limit)
    .map((j) => ({ ...j, badge: `${label || "추천"} 인기 공고` }));
  return delay({ items });
}

/** search_company_info */
export function searchCompanyInfo(req: { searchWord: string; sort: "Relation" | "Employee" | "Sales"; page: number; pageCount: number }) {
  const items = COMPANIES.filter((c) => matchesKeyword([c.name, ...c.jobs.map((j) => j.title)].join(" "), req.searchWord));
  return delay({ items: items.slice(0, req.pageCount) });
}

/** search_saramin_store_products */
export function searchSaraminStoreProducts(req: { searchWord: string; sort: StoreSort; pageNum: number; limit: number }) {
  let items = STORE_PRODUCTS.filter((p) => !req.searchWord || matchesKeyword([p.name, ...p.tags].join(" "), req.searchWord));
  if (req.sort === "RATING") items = [...items].sort((a, b) => b.rating - a.rating);
  if (req.sort === "REVEIWS") items = [...items].sort((a, b) => b.reviews - a.reviews);
  return delay({ items: items.slice(0, req.limit) });
}

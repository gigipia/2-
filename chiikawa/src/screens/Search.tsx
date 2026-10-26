import { useEffect, useState } from "react";
import {
  searchCompanyInfo,
  searchSaraminJobs,
  searchSaraminStoreProducts,
  type Company,
  type Job,
  type StoreProduct,
} from "../api/saramin";
import { Chip, Empty, Highlight, JobCard, Loading, SearchBar } from "../components";
import type { JobPreset } from "../App";

const POPULAR = ["프론트엔드", "백엔드 개발자", "React", "신입 웹개발", "토스", "디자이너", "면접 코칭"];
const RECENT_KEY = "recent-searches";

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // 저장소를 못 쓰는 환경이면 최근 검색어만 기억하지 않아요.
  }
}

type Results = { jobs: { total: number; items: Job[] }; companies: Company[]; products: StoreProduct[] };

export default function Search({
  initial,
  onClose,
  onShowJobs,
  onShowCompanies,
  onShowStore,
}: {
  initial: string;
  onClose: () => void;
  onShowJobs: (preset: JobPreset) => void;
  onShowCompanies: (keyword: string) => void;
  onShowStore: (keyword: string) => void;
}) {
  const [word, setWord] = useState(initial);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const keyword = word.trim();

  // 입력을 멈추고 0.3초 뒤에 공고·기업·스토어를 한 번에 조회해요.
  useEffect(() => {
    if (!keyword) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      Promise.all([
        searchSaraminJobs({
          searchWord: keyword,
          jobCategoryCodes: [],
          subJobCategoryCodes: [],
          locationCodes: [],
          subwayCodes: [],
          companyType: [],
          minCareer: 0,
          maxCareer: 0,
          minSalary: 0,
          sort: "Relation",
          page: 1,
          pageCount: 3,
        }),
        searchCompanyInfo({ searchWord: keyword, sort: "Relation", page: 1, pageCount: 3 }),
        searchSaraminStoreProducts({ searchWord: keyword, sort: "REVEIWS", pageNum: 1, limit: 3 }),
      ]).then(([jobs, companies, products]) => {
        if (cancelled) return;
        setResults({ jobs, companies: companies.items, products: products.items });
        setLoading(false);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword]);

  function remember(k: string) {
    const next = [k, ...recent.filter((r) => r !== k)].slice(0, 8);
    setRecent(next);
    saveRecent(next);
  }

  function showAllJobs() {
    if (!keyword) return;
    remember(keyword);
    onShowJobs({ searchWord: keyword });
  }

  const nothing = results && results.jobs.total === 0 && results.companies.length === 0 && results.products.length === 0;

  return (
    <div className="search-screen">
      <div className="search-top">
        <button type="button" className="icon-btn back-btn" aria-label="뒤로" onClick={onClose}>
          ‹
        </button>
        <SearchBar value={word} placeholder="직무, 기술, 회사, 지역으로 검색" onChange={setWord} onSubmit={showAllJobs} autoFocus />
      </div>

      {!keyword ? (
        <div className="screen search-body">
          {recent.length > 0 && (
            <section className="search-section">
              <div className="search-section-head">
                <h2>최근 검색어</h2>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setRecent([]);
                    saveRecent([]);
                  }}
                >
                  전체 삭제
                </button>
              </div>
              <div className="chip-wrap">
                {recent.map((r) => (
                  <Chip key={r} onClick={() => setWord(r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </section>
          )}
          <section className="search-section">
            <div className="search-section-head">
              <h2>많이 찾는 검색어</h2>
            </div>
            <ol className="popular">
              {POPULAR.map((p, i) => (
                <li key={p}>
                  <button type="button" onClick={() => setWord(p)}>
                    <span className="popular-rank">{i + 1}</span>
                    {p}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : loading || !results ? (
        <Loading />
      ) : nothing ? (
        <div className="screen search-body">
          <Empty>
            ‘{keyword}’에 맞는 결과가 없어요.
            <br />
            띄어쓰기를 바꾸거나 더 짧은 단어로 검색해 보세요.
          </Empty>
        </div>
      ) : (
        <div className="screen search-body">
          {results.jobs.total > 0 && (
            <section className="search-section">
              <div className="search-section-head">
                <h2>
                  채용공고 <span className="accent">{results.jobs.total}</span>
                </h2>
              </div>
              <div className="list">
                {results.jobs.items.map((j) => (
                  <JobCard key={j.jobId} job={j} keyword={keyword} />
                ))}
              </div>
            </section>
          )}

          {results.companies.length > 0 && (
            <section className="search-section">
              <div className="search-section-head">
                <h2>기업</h2>
              </div>
              <div className="rows rows-plain">
                {results.companies.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className="row"
                    onClick={() => {
                      remember(keyword);
                      onShowCompanies(c.name);
                    }}
                  >
                    <span className="company-logo company-logo-sm">
                      <img src={c.logo} alt="" />
                    </span>
                    <span className="row-main">
                      <span className="row-title">
                        <Highlight text={c.name} keyword={keyword} />
                      </span>
                    </span>
                    <span className="row-value">채용 {c.jobs.length}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {results.products.length > 0 && (
            <section className="search-section">
              <div className="search-section-head">
                <h2>취업 준비 상품</h2>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    remember(keyword);
                    onShowStore(keyword);
                  }}
                >
                  더보기 ›
                </button>
              </div>
              <div className="rows rows-plain">
                {results.products.map((p) => (
                  <a key={p.id} className="row" href={p.url} target="_blank" rel="noopener noreferrer">
                    <span className="row-main">
                      <span className="row-title">
                        <Highlight text={p.name} keyword={keyword} />
                      </span>
                    </span>
                    <span className="row-value row-value-muted">★ {p.rating.toFixed(1)}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {keyword && results && results.jobs.total > 0 && (
        <div className="cta-fixed">
          <button type="button" className="btn btn-primary btn-block" onClick={showAllJobs}>
            ‘{keyword}’ 공고 {results.jobs.total}건 모두 보기
          </button>
        </div>
      )}
    </div>
  );
}

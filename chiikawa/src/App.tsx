import { useState } from "react";
import type { JobCategory, SubJobCategory } from "./api/saramin";
import Companies from "./screens/Companies";
import Home from "./screens/Home";
import Jobs from "./screens/Jobs";
import Search from "./screens/Search";
import Store from "./screens/Store";
import "./App.css";

export type JobPreset = {
  searchWord?: string;
  jobCategory?: JobCategory;
  subJobCategory?: SubJobCategory;
};

type Tab = "home" | "jobs" | "companies" | "store";

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "home", label: "홈", icon: "🏠" },
  { value: "jobs", label: "공고", icon: "📋" },
  { value: "companies", label: "기업", icon: "🏢" },
  { value: "store", label: "스토어", icon: "🛍️" },
];

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [preset, setPreset] = useState<JobPreset>({});
  const [companyWord, setCompanyWord] = useState<string>();
  const [storeWord, setStoreWord] = useState<string>();
  // 다른 화면에서 검색 조건을 넘길 때마다 대상 화면을 새 조건으로 다시 그려요.
  const [screenKey, setScreenKey] = useState(0);
  // null 이면 검색 화면이 닫혀 있어요.
  const [searchWord, setSearchWord] = useState<string | null>(null);

  function go(next: Tab) {
    setSearchWord(null);
    setScreenKey((k) => k + 1);
    setTab(next);
    window.scrollTo(0, 0);
  }

  function openJobs(next: JobPreset) {
    setPreset(next);
    go("jobs");
  }

  if (searchWord !== null) {
    return (
      <main className="app">
        <Search
          initial={searchWord}
          onClose={() => setSearchWord(null)}
          onShowJobs={openJobs}
          onShowCompanies={(k) => {
            setCompanyWord(k);
            go("companies");
          }}
          onShowStore={(k) => {
            setStoreWord(k);
            go("store");
          }}
        />
      </main>
    );
  }

  return (
    <main className="app" data-testid="apps-in-toss-starter">
      {tab === "home" && <Home onSearch={openJobs} onOpenSearch={() => setSearchWord("")} />}
      {tab === "jobs" && <Jobs key={screenKey} preset={preset} />}
      {tab === "companies" && <Companies key={screenKey} initial={companyWord} />}
      {tab === "store" && <Store key={screenKey} initial={storeWord} />}

      <nav className="tab-bar" aria-label="하단 메뉴">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`tab${tab === t.value ? " tab-active" : ""}`}
            aria-current={tab === t.value ? "page" : undefined}
            onClick={() => {
              if (t.value === "jobs") setPreset({});
              if (t.value === "companies") setCompanyWord(undefined);
              if (t.value === "store") setStoreWord(undefined);
              go(t.value);
            }}
          >
            <span className="tab-icon" aria-hidden="true">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
    </main>
  );
}

export default App;

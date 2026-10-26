import { useEffect, useState } from "react";
import {
  fetchJobCategories,
  fetchSubJobCategories,
  recommendSaraminRecruit,
  type Job,
  type JobCategory,
  type RecommendType,
  type SubJobCategory,
} from "../api/saramin";
import { CATEGORY_EMOJI } from "../api/mock";
import { Chip, Empty, JobCard, Loading, SectionTitle, Segmented, Sheet } from "../components";
import type { JobPreset } from "../App";

const RECOMMEND_TYPES: { value: RecommendType; label: string; placeholder: string; example: string }[] = [
  { value: "popular_job", label: "직무", placeholder: "예: 웹개발, 간호사", example: "웹개발" },
  { value: "popular_major", label: "전공", placeholder: "예: 경영학과, 컴퓨터공학과", example: "컴퓨터공학과" },
  { value: "popular_school", label: "학교", placeholder: "예: 건국대학교", example: "건국대학교" },
];

export default function Home({ onSearch, onOpenSearch }: { onSearch: (preset: JobPreset) => void; onOpenSearch: () => void }) {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [picked, setPicked] = useState<JobCategory | null>(null);
  const [subs, setSubs] = useState<SubJobCategory[] | null>(null);

  const [recType, setRecType] = useState<RecommendType>("popular_job");
  const [recWord, setRecWord] = useState("웹개발");
  const [expCd, setExpCd] = useState<"1" | "2" | "3">("1");
  const [recJobs, setRecJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    fetchJobCategories().then((r) => setCategories(r.items));
  }, []);

  useEffect(() => {
    loadRecommend();
    // 첫 진입 시 기본 추천을 한 번 보여줘요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expCd, recType]);

  function loadRecommend() {
    setRecJobs(null);
    recommendSaraminRecruit({
      type: recType,
      job: recType === "popular_job" ? recWord : "",
      major: recType === "popular_major" ? recWord : "",
      school: recType === "popular_school" ? recWord : "",
      expCd,
      limit: 4,
    }).then((r) => setRecJobs(r.items));
  }

  function openCategory(c: JobCategory) {
    setPicked(c);
    setSubs(null);
    fetchSubJobCategories(c.jobCategoryCode).then((r) => setSubs(r.items));
  }

  const recMeta = RECOMMEND_TYPES.find((t) => t.value === recType)!;

  return (
    <div className="screen">
      <header className="hero">
        <p className="hero-eyebrow">치이카와 잡</p>
        <h1>
          오늘은 어떤 일을
          <br />
          찾아볼까요?
        </h1>
        <p className="hero-sub">사람인 공고를 한 화면에서 찾고, 비교하고, 지원해요.</p>
      </header>

      <button type="button" className="search-bar search-trigger" onClick={onOpenSearch}>
        <span aria-hidden="true">🔍</span>
        직무, 기술, 회사, 지역으로 검색
      </button>

      <section className="card">
        <SectionTitle title="나에게 맞는 인기 공고" sub="직무·전공·학교별로 많이 보는 공고를 추천해요" />
        <Segmented
          value={recType}
          options={RECOMMEND_TYPES.map(({ value, label }) => ({ value, label }))}
          onChange={(v) => {
            setRecType(v);
            setRecWord(RECOMMEND_TYPES.find((t) => t.value === v)!.example);
          }}
        />
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            loadRecommend();
          }}
        >
          <input className="input" value={recWord} placeholder={recMeta.placeholder} onChange={(e) => setRecWord(e.target.value)} />
          <button className="btn btn-primary btn-sm" type="submit">
            추천받기
          </button>
        </form>
        <div className="chip-row">
          {(
            [
              ["1", "신입"],
              ["2", "경력"],
              ["3", "전체"],
            ] as const
          ).map(([v, label]) => (
            <Chip key={v} active={expCd === v} onClick={() => setExpCd(v)}>
              {label}
            </Chip>
          ))}
        </div>
        <div className="list">
          {recJobs === null ? <Loading /> : recJobs.length === 0 ? <Empty>추천할 공고가 없어요.</Empty> : recJobs.map((j) => <JobCard key={j.jobId} job={j} />)}
        </div>
      </section>

      <section className="card">
        <SectionTitle title="직무별로 둘러보기" sub="직무를 누르면 세부 직무를 고를 수 있어요" />
        <div className="category-grid">
          {categories.map((c) => (
            <button key={c.jobCategoryCode} type="button" className="category" onClick={() => openCategory(c)}>
              <span className="category-emoji">{CATEGORY_EMOJI[c.jobCategoryCode] ?? "💼"}</span>
              <span>{c.jobCategoryName}</span>
            </button>
          ))}
        </div>
      </section>

      {picked && (
        <Sheet
          title={picked.jobCategoryName}
          onClose={() => setPicked(null)}
          footer={
            <button type="button" className="btn btn-primary btn-block" onClick={() => onSearch({ jobCategory: picked })}>
              {picked.jobCategoryName} 전체 공고 보기
            </button>
          }
        >
          <p className="sheet-desc">세부 직무를 고르면 해당 공고만 모아 보여드려요.</p>
          {subs === null ? (
            <Loading />
          ) : subs.length === 0 ? (
            <Empty>세부 직무 정보가 아직 없어요.</Empty>
          ) : (
            <div className="chip-wrap">
              {subs.map((s) => (
                <Chip key={s.subJobCategoryCode} onClick={() => onSearch({ jobCategory: picked, subJobCategory: s })}>
                  {s.subJobCategoryName}
                </Chip>
              ))}
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}

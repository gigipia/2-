import { useEffect, useState } from "react";
import {
  fetchJobCategories,
  fetchSubJobCategories,
  searchLocationCodes,
  searchSaraminJobs,
  searchSubwayInfo,
  type CompanyType,
  type Job,
  type JobCategory,
  type JobSort,
  type Location,
  type SubJobCategory,
  type Subway,
} from "../api/saramin";
import { Chip, Empty, JobCard, Loading, SearchBar, Segmented, Sheet, StatCard } from "../components";
import type { JobPreset } from "../App";

type Career = "all" | "new" | "exp";
type SheetKind = "job" | "location" | "subway" | "company" | null;

const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
  { value: "LARGE", label: "대기업" },
  { value: "TOP1000", label: "1000대 기업" },
  { value: "MIDSIZE", label: "중견기업" },
  { value: "SMALLSIZE", label: "중소기업" },
  { value: "STARTUP", label: "스타트업" },
  { value: "FOREIGN", label: "외국계" },
];

const SORTS: { value: JobSort; label: string }[] = [
  { value: "Relation", label: "관련도순" },
  { value: "RegDt", label: "최신순" },
  { value: "ClosingDt", label: "마감임박순" },
  { value: "ReadCnt", label: "조회순" },
  { value: "ApplyCnt", label: "지원자순" },
];

const COMMUTE_MINUTES = [0, 20, 30, 45];

export default function Jobs({ preset }: { preset: JobPreset }) {
  const [searchWord, setSearchWord] = useState(preset.searchWord ?? "");
  const [category, setCategory] = useState<JobCategory | null>(preset.jobCategory ?? null);
  const [sub, setSub] = useState<SubJobCategory | null>(preset.subJobCategory ?? null);
  const [location, setLocation] = useState<Location | null>(null);
  const [subway, setSubway] = useState<{ label: string; codes: string[] } | null>(null);
  const [career, setCareer] = useState<Career>("all");
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [sort, setSort] = useState<JobSort>("Relation");
  const [sheet, setSheet] = useState<SheetKind>(null);

  const [result, setResult] = useState<{ total: number; items: Job[] } | null>(null);
  const [page, setPage] = useState(1);

  function search(nextPage = 1) {
    if (nextPage === 1) setResult(null);
    searchSaraminJobs({
      searchWord,
      jobCategoryCodes: category && !sub ? [category.jobCategoryCode] : [],
      subJobCategoryCodes: sub ? [sub.subJobCategoryCode] : [],
      locationCodes: location ? [location.locationCode] : [],
      subwayCodes: subway?.codes ?? [],
      companyType: companyTypes,
      minCareer: career === "exp" ? 1 : 0,
      maxCareer: career === "new" ? 1 : 0,
      minSalary: 0,
      sort,
      page: nextPage,
      pageCount: 5,
    }).then((r) => {
      setPage(nextPage);
      setResult((prev) => (nextPage === 1 || !prev ? r : { total: r.total, items: [...prev.items, ...r.items] }));
    });
  }

  useEffect(() => {
    // 검색어를 치거나 필터를 바꾸면 0.3초 뒤에 다시 조회해요.
    const timer = setTimeout(() => search(1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord, category, sub, location, subway, career, companyTypes, sort]);

  const jobLabel = sub ? sub.subJobCategoryName : category ? category.jobCategoryName : "직무";
  const companyLabel = companyTypes.length ? COMPANY_TYPES.filter((c) => companyTypes.includes(c.value)).map((c) => c.label).join(", ") : "기업형태";

  return (
    <div className="screen">
      <h1 className="screen-title">채용공고</h1>
      <SearchBar value={searchWord} placeholder="예: 백엔드 개발자, React, 토스" onChange={setSearchWord} onSubmit={() => search(1)} />

      <div className="filter-row">
        <Chip active={!!category} onClick={() => setSheet("job")}>{jobLabel} ▾</Chip>
        <Chip active={!!location} onClick={() => setSheet("location")}>{location ? location.locationName.replace("_", " ") : "지역"} ▾</Chip>
        <Chip active={!!subway} onClick={() => setSheet("subway")}>{subway ? subway.label : "지하철역"} ▾</Chip>
        <Chip active={companyTypes.length > 0} onClick={() => setSheet("company")}>{companyLabel} ▾</Chip>
      </div>

      <div className="toolbar">
        <Segmented
          value={career}
          options={[
            { value: "all", label: "경력 전체" },
            { value: "new", label: "신입" },
            { value: "exp", label: "경력" },
          ]}
          onChange={setCareer}
        />
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as JobSort)} aria-label="정렬">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {result === null ? (
        <Loading />
      ) : (
        <>
          <StatCard value={result.total} unit="건" label="조건에 맞는 채용공고" />
          <div className="list">
            {result.items.length === 0 ? <Empty>조건에 맞는 공고가 없어요. 필터를 줄여보세요.</Empty> : result.items.map((j) => <JobCard key={j.jobId} job={j} keyword={searchWord} />)}
          </div>
          {result.items.length < result.total && (
            <button type="button" className="text-link" onClick={() => search(page + 1)}>
              공고 더보기 ›
            </button>
          )}
        </>
      )}

      {sheet === "job" && (
        <JobSheet
          category={category}
          sub={sub}
          onClose={() => setSheet(null)}
          onApply={(c, s) => {
            setCategory(c);
            setSub(s);
            setSheet(null);
          }}
        />
      )}
      {sheet === "location" && (
        <LocationSheet
          onClose={() => setSheet(null)}
          onApply={(l) => {
            setLocation(l);
            setSheet(null);
          }}
        />
      )}
      {sheet === "subway" && (
        <SubwaySheet
          onClose={() => setSheet(null)}
          onApply={(s) => {
            setSubway(s);
            setSheet(null);
          }}
        />
      )}
      {sheet === "company" && (
        <Sheet
          title="기업형태"
          onClose={() => setSheet(null)}
          footer={
            <button type="button" className="btn btn-primary btn-block" onClick={() => setSheet(null)}>
              적용하기
            </button>
          }
        >
          <p className="sheet-desc">여러 개를 함께 고를 수 있어요.</p>
          <div className="chip-wrap">
            {COMPANY_TYPES.map((c) => (
              <Chip
                key={c.value}
                active={companyTypes.includes(c.value)}
                onClick={() =>
                  setCompanyTypes((prev) => (prev.includes(c.value) ? prev.filter((v) => v !== c.value) : [...prev, c.value]))
                }
              >
                {c.label}
              </Chip>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}

function JobSheet({
  category,
  sub,
  onClose,
  onApply,
}: {
  category: JobCategory | null;
  sub: SubJobCategory | null;
  onClose: () => void;
  onApply: (c: JobCategory | null, s: SubJobCategory | null) => void;
}) {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [picked, setPicked] = useState<JobCategory | null>(category);
  const [subs, setSubs] = useState<SubJobCategory[] | null>(null);

  useEffect(() => {
    fetchJobCategories().then((r) => setCategories(r.items));
  }, []);

  useEffect(() => {
    if (!picked) return;
    fetchSubJobCategories(picked.jobCategoryCode).then((r) => setSubs(r.items));
  }, [picked]);

  return (
    <Sheet title={picked ? picked.jobCategoryName : "직무 선택"} onClose={onClose}>
      {!picked ? (
        <>
          <div className="chip-wrap">
            {categories.map((c) => (
              <Chip
                key={c.jobCategoryCode}
                onClick={() => {
                  setSubs(null);
                  setPicked(c);
                }}
              >
                {c.jobCategoryName}
              </Chip>
            ))}
          </div>
          {category && (
            <button type="button" className="text-link" onClick={() => onApply(null, null)}>
              직무 선택 해제
            </button>
          )}
        </>
      ) : (
        <>
          <button type="button" className="link-btn" onClick={() => setPicked(null)}>
            ‹ 다른 직무 고르기
          </button>
          <div className="chip-wrap">
            <Chip active={!sub} onClick={() => onApply(picked, null)}>
              전체
            </Chip>
            {subs === null ? (
              <Loading />
            ) : (
              subs.map((s) => (
                <Chip key={s.subJobCategoryCode} active={sub?.subJobCategoryCode === s.subJobCategoryCode} onClick={() => onApply(picked, s)}>
                  {s.subJobCategoryName}
                </Chip>
              ))
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}

function LocationSheet({ onClose, onApply }: { onClose: () => void; onApply: (l: Location | null) => void }) {
  const [word, setWord] = useState("");
  const [items, setItems] = useState<Location[] | null>(null);

  return (
    <Sheet title="지역" onClose={onClose}>
      <SearchBar
        value={word}
        placeholder="예: 판교, 강남구, 성수"
        onChange={setWord}
        onSubmit={() => searchLocationCodes(word).then((r) => setItems(r.items))}
      />
      <div className="option-list">
        {items === null ? (
          <Empty>동네 이름을 검색하면 사람인 지역 코드로 바꿔드려요.</Empty>
        ) : items.length === 0 ? (
          <Empty>검색 결과가 없어요.</Empty>
        ) : (
          items.map((l) => (
            <button key={l.locationCode} type="button" className="option" onClick={() => onApply(l)}>
              <strong>{l.locationName.replace("_", " ")}</strong>
              <span>{l.details}</span>
            </button>
          ))
        )}
      </div>
      <button type="button" className="text-link" onClick={() => onApply(null)}>
        지역 선택 해제
      </button>
    </Sheet>
  );
}

function SubwaySheet({ onClose, onApply }: { onClose: () => void; onApply: (s: { label: string; codes: string[] } | null) => void }) {
  const [word, setWord] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [items, setItems] = useState<Subway[] | null>(null);

  function search() {
    searchSubwayInfo(word, minutes).then((r) => setItems(r.items));
  }

  // 같은 역이 노선별로 여러 코드를 가지므로 이름 기준으로 묶어서 보여줘요.
  const groups = new Map<string, Subway[]>();
  for (const s of items ?? []) {
    const name = s.subwayName.replace(/역$/, "");
    groups.set(name, [...(groups.get(name) ?? []), s]);
  }
  const grouped = [...groups];

  const applyAll =
    minutes > 0 && items && items.length > 0 ? (
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => onApply({ label: `${word.replace(/역$/, "")}역 ${minutes}분`, codes: items.map((s) => s.subwayCode) })}
      >
        {grouped.length}개 역 모두 적용
      </button>
    ) : undefined;

  return (
    <Sheet title="지하철역" onClose={onClose} footer={applyAll}>
      <SearchBar value={word} placeholder="예: 강남역, 판교역" onChange={setWord} onSubmit={search} />
      <p className="field-label">통근 시간</p>
      <div className="chip-row">
        {COMMUTE_MINUTES.map((m) => (
          <Chip key={m} active={minutes === m} onClick={() => setMinutes(m)}>
            {m === 0 ? "역 근처만" : `${m}분 이내`}
          </Chip>
        ))}
      </div>
      {items === null ? (
        <Empty>역 이름을 검색해 주세요. 통근 시간을 고르면 그 안에 닿는 역까지 함께 찾아요.</Empty>
      ) : items.length === 0 ? (
        <Empty>검색 결과가 없어요.</Empty>
      ) : (
        <>
          <div className="chip-wrap">
            {grouped.map(([name, list]) => (
              <Chip key={name} onClick={() => onApply({ label: `${name}역`, codes: list.map((s) => s.subwayCode) })}>
                {name}
              </Chip>
            ))}
          </div>
        </>
      )}
      <button type="button" className="text-link" onClick={() => onApply(null)}>
        지하철역 선택 해제
      </button>
    </Sheet>
  );
}

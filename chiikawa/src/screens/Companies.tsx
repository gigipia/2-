import { useEffect, useState } from "react";
import { searchCompanyInfo, type Company } from "../api/saramin";
import { Chip, Empty, Loading, Meta, SearchBar, StatCard } from "../components";

const SUGGESTIONS = ["비바리퍼블리카", "스쿼드엑스", "파수에이아이"];

export default function Companies({ initial }: { initial?: string }) {
  const [word, setWord] = useState(initial ?? "비바리퍼블리카");
  const [items, setItems] = useState<Company[] | null>(null);

  function search(searchWord = word) {
    setItems(null);
    searchCompanyInfo({ searchWord, sort: "Relation", page: 1, pageCount: 5 }).then((r) => setItems(r.items));
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen">
      <h1 className="screen-title">기업 정보</h1>
      <SearchBar value={word} placeholder="회사 이름을 입력해 주세요" onChange={setWord} onSubmit={() => search()} />
      <div className="chip-row">
        {SUGGESTIONS.map((s) => (
          <Chip
            key={s}
            active={word === s}
            onClick={() => {
              setWord(s);
              search(s);
            }}
          >
            {s}
          </Chip>
        ))}
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>찾는 기업이 없어요. 정확한 회사 이름으로 다시 검색해 보세요.</Empty>
      ) : (
        items.map((c) => (
          <section key={c.name} className="card">
            <div className="company-head">
              <div className="company-logo">
                <img src={c.logo} alt="" />
              </div>
              <div>
                <h2 className="company-name">{c.name}</h2>
                {c.hiring && <span className="badge">인재 채용중</span>}
              </div>
            </div>
            <StatCard value={c.jobs.length} unit="건" label="지금 진행 중인 채용" />
            <div className="rows">
              {c.jobs.map((j) => (
                <a key={j.jobId} className="row" href={j.url} target="_blank" rel="noopener noreferrer">
                  <div className="row-main">
                    <p className="row-title">{j.title}</p>
                    <Meta items={[j.career, j.location]} />
                  </div>
                  <span className="row-value">{j.deadline}</span>
                </a>
              ))}
            </div>
            <a className="text-link" href={c.url} target="_blank" rel="noopener noreferrer">
              기업 정보 자세히 보기 ›
            </a>
          </section>
        ))
      )}
    </div>
  );
}

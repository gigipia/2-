import { useEffect, useState } from "react";
import { searchSaraminStoreProducts, type StoreProduct, type StoreSort } from "../api/saramin";
import { Chip, Empty, Loading, SearchBar } from "../components";

const TOPICS = [
  { emoji: "🧠", label: "인적성 검사" },
  { emoji: "📝", label: "자소서 첨삭" },
  { emoji: "🎤", label: "면접 코칭" },
  { emoji: "🧭", label: "취업 코칭" },
];

const SORTS: { value: StoreSort; label: string }[] = [
  { value: "REVEIWS", label: "리뷰 많은순" },
  { value: "RATING", label: "평점순" },
  { value: "SALES", label: "판매순" },
  { value: "NEWEST", label: "최신순" },
];

export default function Store({ initial }: { initial?: string }) {
  const [word, setWord] = useState(initial ?? "");
  const [sort, setSort] = useState<StoreSort>("REVEIWS");
  const [items, setItems] = useState<StoreProduct[] | null>(null);

  function search(searchWord = word) {
    setItems(null);
    searchSaraminStoreProducts({ searchWord, sort, pageNum: 1, limit: 10 }).then((r) => setItems(r.items));
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <div className="screen">
      <h1 className="screen-title">취업 준비 스토어</h1>
      <SearchBar value={word} placeholder="예: 인적성 검사, 면접 코칭" onChange={setWord} onSubmit={() => search()} />

      <div className="topic-grid">
        {TOPICS.map((t) => (
          <button
            key={t.label}
            type="button"
            className={`topic${word === t.label ? " topic-active" : ""}`}
            onClick={() => {
              setWord(t.label);
              search(t.label);
            }}
          >
            <span className="category-emoji">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="chip-row">
        {SORTS.map((s) => (
          <Chip key={s.value} active={sort === s.value} onClick={() => setSort(s.value)}>
            {s.label}
          </Chip>
        ))}
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>찾는 상품이 없어요.</Empty>
      ) : (
        <div className="list">
          {items.map((p) => (
            <article key={p.id} className="product">
              <img className="product-image" src={p.image} alt="" loading="lazy" />
              <div className="product-body">
                <h3 className="product-name">{p.name}</h3>
                <p className="rating">
                  <span className="star">★</span> {p.rating.toFixed(1)} <span className="muted">({p.reviews.toLocaleString()})</span>
                </p>
                <a className="btn btn-outline btn-sm" href={p.url} target="_blank" rel="noopener noreferrer">
                  준비하기
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

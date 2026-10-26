import type { ReactNode } from "react";
import { keywordTerms, type Job } from "./api/saramin";

/** 검색어와 맞는 부분을 파란색으로 칠해요. */
export function Highlight({ text, keyword }: { text: string; keyword?: string }) {
  const terms = keyword ? keywordTerms(keyword).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) : [];
  if (terms.length === 0) return <>{text}</>;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

export function JobCard({ job, keyword }: { job: Job; keyword?: string }) {
  return (
    <article className="job-card">
      <div className="job-logo">
        <img src={job.logo} alt="" loading="lazy" />
      </div>
      <div className="job-body">
        {job.badge && <span className="badge">{job.badge}</span>}
        <h3 className="job-title">
          <Highlight text={job.title} keyword={keyword} />
        </h3>
        <p className="job-company">
          <Highlight text={job.company} keyword={keyword} />
        </p>
        <Meta items={[job.deadline, job.career, job.location]} />
      </div>
      <a className="btn btn-outline btn-sm" href={job.url} target="_blank" rel="noopener noreferrer">
        지원
      </a>
    </article>
  );
}

export function Meta({ items }: { items: string[] }) {
  return (
    <p className="meta">
      {items.map((item, i) => (
        <span key={i} className={i === 0 ? "meta-strong" : undefined}>
          {item}
        </span>
      ))}
    </p>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`chip${active ? " chip-active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={o.value === value ? "segmented-active" : undefined}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({
  value,
  placeholder,
  onChange,
  onSubmit,
  autoFocus,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
}) {
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <span aria-hidden="true">🔍</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        enterKeyHint="search"
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="지우기" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </form>
  );
}

// 금액(숫자) 하나만 크게, 설명은 그 아래 회색으로 두는 카드예요.
export function StatCard({ value, unit, label }: { value: number; unit: string; label: string }) {
  return (
    <div className="stat-card">
      <p className="stat-value">
        {value.toLocaleString()}
        <span>{unit}</span>
      </p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 시트 하단에 고정되는 파란 버튼 하나 */
  footer?: ReactNode;
}) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header className="sheet-header">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="닫기" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="sheet-body">{children}</div>
        {footer && <footer className="sheet-footer">{footer}</footer>}
      </section>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

export function Loading() {
  return (
    <div className="loading" aria-label="불러오는 중">
      <span />
      <span />
      <span />
    </div>
  );
}

export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

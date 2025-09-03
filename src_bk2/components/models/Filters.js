import React from 'react';

export default function Filters(props) {
  const { source, setSource, publisher, setPublisher, q, setQ, facets, onResetPage } = props;
  return (
    <section className="p-3 page-card">
      <div className="d-flex align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
      </div>

      <div className="mb-3">
        <label className="form-label">Source</label>
        <div className="chips">
          <button className={`chip ${source === '' ? 'active' : ''}`} onClick={() => { setSource(''); onResetPage(); }}>All</button>
          {facets.sources.map(([s, c]) => (
            <button key={s} className={`chip ${source === s ? 'active' : ''}`} onClick={() => { setSource(s); onResetPage(); }}>
              {s} <span className="ms-1 text-muted">({c})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Publisher</label>
        <div className="chips">
          <button className={`chip ${publisher === '' ? 'active' : ''}`} onClick={() => { setPublisher(''); onResetPage(); }}>All</button>
          {facets.publishers.map(([p, c]) => (
            <button key={p} className={`chip ${publisher === p ? 'active' : ''}`} onClick={() => { setPublisher(p); onResetPage(); }}>
              {p} <span className="ms-1 text-muted">({c})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Search</label>
        <input className="form-control" placeholder="model name…" value={q} onChange={(e) => { setQ(e.target.value); onResetPage(); }} />
      </div>
    </section>
  );
}

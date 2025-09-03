import React from 'react';
import { fmtDateTime } from '../../services/api.js';

export default function ModelsTable({ rows, total, loading, err, page, setPage, onSelect, pageSize }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <section className="p-3 page-card white">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <h5 className="mb-0">Models</h5>
          <small className="text-muted">{total} items</small>
        </div>
        <div className="text-muted">Page {page} / {pageCount}</div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Model</th>
              <th>Source</th>
              <th>Publisher</th>
              <th>Branch</th>
              <th>Uploader</th>
              <th>Created</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr className="placeholder-row"><td colSpan={7}>Loading…</td></tr>)}
            {err && !loading && (<tr><td colSpan={7} className="text-danger">{err}</td></tr>)}
            {!loading && !err && rows.length === 0 && (<tr><td colSpan={7} className="text-muted">No models found</td></tr>)}
            {!loading && !err && rows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.model_name || r.name}</td>
                <td>{r.source}</td>
                <td>{r.publisher}</td>
                <td>{r.branch || 'main'}</td>
                <td>{r.uploader || '-'}</td>
                <td>{fmtDateTime(r.create_time)}</td>
                <td><button className="btn btn-sm btn-indigo" onClick={() => onSelect(r)}>Select</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <div className="text-muted small">Showing {rows.length} of {total} (page size {pageSize})</div>
        <button className="btn btn-outline-secondary btn-sm" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>Next</button>
      </div>
    </section>
  );
}

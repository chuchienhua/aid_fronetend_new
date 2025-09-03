import React from 'react';
import { fmtDateTime } from '../../services/api.js';

export default function ModelsTable({ rows, total, loading, err, page, setPage, onSelect }) {
  return (
    <section className="p-3 page-card white">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <h5 className="mb-0">Models</h5>
          <small className="text-muted">{total} items</small>
        </div>
        <div className="text-muted">Page {page}</div>
      </div>

      <div className="table-responsive fixed-rows-10">
          <table className="table table-fixed align-middle mb-0 sticky-head">
            <thead>
                <tr>
                    <th style={{width:'22%'}}>Model</th>
                    <th style={{width:'14%'}}>Source</th>
                    <th style={{width:'18%'}}>Publisher</th>
                    <th style={{width:'12%'}}>Branch</th>
                    <th style={{width:'12%'}}>Uploader</th>
                    <th style={{width:'14%'}}>Created</th>
                    <th style={{width:'8%'}}>Actions</th>
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
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </section>
  );
}

import React from 'react';
import { fmtDateTime } from '../../services/api.js';

export default function StatusTable({ rows }) {
  return (
    <section className="p-3 page-card white">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0">Job Status</h5>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Submitted</th>
              <th>File</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (<tr><td colSpan={5} className="text-muted">No jobs yet.</td></tr>)}
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.id}</td>
                <td>{fmtDateTime(r.submitted)}</td>
                <td className="text-break">{r.file}</td>
                <td>{r.status}</td>
                <td className="text-break">{r.message || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

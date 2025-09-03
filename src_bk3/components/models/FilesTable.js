import React from 'react';
import { fmtBytes, fmtDateTime } from '../../services/api.js';

export default function FilesTable({ fileRows }) {
  return (
    <div className="table-responsive" style={{ maxHeight: '32vh', overflow: 'auto' }}>
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Path</th>
            <th>Size</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {(fileRows || []).map((f, i) => (
            <tr key={i}>
              <td className="fw-semibold">{f.Name || f.name}</td>
              <td className="text-break">{f.Path || f.path || '/'}</td>
              <td>{fmtBytes(f.Size)}</td>
              <td>{fmtDateTime(f.Createtime || f.create_time)}</td>
            </tr>
          ))}
          {(!fileRows || fileRows.length === 0) && (<tr><td colSpan={4} className="text-muted">No files under this folder.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

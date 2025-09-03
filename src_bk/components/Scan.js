import React, { useEffect, useRef, useState } from 'react';
import { submitScan, getScanStatus, fmtDateTime } from '../services/api.js';

export default function Scan() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState('');
  const [statusRows, setStatusRows] = useState([]);

  const pollRef = useRef(null);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { jobId } = await submitScan(form);
      setJobId(jobId);

      setStatusRows(rows => ([
        { id: jobId, submitted: new Date().toISOString(), file: file.name, status: 'Submitted', message: 'Queued' },
        ...rows,
      ]));

      pollRef.current = setInterval(async () => {
        try {
          const s = await getScanStatus(jobId);
          const statusText = String(s.status || s.state || 'In Progress');
          setStatusRows(rows => rows.map(r => r.id === jobId ? { ...r, status: statusText, message: s.message || r.message } : r));
          if (['done','completed','success','failed','error'].includes(statusText.toLowerCase())) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setBusy(false);
          }
        } catch {
          // ignore transient errors
        }
      }, 2000);
    } catch (e) {
      setBusy(false);
      alert(String(e));
    }
  };

  return (
    <div className="scan-page">
      <section className="p-3 page-card mb-3">
        <h5 className="mb-3">Scan — Upload & Submit</h5>
        <form className="row g-3 align-items-center" onSubmit={onSubmit}>
          <div className="col-12 col-md-6">
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-indigo" disabled={!file || busy} type="submit">
              {busy ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </section>

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
              {statusRows.length === 0 && (<tr><td colSpan={5} className="text-muted">No jobs yet.</td></tr>)}
              {statusRows.map((r, i) => (
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
    </div>
  );
}

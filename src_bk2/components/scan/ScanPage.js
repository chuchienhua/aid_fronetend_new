import React, { useEffect, useRef, useState } from 'react';
import UploadForm from './UploadForm.js';
import StatusTable from './StatusTable.js';
import { submitScan, getScanStatus } from '../../services/api.js';

export default function ScanPage() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [statusRows, setStatusRows] = useState([]);
  const pollRef = useRef(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      const { jobId } = await submitScan(new FormData());
      setStatusRows(rows => ([
        { id: jobId, submitted: new Date().toISOString(), file: file.name, status: 'Submitted', message: 'Queued' },
        ...rows,
      ]));
      pollRef.current = setInterval(async () => {
        try {
          const s = await getScanStatus(jobId);
          const statusText = String(s.status || s.state || 'In Progress');
          setStatusRows(rows => rows.map(r => r.id === jobId ? { ...r, status: statusText, message: s.message || r.message } : r));
          if (['done','completed','success','failed','error','completed'].includes(statusText.toLowerCase())) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setBusy(false);
          }
        } catch {}
      }, 800);
    } catch (e) {
      setBusy(false);
      alert(String(e));
    }
  };

  return (
    <div className="scan-page">
      <UploadForm file={file} setFile={setFile} busy={busy} onSubmit={onSubmit} />
      <StatusTable rows={statusRows} />
    </div>
  );
}

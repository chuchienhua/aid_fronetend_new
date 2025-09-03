import React from 'react';

export default function UploadForm({ file, setFile, busy, onSubmit }) {
  return (
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
  );
}

import React from 'react';

export default function FoldersList({ folders = [], onPick }) {
  return (
    <div className="row g-2">
      {folders.map((p, i) => (
        <div className="col-12 col-md-6 col-lg-4" key={i}>
          <button className="w-100 text-start input-like" onClick={() => onPick(p)} title={p}>{p}</button>
        </div>
      ))}
    </div>
  );
}

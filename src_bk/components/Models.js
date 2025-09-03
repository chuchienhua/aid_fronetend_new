import React, { useEffect, useMemo, useState } from 'react';
import { listModels, getModelDetails, fmtDateTime, fmtBytes } from '../services/api.js';

export default function Models() {
  // Filters
  const [source, setSource] = useState('');
  const [publisher, setPublisher] = useState('');
  const [q, setQ] = useState('');

  // List
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Details (bottom)
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState('files'); // 'files' | 'folders'
  const [folderFilter, setFolderFilter] = useState('/');

  // Facets from current rows
  const facets = useMemo(() => {
    const src = new Map(); const pub = new Map();
    (rows || []).forEach(r => {
      if (r.source) src.set(r.source, (src.get(r.source) || 0) + 1);
      if (r.publisher) pub.set(r.publisher, (pub.get(r.publisher) || 0) + 1);
    });
    return { sources: Array.from(src.entries()), publishers: Array.from(pub.entries()) };
  }, [rows]);

  useEffect(() => {
    setLoading(true); setErr('');
    listModels({ source, publisher, q, page, pageSize })
      .then(data => {
        const models = data.models || data.model || data.items || [];
        setRows(models);
        setTotal(data.total ?? models.length);
      })
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [source, publisher, q, page]);

  const onSelect = async (r) => {
    setSelected(r);
    setTab('files'); setFolderFilter('/');
    setDetails(null); setDetailsLoading(true);
    try {
      const d = await getModelDetails({
        source: r.source,
        publisher: r.publisher,
        model: r.model_name || r.model || r.name,
        branch: r.branch || 'main',
      });
      setDetails(d);
    } catch (e) {
      setDetails({ error: String(e) });
    } finally {
      setDetailsLoading(false);
    }
  };

  const fileRows = useMemo(() => {
    const list = details?.Content?.file_list || [];
    if (!folderFilter || folderFilter === '/') return list;
    return list.filter(f => (f.Path || f.path || '/').startsWith(folderFilter));
  }, [details, folderFilter]);

  return (
    <div className="models-page">
      {/* Top: Filters + Table */}
      <div className="row g-3">
        {/* Filters */}
        <div className="col-12 col-lg-4">
          <section className="p-3 page-card">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0">Filters</h5>
            </div>

            <div className="mb-3">
              <label className="form-label">Source</label>
              <div className="chips">
                <button className={`chip ${source === '' ? 'active' : ''}`} onClick={() => { setSource(''); setPage(1); }}>All</button>
                {facets.sources.map(([s, c]) => (
                  <button key={s} className={`chip ${source === s ? 'active' : ''}`} onClick={() => { setSource(s); setPage(1); }}>
                    {s} <span className="ms-1 text-muted">({c})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Publisher</label>
              <div className="chips">
                <button className={`chip ${publisher === '' ? 'active' : ''}`} onClick={() => { setPublisher(''); setPage(1); }}>All</button>
                {facets.publishers.map(([p, c]) => (
                  <button key={p} className={`chip ${publisher === p ? 'active' : ''}`} onClick={() => { setPublisher(p); setPage(1); }}>
                    {p} <span className="ms-1 text-muted">({c})</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Search</label>
              <input
                className="form-control"
                placeholder="model name…"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
              />
            </div>
          </section>
        </div>

        {/* Table */}
        <div className="col-12 col-lg-8">
          <section className="p-3 page-card white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h5 className="mb-0">Models</h5>
                <small className="text-muted">{total} items</small>
              </div>
              <div className="text-muted">Page {page}</div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '48vh', overflow: 'auto' }}>
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

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom: Details */}
      <div className="row g-3 mt-1">
        <div className="col-12">
          <section className="p-3 page-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="mb-0">Details {selected ? `— ${selected.model_name || selected.name} (${selected.branch || 'main'})` : ''}</h5>
            </div>

            {!selected && (<div className="text-muted py-4">Select a model from the table above</div>)}

            {selected && (
              <>
                <ul className="nav nav-tabs details-tabs mt-2" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tab === 'files' ? 'active' : ''}`} type="button" onClick={() => setTab('files')}>Files</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tab === 'folders' ? 'active' : ''}`} type="button" onClick={() => setTab('folders')}>Folders</button>
                  </li>
                </ul>

                <div className="pt-3">
                  {detailsLoading && <div>Loading details…</div>}
                  {details?.error && <div className="text-danger">{String(details.error)}</div>}

                  {/* Files */}
                  {!detailsLoading && details && tab === 'files' && (
                    <>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-muted">Folder:</span>
                        <input className="form-control" style={{ maxWidth: 420 }} value={folderFilter} onChange={(e) => setFolderFilter(e.target.value || '/')} />
                      </div>

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
                    </>
                  )}

                  {/* Folders */}
                  {!detailsLoading && details && tab === 'folders' && (
                    <div className="row g-2">
                      {(details.Content?.folder || []).map((p, i) => (
                        <div className="col-12 col-md-6 col-lg-4" key={i}>
                          <button className="w-100 text-start input-like" onClick={() => setFolderFilter(p)} title={p}>{p}</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

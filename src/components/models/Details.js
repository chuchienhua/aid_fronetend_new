import React, { useMemo } from 'react';
import FilesTable from './FilesTable.js';
import FoldersList from './FoldersList.js';

export default function Details({ selected, details, detailsLoading, tab, setTab, folderFilter, setFolderFilter }) {
  const fileRows = useMemo(() => {
    const list = details?.Content?.file_list || [];
    if (!folderFilter || folderFilter === '/') return list;
    return list.filter(f => (f.Path || f.path || '/').startsWith(folderFilter));
  }, [details, folderFilter]);

  return (
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

            {!detailsLoading && details && tab === 'files' && (
              <>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-muted">Folder:</span>
                  <input className="form-control" style={{ maxWidth: 420 }} value={folderFilter} onChange={(e) => setFolderFilter(e.target.value || '/')} />
                </div>
                <FilesTable fileRows={fileRows} />
              </>
            )}

            {!detailsLoading && details && tab === 'folders' && (
              <FoldersList folders={details.Content?.folder || []} onPick={(p) => setFolderFilter(p)} />
            )}
          </div>
        </>
      )}
    </section>
  );
}

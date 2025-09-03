import React, { useEffect, useMemo, useState } from 'react';
import { listModels, listModelsAll, getModelDetails } from '../../services/api.js';
import Filters from './Filters.js';
import ModelsTable from './ModelsTable.js';
import Details from './Details.js';

export default function ModelsPage() {
  // Filters
  const [source, setSource] = useState('');
  const [publisher, setPublisher] = useState('');
  const [q, setQ] = useState('');

  // List (paged data)
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // All filtered data (for facets + total)
  const [allRows, setAllRows] = useState([]);
  const [allLoading, setAllLoading] = useState(false);

  // Details
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState('files');
  const [folderFilter, setFolderFilter] = useState('/');

  // Fetch current page
  useEffect(() => {
    setLoading(true); setErr('');
    listModels({ source, publisher, q, page, pageSize })
      .then(data => {
        const models = data.models || data.model || data.items || [];
        setRows(models);
      })
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [source, publisher, q, page]);

  // Fetch all filtered for facets + total
  useEffect(() => {
    setAllLoading(true);
    listModelsAll({ source, publisher, q })
      .then(setAllRows)
      .finally(() => setAllLoading(false));
  }, [source, publisher, q]);

  // facets from allRows
  const facets = useMemo(() => {
    const src = new Map(); const pub = new Map();
    (allRows || []).forEach(r => {
      if (r.source) src.set(r.source, (src.get(r.source) || 0) + 1);
      if (r.publisher) pub.set(r.publisher, (pub.get(r.publisher) || 0) + 1);
    });
    return { sources: Array.from(src.entries()), publishers: Array.from(pub.entries()) };
  }, [allRows]);

  const total = allRows.length;

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

  return (
    <div className="models-page">
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Filters
            source={source} setSource={(v) => { setSource(v); setPage(1); }}
            publisher={publisher} setPublisher={(v) => { setPublisher(v); setPage(1); }}
            q={q} setQ={(v) => { setQ(v); setPage(1); }}
            facets={facets}
            onResetPage={() => setPage(1)}
          />
          {allLoading && <div className="small text-muted mt-2">Refreshing filters…</div>}
        </div>
        <div className="col-12 col-lg-8">
          <ModelsTable
            rows={rows} total={total}
            loading={loading} err={err}
            page={page} setPage={setPage}
            onSelect={onSelect}
            pageSize={pageSize}
          />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <Details
            selected={selected}
            details={details}
            detailsLoading={detailsLoading}
            tab={tab} setTab={setTab}
            folderFilter={folderFilter} setFolderFilter={setFolderFilter}
          />
        </div>
      </div>
    </div>
  );
}

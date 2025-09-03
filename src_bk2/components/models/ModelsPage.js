import React, { useEffect, useMemo, useState } from 'react';
import { listModels, getModelDetails } from '../../services/api.js';
import Filters from './Filters.js';
import ModelsTable from './ModelsTable.js';
import Details from './Details.js';

export default function ModelsPage() {
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

  // Details
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState('files');
  const [folderFilter, setFolderFilter] = useState('/');

  // facets from rows
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
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Filters
            source={source} setSource={setSource}
            publisher={publisher} setPublisher={setPublisher}
            q={q} setQ={setQ}
            facets={facets}
            onResetPage={() => setPage(1)}
          />
        </div>
        <div className="col-12 col-lg-8">
          <ModelsTable
            rows={rows} total={total}
            loading={loading} err={err}
            page={page} setPage={setPage}
            onSelect={onSelect}
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
            fileRows={fileRows}
          />
        </div>
      </div>
    </div>
  );
}

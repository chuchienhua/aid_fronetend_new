import axios from 'axios';

// axios 0.21.1
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '',
  timeout: 30000,
});

export const fixDateStr = (s) => {
  if (!s) return s;
  // 支援 '2025-0821T06:52:13' -> '2025-08-21T06:52:13'
  const fixed = s.replace(/(\d{4}-\d{2})(\d{2})T/, (m, a, b) => `${a}-${b}T`);
  return fixed;
};

export const fmtDateTime = (s) => {
  if (!s) return '-';
  const d = new Date(fixDateStr(s));
  return isNaN(d.getTime()) ? s : d.toISOString().replace('T', ' ').slice(0, 19);
};

export const fmtBytes = (n) => {
  if (n == null || isNaN(n)) return '-';
  const u = ['B','KB','MB','GB','TB']; let i=0; let v=Number(n);
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
};

// ---- APIs ----
export async function listModels({ source = '', publisher = '', q = '', page = 1, pageSize = 20 }) {
  const params = { page, pageSize };
  if (source) params.source = source;
  if (publisher) params.publisher = publisher;
  if (q) params.q = q;
  const { data } = await api.get('/repo/models', { params });
  return data; // { models/items/model:[], total? }
}

export async function getModelDetails({ source, publisher, model, branch }) {
  const url = `/v1/models/${encodeURIComponent(source)}/${encodeURIComponent(publisher)}/${encodeURIComponent(model)}/${encodeURIComponent(branch)}/model-details`;
  const { data } = await api.get(url);
  return data; // { message, Content: { folder:[], file_list:[], total } }
}

export async function submitScan(formData) {
  const { data } = await api.post('/av/scan', formData);
  return data; // { jobId }
}

export async function getScanStatus(jobId) {
  const { data } = await api.get(`/av/scan/${encodeURIComponent(jobId)}`);
  return data; // { id, status, ... }
}

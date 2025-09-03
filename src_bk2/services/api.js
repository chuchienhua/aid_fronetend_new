import axios from 'axios';
import { MOCK_MODELS, MOCK_DETAILS } from './mockData.js';

const USE_MOCK = (process.env.REACT_APP_USE_MOCK || 'true') === 'true';

// ---------- 工具函數 ----------
export const fmtBytes = (n) => {
  if (n == null || isNaN(n)) return '-';
  const u = ['B','KB','MB','GB','TB']; let i = 0; let v = Number(n);
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
};

export const fixDateStr = (s) => {
  if (!s) return s;
  const fixed = s.replace(/(\\d{4}-\\d{2})(\\d{2})T/, (m, a, b) => `${a}-${b}T`);
  return fixed;
};

export const fmtDateTime = (s) => {
  if (!s) return '-';
  const d = new Date(fixDateStr(s));
  return isNaN(d.getTime()) ? s : d.toISOString().replace('T', ' ').slice(0, 19);
};

// ---------- MOCK API ----------
async function mockListModels({ source = '', publisher = '', q = '', page = 1, pageSize = 20 }) {
  let data = [...MOCK_MODELS];
  if (source) data = data.filter(x => String(x.source).toLowerCase() === String(source).toLowerCase());
  if (publisher) data = data.filter(x => String(x.publisher).toLowerCase() === String(publisher).toLowerCase());
  if (q) {
    const qq = q.toLowerCase();
    data = data.filter(x =>
      String(x.model_name || '').toLowerCase().includes(qq) ||
      String(x.publisher || '').toLowerCase().includes(qq)
    );
  }
  const total = data.length;
  const start = (page - 1) * pageSize;
  const items = data.slice(start, start + pageSize);
  await new Promise(r => setTimeout(r, 200));
  return { models: items, total };
}

async function mockGetModelDetails() {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_DETAILS;
}

async function mockSubmitScan() {
  await new Promise(r => setTimeout(r, 200));
  const jobId = Math.random().toString(36).slice(2, 8);
  return { jobId };
}

let statusCounter = 0;
async function mockGetScanStatus(jobId) {
  await new Promise(r => setTimeout(r, 200));
  statusCounter++;
  if (statusCounter < 3) return { id: jobId, status: 'Queued' };
  if (statusCounter < 6) return { id: jobId, status: 'In Progress' };
  statusCounter = 0;
  return { id: jobId, status: 'Completed', message: 'OK' };
}

// ---------- REAL API ----------
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '',
  timeout: 30000,
});

async function realListModels({ source = '', publisher = '', q = '', page = 1, pageSize = 20 }) {
  const params = { page, pageSize };
  if (source) params.source = source;
  if (publisher) params.publisher = publisher;
  if (q) params.q = q;
  const { data } = await api.get('/repo/models', { params });
  return data;
}

async function realGetModelDetails({ source, publisher, model, branch }) {
  const url = `/v1/models/${encodeURIComponent(source)}/${encodeURIComponent(publisher)}/${encodeURIComponent(model)}/${encodeURIComponent(branch)}/model-details`;
  const { data } = await api.get(url);
  return data;
}

async function realSubmitScan(formData) {
  const { data } = await api.post('/av/scan', formData);
  return data;
}

async function realGetScanStatus(jobId) {
  const { data } = await api.get(`/av/scan/${encodeURIComponent(jobId)}`);
  return data;
}

// ---------- EXPORT ----------
export const listModels     = USE_MOCK ? mockListModels     : realListModels;
export const getModelDetails = USE_MOCK ? mockGetModelDetails : realGetModelDetails;
export const submitScan     = USE_MOCK ? mockSubmitScan     : realSubmitScan;
export const getScanStatus  = USE_MOCK ? mockGetScanStatus  : realGetScanStatus;

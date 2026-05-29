import { api } from './api';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  target: string;
  status: string;
  priority: number;
  clickCount: number;
  viewCount: number;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDesc?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* NestJS + TransformInterceptor wraps every response as:
   { success: true, data: T, timestamp: '...' }
   The api.get helper returns r.data (axios layer), so callers
   receive { success, data: T } — not T directly.
   These helpers unwrap the inner .data so callers get the real payload. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrapArray = <T>(res: any): T[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrapOne   = <T>(res: any): T   => res?.data ?? res;

const BASE = '/cms';

export const cmsApi = {
  /* ── Public ─────────────────────────────────── */

  getActiveBanners: (target?: string): Promise<Banner[]> =>
    api.get(`${BASE}/banners/active`, { params: { target } }).then(unwrapArray<Banner>),

  getPublishedPages: (): Promise<CmsPage[]> =>
    api.get(`${BASE}/pages/published`).then(unwrapArray<CmsPage>),

  getPageBySlug: (slug: string): Promise<CmsPage> =>
    api.get(`${BASE}/pages/slug/${slug}`).then(unwrapOne<CmsPage>),

  trackBannerClick: (id: string) =>
    api.post(`${BASE}/banners/${id}/click`),

  trackBannerView: (id: string) =>
    api.post(`${BASE}/banners/${id}/view`),

  /* ── Admin: Banners ─────────────────────────── */

  getAllBanners: (): Promise<Banner[]> =>
    api.get(`${BASE}/banners`).then(unwrapArray<Banner>),

  createBanner: (data: Partial<Banner>) =>
    api.post(`${BASE}/banners`, data),

  updateBanner: (id: string, data: Partial<Banner>) =>
    api.patch(`${BASE}/banners/${id}`, data),

  deleteBanner: (id: string) =>
    api.delete(`${BASE}/banners/${id}`),

  /* ── Admin: Pages ───────────────────────────── */

  getAllPages: (): Promise<CmsPage[]> =>
    api.get(`${BASE}/pages`).then(unwrapArray<CmsPage>),

  createPage: (data: Partial<CmsPage>) =>
    api.post(`${BASE}/pages`, data),

  getPage: (id: string): Promise<CmsPage> =>
    api.get(`${BASE}/pages/${id}`).then(unwrapOne<CmsPage>),

  updatePage: (id: string, data: Partial<CmsPage>) =>
    api.patch(`${BASE}/pages/${id}`, data),

  deletePage: (id: string) =>
    api.delete(`${BASE}/pages/${id}`),
};

import api from './api';

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

const BASE = '/cms';

export const cmsApi = {
  // Public
  getActiveBanners: (target?: string) =>
    api.get<Banner[]>(`${BASE}/banners/active`, { params: { target } }),

  getPublishedPages: () =>
    api.get<CmsPage[]>(`${BASE}/pages/published`),

  getPageBySlug: (slug: string) =>
    api.get<CmsPage>(`${BASE}/pages/slug/${slug}`),

  trackBannerClick: (id: string) =>
    api.post(`${BASE}/banners/${id}/click`),

  trackBannerView: (id: string) =>
    api.post(`${BASE}/banners/${id}/view`),

  // Admin: Banners
  getAllBanners: (target?: string) =>
    api.get<Banner[]>(`${BASE}/banners`, { params: { target } }),

  createBanner: (data: Partial<Banner>) =>
    api.post<Banner>(`${BASE}/banners`, data),

  updateBanner: (id: string, data: Partial<Banner>) =>
    api.patch<Banner>(`${BASE}/banners/${id}`, data),

  deleteBanner: (id: string) =>
    api.delete(`${BASE}/banners/${id}`),

  // Admin: Pages
  getAllPages: () =>
    api.get<CmsPage[]>(`${BASE}/pages`),

  createPage: (data: Partial<CmsPage>) =>
    api.post<CmsPage>(`${BASE}/pages`, data),

  getPage: (id: string) =>
    api.get<CmsPage>(`${BASE}/pages/${id}`),

  updatePage: (id: string, data: Partial<CmsPage>) =>
    api.patch<CmsPage>(`${BASE}/pages/${id}`, data),

  deletePage: (id: string) =>
    api.delete(`${BASE}/pages/${id}`),
};

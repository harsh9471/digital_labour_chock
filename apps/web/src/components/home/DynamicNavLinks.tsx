'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cmsApi, CmsPage } from '@/lib/cms-api';

export default function DynamicNavLinks() {
  const [pages, setPages] = useState<CmsPage[]>([]);

  useEffect(() => {
    cmsApi.getPublishedPages()
      .then(data => {
        // cmsApi.getPublishedPages() returns CmsPage[] directly (unwrapped)
        setPages(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch(() => setPages([]));
  }, []);

  // Exclude slugs that have dedicated static nav items
  const staticSlugs = new Set(['about', 'business']);
  const dynamicPages = pages.filter(p => !staticSlugs.has(p.slug));

  if (dynamicPages.length === 0) return null;

  return (
    <>
      {dynamicPages.map(page => (
        <Link
          key={page.slug}
          href={`/pages/${page.slug}`}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
        >
          {page.title}
        </Link>
      ))}
    </>
  );
}

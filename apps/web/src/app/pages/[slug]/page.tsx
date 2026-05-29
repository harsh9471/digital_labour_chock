'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, FileX } from 'lucide-react';
import { cmsApi, CmsPage } from '@/lib/cms-api';
import NavActions from '@/components/home/NavActions';
import DynamicNavLinks from '@/components/home/DynamicNavLinks';

export default function CmsPageView() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    cmsApi.getPageBySlug(slug)
      .then(data => {
        setPage(data); // cms-api unwraps to CmsPage directly
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Digital Labour <span className="text-blue-600">Chowk</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/business', label: 'Business' },
              { href: '/platform/workers', label: 'Workers' },
              { href: '/platform/projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
            <DynamicNavLinks />
          </div>
          <NavActions />
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
            </div>
          )}

          {!loading && notFound && (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gray-100 flex items-center justify-center">
                <FileX className="h-10 w-10 text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
              <p className="text-gray-500 mb-6">The page you are looking for does not exist or has been unpublished.</p>
              <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </div>
          )}

          {!loading && page && (
            <article>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">{page.title}</span>
              </div>

              {/* Hero */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">{page.title}</h1>
                {page.excerpt && <p className="text-lg text-gray-500 leading-relaxed">{page.excerpt}</p>}
                {page.publishedAt && (
                  <p className="text-sm text-gray-400 mt-3">
                    Last updated: {new Date(page.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Content */}
              <div
                className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-800 prose-li:text-gray-600"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />

              {/* Back */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { cmsApi, Banner } from '@/lib/cms-api';

export default function DynamicBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsApi.getActiveBanners('ALL')
      .then(res => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (res as any)?.data ?? (res as any) ?? [];
        setBanners(Array.isArray(data) ? data : []);
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const trackClick = (id: string) => {
    cmsApi.trackBannerClick(id).catch(() => {});
  };

  if (loading || banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      <div
        className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center"
        style={banner.imageUrl ? {
          backgroundImage: `url(${banner.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="relative z-10 px-8 py-6 max-w-lg">
          <h3 className="text-2xl font-bold text-white mb-2">{banner.title}</h3>
          {banner.subtitle && <p className="text-white/80 text-sm mb-4">{banner.subtitle}</p>}
          {banner.linkUrl && (
            <Link
              href={banner.linkUrl}
              onClick={() => trackClick(banner.id)}
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition-colors"
            >
              {banner.linkText || 'Learn More'} <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors z-20"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors z-20"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cmsApi, Banner } from '@/lib/cms-api';

/* ── Fallback banners with real construction-industry images ─── */
const FALLBACKS = [
  {
    id: 'f1',
    title: "India's #1 Platform for Skilled Workers",
    subtitle: '2.5 Lakh+ verified workers · 100+ cities · Hire same day',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
    linkUrl: '/platform/projects',
    linkText: 'Browse Live Jobs',
    accentColor: '#10b981',
  },
  {
    id: 'f2',
    title: 'Find Jobs Near You Today',
    subtitle: 'Daily wage · Weekly · Contract — apply in seconds',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80&auto=format&fit=crop',
    linkUrl: '/register?role=WORKER',
    linkText: 'Register Free',
    accentColor: '#3b82f6',
  },
  {
    id: 'f3',
    title: 'Post a Job, Hire in Minutes',
    subtitle: 'Verified contractors hiring verified workers — zero hassle',
    imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=1600&q=80&auto=format&fit=crop',
    linkUrl: '/register?role=CONTRACTOR',
    linkText: 'Post a Job Free',
    accentColor: '#f97316',
  },
];

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  accentColor?: string;
};

function cmsToSlide(b: Banner, idx: number): Slide {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl || FALLBACKS[idx % FALLBACKS.length].imageUrl,
    linkUrl: b.linkUrl,
    linkText: b.linkText,
    accentColor: FALLBACKS[idx % FALLBACKS.length].accentColor,
  };
}

export default function DynamicBanners() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cmsApi.getActiveBanners('ALL')
      .then(data => {
        // cmsApi.getActiveBanners() now returns Banner[] directly (unwrapped)
        setSlides(data.length > 0 ? data.map((b, i) => cmsToSlide(b, i)) : FALLBACKS);
      })
      .catch(() => setSlides(FALLBACKS))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const trackClick = (id: string) => {
    if (!id.startsWith('f')) cmsApi.trackBannerClick(id).catch(() => {});
  };

  if (!loaded) return (
    <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 animate-pulse" style={{ height: '480px' }} />
  );

  return (
    <div className="relative overflow-hidden w-full" style={{ height: '480px' }}>
      {slides.map((slide, i) => (
        <div key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>

          {/* Background image */}
          {slide.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}

          {/* Multi-layer gradient overlay for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Accent color strip at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: slide.accentColor ?? '#10b981' }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8 sm:px-16">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accentColor ?? '#10b981' }} />
                  <span className="text-white text-sm font-bold tracking-wide">Digital Labour Chowk</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-5 drop-shadow-2xl">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-white/75 text-lg sm:text-xl mb-8 leading-relaxed font-medium">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                {slide.linkUrl && (
                  <Link href={slide.linkUrl} onClick={() => trackClick(slide.id)}>
                    <button
                      className="inline-flex items-center gap-3 font-black px-8 py-4 rounded-2xl text-base shadow-2xl transition-all hover:scale-105 active:scale-95 text-white"
                      style={{ backgroundColor: slide.accentColor ?? '#10b981', boxShadow: `0 20px 60px ${slide.accentColor ?? '#10b981'}50` }}>
                      {slide.linkText || 'Get Started'}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right side: stats overlay */}
          <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end gap-3">
            {[
              { val: '2.5L+', label: 'Verified Workers' },
              { val: '15K+', label: 'Active Contractors' },
              { val: '100+', label: 'Cities Covered' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 shadow-lg">
                <span className="text-xl font-black text-white">{stat.val}</span>
                <span className="text-white/70 text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Slide number */}
          <div className="absolute top-8 right-8 text-white/20 font-black text-7xl select-none hidden lg:block leading-none">
            0{i + 1}
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-xl">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % slides.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-xl">
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Progress indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === current ? '32px' : '8px',
                  backgroundColor: i === current ? (slides[current]?.accentColor ?? '#10b981') : 'rgba(255,255,255,0.4)',
                }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

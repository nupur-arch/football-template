'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Banner } from '@/types';
import { homeCopy as copy, strings } from '@/content/strings';
import { SafeImage } from '@/components/safe-image';
import { ButtonLink } from '@/components/ui';

/** -1 scrolls the track from left to right as the page moves down. Flip the sign to reverse it. */
const SCROLL_DIRECTION = -1;
const DESKTOP = { step: 24, radius: 1100, limit: 2 };
const MOBILE = { step: 24, radius: 460, limit: 1 };

const pad = (value: number) => String(value).padStart(2, '0');

function GalleryCard({ banner, index, count, progress, live, compact, priority }: { banner: Banner; index: number; count: number; progress: MotionValue<number>; live: boolean; compact: boolean; priority: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const hover = useMotionValue(0);
  const span = Math.max(count - 1, 1);
  const { step, radius, limit } = compact ? MOBILE : DESKTOP;
  const pose = useTransform([progress, hover], ([raw, lifted]) => {
    const delta = (index - Number(raw) * span) * SCROLL_DIRECTION;
    const distance = Math.abs(delta);
    const lift = Number(lifted);
    const hidden = distance > limit + 0.45;
    const scale = (hidden ? 0.8 : 1 - Math.min(distance, limit) * 0.12) + lift * 0.045;
    const opacity = hidden ? 0 : Math.max(0, 1 - distance * (limit === 1 ? 0.55 : 0.4));
    return {
      transform: `translate(-50%, -50%) translateY(${lift * -22}px) rotateY(${delta * step * (1 - lift * 0.92)}deg) translateZ(${(hidden ? -520 : radius) + lift * 90}px) scale(${scale})`,
      opacity,
      z: 120 - Math.round(distance * 20),
      hidden: hidden || distance > 0.55,
    };
  });
  useEffect(() => {
    if (!live) return;
    let frame = 0;
    let current = 0;
    let goal = 0;
    const tick = () => {
      current += (goal - current) * 0.18;
      if (Math.abs(goal - current) < 0.01) current = goal;
      hover.set(current);
      frame = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const aim = (value: number) => { goal = value; if (!frame) frame = requestAnimationFrame(tick); };
    const node = ref.current;
    if (!node) return;
    const enter = () => aim(1);
    const leave = () => aim(0);
    node.addEventListener('mouseenter', enter);
    node.addEventListener('mouseleave', leave);
    return () => { cancelAnimationFrame(frame); node.removeEventListener('mouseenter', enter); node.removeEventListener('mouseleave', leave); };
  }, [live, hover]);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!live) {
      node.style.transform = '';
      node.style.opacity = '';
      node.style.zIndex = '';
      node.style.pointerEvents = '';
      node.removeAttribute('aria-hidden');
      return;
    }
    const write = () => {
      const next = pose.get();
      node.style.transform = next.transform;
      node.style.opacity = String(next.opacity);
      node.style.zIndex = String(next.z);
      node.style.pointerEvents = next.hidden ? 'none' : '';
      if (next.hidden) node.setAttribute('aria-hidden', 'true');
      else node.removeAttribute('aria-hidden');
    };
    write();
    return pose.on('change', write);
  }, [live, pose]);
  return <Link ref={ref} href={banner.href} className="gallery-card">
    <span className="gallery-media"><SafeImage src={banner.image} alt="" fill sizes="(max-width: 767px) 70vw, 340px" priority={priority} className="object-cover" /></span>
    <span className="gallery-shade" />
    <span className="gallery-copy"><span className="gallery-chip">{banner.description}</span><h2 className="gallery-title">{banner.title}</h2></span>
    <span className="gallery-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
  </Link>;
}

export function StoryGallery({ banners }: { banners: Banner[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [compact, setCompact] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const visual = useMotionValue(0);
  const count = banners.length;
  const span = Math.max(count - 1, 1);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 767px)');
    const sync = () => { setLive(!motion.matches); setCompact(narrow.matches); };
    sync();
    motion.addEventListener('change', sync);
    narrow.addEventListener('change', sync);
    return () => { motion.removeEventListener('change', sync); narrow.removeEventListener('change', sync); };
  }, []);
  useEffect(() => {
    if (!live) return;
    let frame = 0;
    let current = scrollYProgress.get();
    let goal = current;
    let mode = 'follow';
    let restScroll = current;
    let idle = 0;
    const noise = 0.08 / span;
    const tick = () => {
      current += (goal - current) * (mode === 'settle' ? 0.14 : 0.5);
      if (Math.abs(goal - current) < 0.0004) {
        current = goal;
        if (mode === 'settle') mode = 'rest';
      }
      visual.set(current);
      if (counter.current) counter.current.textContent = pad(Math.round(current * span) + 1);
      if (line.current) line.current.style.transform = `scaleX(${current})`;
      frame = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const follow = (value: number) => {
      if (mode === 'rest' && Math.abs(value - restScroll) < noise) return;
      mode = 'follow';
      goal = value;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        mode = 'settle';
        restScroll = scrollYProgress.get();
        goal = Math.round(restScroll * span) / span;
        kick();
      }, 200);
      kick();
    };
    const stop = scrollYProgress.on('change', follow);
    follow(scrollYProgress.get());
    return () => { stop(); cancelAnimationFrame(frame); window.clearTimeout(idle); };
  }, [live, scrollYProgress, span, visual]);
  const syncRow = () => {
    const node = track.current;
    if (!node || live) return;
    const max = node.scrollWidth - node.clientWidth;
    const ratio = max > 0 ? node.scrollLeft / max : 0;
    if (line.current) line.current.style.transform = `scaleX(${ratio})`;
    const cards = [...node.children] as HTMLElement[];
    const mid = node.scrollLeft + node.clientWidth / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = index; }
    });
    if (counter.current) counter.current.textContent = pad(best + 1);
  };
  return <section ref={section} className={live ? 'gallery-pin is-live' : 'gallery-pin'} aria-labelledby="hero-title">
    <div className="gallery-stage">
      <div className="container-shell gallery-head">
        <p className="home-eyebrow">{strings.heroLabel}</p>
        <h1 id="hero-title">{copy.galleryTitle}</h1>
      </div>
      {count ? <div className="gallery-scene">
        <div ref={track} className={live ? 'gallery-track is-cylinder' : 'gallery-track'} data-lenis-prevent={live ? undefined : true} onScroll={live ? undefined : syncRow}>
          {banners.map((banner, index) => <GalleryCard key={banner.id} banner={banner} index={index} count={count} progress={visual} live={live} compact={compact} priority={index < 3} />)}
        </div>
      </div> : <p className="container-shell text-muted">{strings.empty}</p>}
      <div className="container-shell gallery-foot">
        <p className="gallery-count"><span ref={counter}>01</span> <span className="text-muted">/ {pad(count)}</span></p>
        <div className="gallery-line" aria-hidden="true"><span ref={line} /></div>
        <ButtonLink href="/search">{copy.allStories}</ButtonLink>
      </div>
    </div>
  </section>;
}

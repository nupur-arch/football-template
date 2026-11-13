'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

// This chunk only enhances server-rendered content; CSS owns the readable fallback.
export default function ScrollEffects({ stack, fans }: { stack: RefObject<HTMLDivElement | null>; fans: RefObject<HTMLElement | null> }) {
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: fans, offset: ['start end', 'end end'] });
  const darkness = useTransform(scrollYProgress, [0, .35], [0, 1]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => {
      if (media.matches) return;
      stack.current?.querySelectorAll<HTMLElement>('.stack-card').forEach(card => { card.style.removeProperty('transform'); card.style.removeProperty('opacity'); });
      fans.current?.querySelectorAll<HTMLElement>('.fan-pill').forEach(pill => { pill.style.removeProperty('transform'); pill.style.removeProperty('opacity'); });
      fans.current?.style.removeProperty('--fan-darkness');
    };
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [stack, fans]);
  useMotionValueEvent(scrollY, 'change', () => {
    if (!window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;
    const cards = stack.current?.querySelectorAll<HTMLElement>('.stack-card');
    cards?.forEach((card, i) => {
      const next = cards[i + 1];
      const progress = next ? Math.max(0, Math.min(1, (window.innerHeight - next.getBoundingClientRect().top) / (window.innerHeight - 140))) : 0;
      card.style.transform = `scale(${1 - progress * .055})`;
      card.style.opacity = String(1 - progress * .35);
    });
  });
  useMotionValueEvent(darkness, 'change', value => {
    if (window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) fans.current?.style.setProperty('--fan-darkness', String(value));
  });
  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;
    fans.current?.querySelectorAll<HTMLElement>('.fan-pill').forEach((pill, i) => {
      const amount = Math.max(0, Math.min(1, (value - .15 - i * .065) / .16));
      pill.style.opacity = String(.15 + amount * .85);
      pill.style.transform = `translateY(${(1 - amount) * 25}px) rotate(${i % 2 ? 5 : -5}deg)`;
    });
  });
  return null;
}

'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

// Stacking cards only. The fan scene owns its own scroll progress.
export default function ScrollEffects({ stack }: { stack: RefObject<HTMLDivElement | null> }) {
  const { scrollY } = useScroll();
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => {
      if (media.matches) return;
      stack.current?.querySelectorAll<HTMLElement>('.stack-card').forEach(card => { card.style.removeProperty('transform'); card.style.removeProperty('opacity'); });
    };
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [stack]);
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
  return null;
}

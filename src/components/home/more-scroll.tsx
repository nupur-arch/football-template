'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export default function MoreScroll({ root, onFeature }: { root: RefObject<HTMLDivElement | null>; onFeature: (index: number) => void }) {
  const { scrollY } = useScroll();
  const update = () => {
    const node = root.current;
    if (!node || !window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;
    const height = window.innerHeight;
    const progress = (selector: string, sticky = false) => {
      const element = node.querySelector<HTMLElement>(selector);
      if (!element) return 0;
      const box = element.getBoundingClientRect();
      return sticky ? clamp(-box.top / Math.max(1, box.height - height)) : clamp((height - box.top) / Math.max(1, height * .85));
    };
    const center = progress('.match-showcase');
    const shade = node.querySelector<HTMLElement>('.center-transition');
    if (shade) shade.style.opacity = String(1 - center);
    node.querySelectorAll<HTMLElement>('.paper-panel').forEach((panel, i) => {
      const value = clamp((center - i * .14) / .6);
      panel.style.transform = `translateY(${(1 - value) * 100}px) scale(${.9 + value * .1}) rotate(${(i - 1) * 3}deg)`;
      panel.style.opacity = String(.25 + value * .75);
      const content = panel.querySelector<HTMLElement>('.paper-content');
      if (content) { content.style.opacity = String(.2 + value * .8); content.style.transform = `translateY(${(1 - value) * 20}px)`; }
    });
    const countProgress = progress('.more-counts');
    node.querySelectorAll<HTMLElement>('[data-count]').forEach(counter => { counter.textContent = String(Math.round(Number(counter.dataset.count) * countProgress)); });
    const feature = progress('.feature-showcase', true);
    onFeature(Math.min(4, Math.floor(feature * 5)));
    node.querySelectorAll<HTMLElement>('.tile-group').forEach(group => {
      const value = clamp((height - group.getBoundingClientRect().top) / (height * .75));
      group.querySelectorAll<HTMLElement>('.football-tile').forEach((tile, i) => {
        const stagger = clamp((value - i * .075) / .7);
        tile.style.transform = `translateY(${(1 - stagger) * 65}px)`;
        tile.style.opacity = String(.25 + stagger * .75);
      });
    });
  };
  useMotionValueEvent(scrollY, 'change', update);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const node = root.current;
    const sync = () => {
      if (!node) return;
      node.classList.toggle('scroll-enhanced', media.matches);
      if (!media.matches) {
        node.querySelectorAll<HTMLElement>('.paper-panel,.paper-content,.football-tile,.center-transition').forEach(element => { element.style.removeProperty('transform'); element.style.removeProperty('opacity'); });
        node.querySelectorAll<HTMLElement>('[data-count]').forEach(counter => { counter.textContent = counter.dataset.count ?? '0'; });
      }
    };
    sync();
    media.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    return () => { media.removeEventListener('change', sync); window.removeEventListener('resize', sync); node?.classList.remove('scroll-enhanced'); };
  }, [root]);
  return null;
}

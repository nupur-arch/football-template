'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { moreCopy as c } from '@/content/strings';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function ClosingLine({ index, text, progress, live }: { index: number; text: string; progress: MotionValue<number>; live: boolean }) {
  const fromLeft = index % 2 === 0;
  const x = useTransform(progress, value => `${(fromLeft ? -1 : 1) * (1 - clamp(value)) * 3}vw`);
  const scale = useTransform(progress, value => 0.96 + clamp(value) * 0.04);
  const opacity = useTransform(progress, value => 0.4 + clamp(value) * 0.6);
  return <motion.div className="closing-word" style={live ? { x, scale, opacity } : undefined}>{text}</motion.div>;
}

export function ClosingScene({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'center center'] });
  const patternX = useTransform(scrollYProgress, value => clamp(value) * -20);
  const patternY = useTransform(scrollYProgress, value => clamp(value) * 12);
  const cardY = useTransform(scrollYProgress, value => (1 - Math.min(1, clamp(value) / 0.6)) * 32);
  const cardOpacity = useTransform(scrollYProgress, value => 0.15 + Math.min(1, clamp(value) / 0.55) * 0.85);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setLive(!media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return <section ref={section} className="closing-section more-section" aria-label={c.closingTitle}>
    <motion.div className="closing-pattern" style={live ? { x: patternX, y: patternY } : undefined} aria-hidden="true" />
    <div className="closing-words container-shell" aria-hidden="true">
      {c.closingWords.map((word, index) => <ClosingLine key={word} index={index} text={word} progress={scrollYProgress} live={live} />)}
    </div>
    <motion.div className="container-shell closing-card" style={live ? { y: cardY, opacity: cardOpacity } : undefined}>{children}</motion.div>
  </section>;
}

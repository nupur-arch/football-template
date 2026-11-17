'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { moreCopy as c } from '@/content/strings';
import { ButtonLink } from '@/components/ui';

const STEPS = c.path.length - 1;
const search = (query: string) => '/search?q=' + encodeURIComponent(query);

function PathCard({ index, title, body, query, progress, live }: { index: number; title: string; body: string; query: string; progress: MotionValue<number>; live: boolean }) {
  const rotate = useTransform(progress, value => {
    const distance = Math.min(1, Math.abs(value * STEPS - index));
    return (index % 2 ? 1 : -1) * distance * 5;
  });
  const scale = useTransform(progress, value => 1 - Math.min(1, Math.abs(value * STEPS - index)) * 0.06);
  const opacity = useTransform(progress, value => 1 - Math.min(1, Math.abs(value * STEPS - index)) * 0.3);
  return <motion.article className={'path-card pastel-' + index} style={live ? { rotate, scale, opacity } : undefined}>
    <span>0{index + 1}</span>
    <h3>{title}</h3>
    <p>{body}</p>
    <ButtonLink href={search(query)}>{title}</ButtonLink>
  </motion.article>;
}

export function MatchdayPath() {
  const section = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const shift = useTransform(scrollYProgress, value => `translate3d(calc(${value} * -${STEPS} * (min(420px, 42vw) + 2rem)), 0, 0)`);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setLive(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return <section ref={section} className={live ? 'matchday-section more-section is-live' : 'matchday-section more-section'} aria-labelledby="path-title">
    <div className="matchday-stage">
      <div className="container-shell matchday-head">
        <div className="more-heading">
          <p className="home-eyebrow">{c.pathLabel}</p>
          <h2 id="path-title" className="home-section-title">{c.pathTitle}</h2>
        </div>
      </div>
      <div className="matchday-window">
        <svg className="matchday-curve" viewBox="0 0 1200 300" fill="none" aria-hidden="true"><path d="M-100 210 C200 -50 400 350 600 150 S1000 50 1300 180" stroke="currentColor" strokeWidth="2" strokeDasharray="3 12" /></svg>
        <div className="matchday-clip">
          <motion.div className="matchday-track" style={live ? { transform: shift } : undefined}>
            {c.path.map((step, index) => <PathCard key={step.title} index={index} title={step.title} body={step.body} query={step.query} progress={scrollYProgress} live={live} />)}
          </motion.div>
        </div>
      </div>
    </div>
  </section>;
}

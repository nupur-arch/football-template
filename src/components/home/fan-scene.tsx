'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { homeCopy as copy } from '@/content/strings';
import { ButtonLink } from '@/components/ui';

type Exchange = (typeof copy.fanExchanges)[number];

function unit(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function Letter({ char, index, count, from, progress }: { char: string; index: number; count: number; from: number; progress: MotionValue<number> }) {
  const start = 0.01 + (index / Math.max(count, 1)) * 0.14;
  const end = Math.min(start + 0.08, 0.25);
  const opacity = useTransform(progress, value => unit(value, start, end));
  const x = useTransform(progress, value => from * (1 - unit(value, start, end)));
  const skewX = useTransform(progress, value => (from > 0 ? -10 : 10) * (1 - unit(value, start, end)));
  return <m.span className="qa-letter" style={{ opacity, x, skewX }}>{char === ' ' ? '\u00a0' : char}</m.span>;
}

function Letters({ text, from, progress }: { text: string; from: number; progress: MotionValue<number> }) {
  const chars = Array.from(text);
  return chars.map((char, index) => <Letter key={text + index} char={char} index={index} count={chars.length} from={from} progress={progress} />);
}

function FlyingPill({ item, index, progress }: { item: Exchange; index: number; progress: MotionValue<number> }) {
  const start = 0.25 + index * 0.075;
  const end = Math.min(start + 0.2, 0.7);
  const mid = start + (end - start) * 0.55;
  const dx = 50 - item.x;
  const dy = 50 - item.y;
  const opacity = useTransform(progress, value => {
    const shown = unit(value, start, start + (mid - start) * 0.5);
    return value >= end ? 1 : shown;
  });
  const x = useTransform(progress, value => {
    const span = end - start;
    if (value <= start) return `${dx}cqw`;
    if (value >= end) return '0cqw';
    const t = (value - start) / span;
    const midT = (mid - start) / span;
    const bend = t < midT ? t / midT : (t - midT) / (1 - midT);
    const from = t < midT ? dx : dx * 0.42 + item.arc;
    const to = t < midT ? dx * 0.42 + item.arc : 0;
    return `${from + (to - from) * bend}cqw`;
  });
  const y = useTransform(progress, value => {
    const span = end - start;
    if (value <= start) return `${dy}cqh`;
    if (value >= end) return '0cqh';
    const t = (value - start) / span;
    const midT = (mid - start) / span;
    const bend = t < midT ? t / midT : (t - midT) / (1 - midT);
    const from = t < midT ? dy : dy * 0.42 - item.arc * 0.7;
    const to = t < midT ? dy * 0.42 - item.arc * 0.7 : 0;
    return `${from + (to - from) * bend}cqh`;
  });
  const scale = useTransform(progress, value => {
    const span = end - start;
    if (value <= start) return 0.3;
    if (value >= end) return 1;
    const t = (value - start) / span;
    const midT = (mid - start) / span;
    if (t < midT) return 0.3 + (0.82 - 0.3) * (t / midT);
    return 0.82 + (1 - 0.82) * ((t - midT) / (1 - midT));
  });
  const rotate = useTransform(progress, value => item.rotate * unit(value, start, end));
  const flipStart = 0.7 + index * 0.028;
  const flipEnd = Math.min(flipStart + 0.07, 0.9);
  const rotateX = useTransform(progress, value => 180 * unit(value, flipStart, flipEnd));
  return (
    <m.div className="qa-flight" style={{ opacity, x, y, scale, rotate }}>
      <m.div className="qa-card" style={{ rotateX }} aria-hidden="true">
        <span className="qa-chip qa-face">{item.question}</span>
        <span className="qa-chip qa-face qa-answer">{item.answer}</span>
      </m.div>
    </m.div>
  );
}

function Magnetic({ children, active }: { children: ReactNode; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <m.div
      ref={ref}
      className="qa-ask"
      style={{ x, y }}
      onMouseMove={active ? event => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        x.set((event.clientX - box.left - box.width / 2) * 0.28);
        y.set((event.clientY - box.top - box.height / 2) * 0.28);
      } : undefined}
      onMouseLeave={active ? () => { x.set(0); y.set(0); } : undefined}
    >
      <span className="qa-ring" aria-hidden="true" />
      {children}
    </m.div>
  );
}

export function FanScene() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const sceneOpacity = useTransform(scrollYProgress, value => unit(value, 0, 0.25));
  const pitchScrollY = useTransform(scrollYProgress, value => 36 * (1 - unit(value, 0, 0.25)));
  const pitchOpacity = useTransform(scrollYProgress, value => unit(value, 0, 0.22));
  const circleScale = useTransform(scrollYProgress, value => 0.35 + 0.65 * unit(value, 0.06, 0.25));
  const circleOpacity = useTransform(scrollYProgress, value => unit(value, 0.06, 0.2));
  const lightX = useTransform(pointerX, value => value * 22);
  const lightY = useTransform(pointerY, value => value * 16);
  const pitchX = useTransform(pointerX, value => value * 8);
  const pitchY = useTransform([pitchScrollY, pointerY], ([scroll, pointer]) => Number(scroll) + Number(pointer) * 8);
  const markX = useTransform(pointerX, value => `calc(-50% + ${value * 14}px)`);
  const markY = useTransform(pointerY, value => `calc(-50% + ${value * 12}px)`);
  const subOpacity = useTransform(scrollYProgress, value => unit(value, 0.9, 0.97));
  const subY = useTransform(scrollYProgress, value => 28 * (1 - unit(value, 0.9, 0.97)));
  const askOpacity = useTransform(scrollYProgress, value => unit(value, 0.93, 1));
  const askY = useTransform(scrollYProgress, value => 20 * (1 - unit(value, 0.93, 1)));
  const line = useTransform(scrollYProgress, value => unit(value, 0, 1));

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const sync = () => { setLive(!motion.matches); setFinePointer(pointer.matches); };
    sync();
    motion.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    return () => { motion.removeEventListener('change', sync); pointer.removeEventListener('change', sync); };
  }, []);

  useEffect(() => {
    if (!live || !finePointer) return;
    const node = stage.current;
    if (!node) return;
    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      pointerX.set((event.clientX - box.left) / box.width - 0.5);
      pointerY.set((event.clientY - box.top) / box.height - 0.5);
    };
    const leave = () => { pointerX.set(0); pointerY.set(0); };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); };
  }, [live, finePointer, pointerX, pointerY]);

  return (
    <section ref={section} className={live ? 'home-fans qa-live' : 'home-fans'} aria-labelledby="fans-title">
      <div ref={stage} className="fans-stage">
        <div className="qa-scene" aria-hidden="true">
          <m.div className="qa-lights" style={live ? { opacity: sceneOpacity, x: lightX, y: lightY } : undefined}>
            <span className="qa-lamp qa-lamp-a" />
            <span className="qa-lamp qa-lamp-b" />
            <span className="qa-beam qa-beam-a" />
            <span className="qa-beam qa-beam-b" />
          </m.div>
          <m.svg className="qa-pitch" viewBox="0 0 1200 700" style={live ? { opacity: pitchOpacity, x: pitchX, y: pitchY } : undefined}>
            <path d="M150 70h900l130 580H20Z" fill="#123c2c" />
            <path d="M150 70h900l130 580H20Z" fill="none" stroke="var(--lime)" strokeWidth="3" />
            <path d="M250 150h700l90 430H160Z" fill="none" stroke="#e7f6c8" strokeWidth="2" opacity="0.75" />
            <path d="M600 150v430M250 300h700l40 140H210Z" fill="none" stroke="#e7f6c8" strokeWidth="2" opacity="0.75" />
          </m.svg>
          <m.div className="qa-mark" style={live ? { opacity: circleOpacity, scale: circleScale, x: markX, y: markY } : undefined} />
        </div>
        <div className="qa-content container-shell">
          <p className="home-eyebrow text-white/80">{copy.fanLabel}</p>
          <h2 id="fans-title" className="qa-headlines">
            <span className="qa-line">{live ? <Letters text={copy.fanLeft} from={-42} progress={scrollYProgress} /> : copy.fanLeft}</span>
            <span className="qa-line qa-line-right">{live ? <Letters text={copy.fanRight} from={46} progress={scrollYProgress} /> : copy.fanRight}</span>
          </h2>
          <div className="qa-orbit">
            {copy.fanExchanges.map((item, index) => (
              <div key={item.question} className={index > 3 ? 'qa-slot qa-later' : 'qa-slot'} style={{ '--x': item.x + '%', '--y': item.y + '%' } as CSSProperties} aria-label={item.question + ' ' + item.answer}>
                {live ? <FlyingPill item={item} index={index} progress={scrollYProgress} /> : <span className="qa-chip qa-answer">{item.answer}</span>}
              </div>
            ))}
          </div>
          <div className="qa-footer">
            <m.p className="qa-sub" style={live ? { opacity: subOpacity, y: subY } : undefined}>{copy.fanBody}</m.p>
            <m.div style={live ? { opacity: askOpacity, y: askY } : undefined}>
              <Magnetic active={live && finePointer}><ButtonLink href="/search">{copy.ask}</ButtonLink></Magnetic>
            </m.div>
          </div>
        </div>
        <m.div className="qa-progress" style={live ? { scaleX: line } : undefined} aria-hidden="true" />
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import type { Article, Match } from '@/types';
import { strings } from '@/content/strings';
import { homeCopy as copy } from '@/content/strings';
import { SafeImage } from '@/components/safe-image';
import { Button, ButtonLink, Card } from '@/components/ui';

const slideDuration = 6000;
const number = (value: number) => String(value).padStart(2, '0');
const articleHref = (article: Article) => '/search?q=' + encodeURIComponent(article.title);

export function HomeHero() {
  const reduced = useReducedMotion();
  const [phrase, setPhrase] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduced !== false || paused) return;
    const timer = window.setInterval(() => setPhrase(value => (value + 1) % copy.phrases.length), 4200);
    return () => window.clearInterval(timer);
  }, [reduced, paused]);
  return <section className="home-hero container-shell" aria-labelledby="hero-title">
    <p className="home-eyebrow">{strings.heroLabel}</p>
    <h1 id="hero-title" className="home-display">{copy.heroLead}<br /><span className="phrase-window"><span key={phrase} className="hero-phrase">{copy.phrases[phrase]}<span className="text-accent">.</span></span></span></h1>
    <p className="mx-auto my-6 max-w-md leading-7 text-muted">{strings.heroBody}</p>
    <div className="flex flex-wrap items-center justify-center gap-3"><ButtonLink href="#stories">{strings.explore}</ButtonLink><Button aria-label={paused ? copy.playHero : copy.pauseHero} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</Button></div>
    <div className={'hero-mosaic mosaic-state-' + phrase} aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i} className={'mosaic-tile mosaic-tile-' + i}><i /></span>)}</div>
  </section>;
}

export function StoryDeck({ articles }: { articles: Article[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [drag, setDrag] = useState(0);
  const pointer = useRef<{ x: number; id: number } | null>(null);
  const dragged = useRef(false);
  const rail = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const count = articles.length;
  const running = mounted && reduced === false && !paused && !hovered && !focused && count > 1;
  const select = (next: number) => {
    setIndex((next + count) % count);
    elapsed.current = 0;
    setProgress(0);
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const container = rail.current;
    const active = container?.children[index] as HTMLElement | undefined;
    if (container && active) container.scrollTo({ left: active.offsetLeft - container.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2, behavior: reduced ? 'instant' : 'smooth' });
  }, [index, reduced]);
  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) elapsed.current += now - previous;
      previous = now;
      if (elapsed.current >= slideDuration) {
        elapsed.current = 0;
        setIndex(value => (value + 1) % count);
      }
      setProgress(elapsed.current / slideDuration);
    }, 50);
    return () => window.clearInterval(timer);
  }, [running, count]);

  return <section id="stories" className="container-shell home-stories" aria-labelledby="stories-title">
    <div className="section-heading"><div><p className="home-eyebrow">{copy.storiesLabel}</p><h2 id="stories-title" className="home-section-title">{copy.stories}</h2></div><span className="text-sm text-muted">{number(count)} {strings.news}</span></div>
    {!count ? <Card className="p-10 text-muted">{strings.empty}</Card> : <div role="region" aria-roledescription="carousel" aria-label={copy.carousel}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
      <div className="story-deck" style={{ '--drag': drag + 'px' } as React.CSSProperties}
        onPointerDown={event => { if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return; pointer.current = { x: event.clientX, id: event.pointerId }; dragged.current = false; }}
        onPointerMove={event => { if (!pointer.current) return; const delta = event.clientX - pointer.current.x; if (Math.abs(delta) > 12) { dragged.current = true; event.currentTarget.setPointerCapture(event.pointerId); setDrag(Math.max(-90, Math.min(90, delta))); } }}
        onPointerUp={event => { if (pointer.current) { const delta = event.clientX - pointer.current.x; if (Math.abs(delta) > 45) select(index + (delta < 0 ? 1 : -1)); } pointer.current = null; setDrag(0); }}
        onPointerCancel={() => { pointer.current = null; setDrag(0); }}>
        {articles.map((article, i) => {
          const depth = (i - index + count) % count;
          return <article key={article.id} className={'story-slide depth-' + (depth < 3 ? depth : 'hidden')} aria-hidden={depth !== 0} inert={depth !== 0} aria-roledescription="slide" aria-label={`${i + 1} / ${count}`} data-slide={i + 1}>
            <SafeImage src={article.image} alt="" fill sizes="(max-width: 768px) 100vw, 1150px" className="object-cover" />
            <div className="story-shade" />
            <div className="story-content"><span className="story-category">{article.category.name}</span><div className="max-w-3xl"><p className="mb-3 text-sm text-white/80">{article.author} Â· {article.readingMinutes} {strings.minutes}</p><h3 className="line-clamp-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-.045em] md:text-5xl"><Link href={articleHref(article)} draggable={false} onClick={event => { if (dragged.current) event.preventDefault(); }}>{article.title}</Link></h3><p className="mt-4 hidden max-w-xl text-white/80 sm:line-clamp-2">{article.excerpt}</p></div></div>
          </article>;
        })}
      </div>
      <div className="deck-controls"><div className="story-counter" aria-live={running ? 'off' : 'polite'} aria-atomic="true"><span key={index}>{number(index + 1)}</span><span className="text-muted"> / {number(count)}</span></div>
        <div className="slide-progress" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ transform: `scaleX(${progress})` }} /></div>
        <div className="flex gap-2"><Button aria-label={copy.previous} disabled={count < 2} onClick={() => select(index - 1)}><ArrowLeft size={18} /></Button><Button aria-label={paused ? copy.play : copy.pause} aria-pressed={paused} disabled={!!reduced || count < 2} onClick={() => setPaused(!paused)}>{paused || reduced ? <Play size={18} /> : <Pause size={18} />}</Button><Button aria-label={copy.next} disabled={count < 2} onClick={() => select(index + 1)}><ArrowRight size={18} /></Button></div>
      </div>
      <div ref={rail} className="story-rail" aria-label={copy.stories}>{articles.map((article, i) => <button key={article.id} type="button" className="story-thumb" aria-label={`${copy.story} ${number(i + 1)}: ${article.title}`} aria-current={i === index ? 'true' : undefined} onClick={() => select(i)}><span className="thumb-image"><SafeImage src={article.image} alt="" fill sizes="88px" className="object-cover" /></span><span>{number(i + 1)}</span></button>)}</div>
    </div>}
  </section>;
}

function Countdown({ kickoff }: { kickoff: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const seconds = now === null ? null : Math.max(0, Math.floor((Date.parse(kickoff) - now) / 1000));
  return <><time dateTime={kickoff} className="text-sm text-muted">{new Date(kickoff).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC</time><p className="mt-2 font-display text-xl tabular-nums" aria-label={copy.countdown}>{seconds === null ? copy.scheduled : seconds === 0 ? copy.kickoff : `${Math.floor(seconds / 86400)}${copy.days} ${number(Math.floor(seconds / 3600) % 24)}${copy.hours} ${number(Math.floor(seconds / 60) % 60)}${copy.minutes} ${number(seconds % 60)}${copy.seconds}`}</p></>;
}

export function MatchStrip({ matches }: { matches: Match[] }) {
  const live = matches.filter(match => match.status === 'live');
  const next = matches.filter(match => match.status === 'scheduled').sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))[0];
  return <section className="container-shell match-strip" aria-label={strings.score}><div className="match-live"><p className="home-eyebrow"><span className="live-dot" />{copy.live}</p>{live.length ? <div className="live-matches">{live.map(match => <div key={match.id}><p className="text-xs text-muted">{match.competition}</p><p className="mt-2 font-display text-xl font-semibold">{match.homeTeam.shortName} <span className="mx-2 tabular-nums">{match.homeScore ?? 'â€“'} : {match.awayScore ?? 'â€“'}</span> {match.awayTeam.shortName}</p></div>)}</div> : <p className="text-muted">{copy.noLive}</p>}<p className="mt-3 text-xs text-muted">{copy.fixtureNote}</p></div><div className="next-match"><p className="home-eyebrow">{copy.nextMatch}</p>{next ? <><p className="mb-2 font-semibold">{next.homeTeam.shortName} / {next.awayTeam.shortName}</p><Countdown kickoff={next.kickoff} /></> : <p className="text-muted">{copy.noNext}</p>}</div></section>;
}

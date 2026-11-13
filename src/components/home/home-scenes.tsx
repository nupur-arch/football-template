'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';
import { homeCopy as copy } from '@/content/strings';
import { strings } from '@/content/strings';
import type { Article } from '@/types';
import { Logo } from '@/components/logo';
import { SafeImage } from '@/components/safe-image';
import { Reveal } from '@/components/motion';
import { ButtonLink, Card } from '@/components/ui';

const ScrollEffects = dynamic(() => import('./scroll-effects'), { ssr: false });

export function HomeScenes({ articles }: { articles: Article[] }) {
  const stack = useRef<HTMLDivElement>(null);
  const fans = useRef<HTMLElement>(null);
  return <>
    <section className="home-intro grid-paper" aria-labelledby="intro-title"><div className="container-shell intro-layout">
      <Reveal><p className="home-eyebrow">{copy.introLabel}</p><h2 id="intro-title" className="home-section-title max-w-xl">{copy.intro}</h2><p className="mt-6 max-w-xl leading-8 text-muted">{copy.introBody}</p></Reveal>
      <Reveal><div className="intro-orbit"><span className="orbit-shape orbit-one" aria-hidden="true" /><span className="orbit-shape orbit-two" aria-hidden="true" /><span className="orbit-shape orbit-three" aria-hidden="true" /><span className="orbit-shape orbit-four" aria-hidden="true" /><Logo /></div></Reveal>
    </div></section>
    <section id="latest" className="container-shell home-latest" aria-labelledby="latest-title"><div className="section-heading"><div><p className="home-eyebrow">{copy.latestLabel}</p><h2 id="latest-title" className="home-section-title">{copy.latest}</h2></div><ButtonLink href="/search?type=news">{copy.allNews}</ButtonLink></div>
      {!articles.length ? <Card className="p-10 text-muted">{strings.empty}</Card> : <div ref={stack} className="news-stack">{articles.map((article, i) => <article key={article.id} className={'stack-card stack-color-' + i} style={{ '--card-index': i } as React.CSSProperties}>
        <div className="stack-visual"><SafeImage src={article.image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /><span className="stack-number">0{i + 1}</span></div>
        <div className="stack-copy"><p className="home-eyebrow">{article.category.name} / {article.readingMinutes} {strings.minutes}</p><h3 className="line-clamp-3 font-display text-3xl font-semibold leading-tight tracking-[-.045em] md:text-4xl"><Link href={'/search?q=' + encodeURIComponent(article.title)}>{article.title}</Link></h3><p className="mt-5 line-clamp-3 leading-7">{article.excerpt}</p><p className="mt-6 text-sm">{article.author}</p><Link className="mt-8 inline-flex w-fit items-center gap-4 rounded-full border border-current px-6 py-3 font-semibold hover:opacity-65" href={'/search?q=' + encodeURIComponent(article.title)}>{strings.read}<span aria-hidden="true">↗</span></Link></div>
      </article>)}</div>}
    </section>
    <section ref={fans} className="home-fans" aria-labelledby="fans-title"><div className="fans-stage">
      <div className="fans-background" aria-hidden="true"><SafeImage src="/images/home-stadium.svg" alt="" fill sizes="100vw" className="object-cover" /></div><div className="fans-shade" />
      <div className="fans-content container-shell"><p className="home-eyebrow text-white/80">{copy.fanLabel}</p><h2 id="fans-title" className="fans-headlines"><span>{copy.fanLeft}</span><span>{copy.fanRight}</span></h2>
        <div className="fan-questions">{copy.questions.map((question, i) => <span className={'fan-pill fan-pill-' + i} key={question}>{question}</span>)}</div>
        <div className="fans-footer"><p className="mb-5 text-lg text-white/80">{copy.fanBody}</p><ButtonLink href="/search">{copy.ask}</ButtonLink></div>
      </div>
    </div></section>
    <ScrollEffects stack={stack} fans={fans} />
  </>;
}

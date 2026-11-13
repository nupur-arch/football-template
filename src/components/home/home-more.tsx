'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useId, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Trophy, Goal, Shapes } from 'lucide-react';
import { moreCopy as c } from '@/content/strings';
import { strings } from '@/content/strings';
import { Button, ButtonLink, Card } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { SafeImage } from '@/components/safe-image';
import type { Article, Match, Player, Standing } from '@/types';

const MoreScroll = dynamic(() => import('./more-scroll'), { ssr: false });
type Data = { articles: Article[]; matches: Match[]; standings: Standing[]; players: Player[] };
const search = (query: string) => '/search?q=' + encodeURIComponent(query);

function Heading({ label, title, id }: { label?: string; title: string; id?: string }) {
  return <div className="more-heading"><p className="home-eyebrow">{label}</p><h2 id={id} className="home-section-title">{title}</h2></div>;
}
function Table({ rows }: { rows: Standing[] }) {
  return rows.length ? <table className="more-table"><caption className="sr-only">{c.table}</caption><thead><tr><th scope="col">#</th><th scope="col">{strings.teams}</th><th scope="col">{c.played}</th><th scope="col">{c.points}</th></tr></thead><tbody>{rows.slice(0, 4).map(row => <tr key={row.id}><td>{row.rank}</td><th scope="row"><Link href={search(row.team.name)}>{row.team.name}</Link></th><td>{row.played}</td><td>{row.points}</td></tr>)}</tbody></table> : <p>{strings.empty}</p>;
}
function Scores({ matches }: { matches: Match[] }) {
  return <div className="more-scores">{matches.length ? matches.slice(0, 2).map(match => <div key={match.id}><p className="home-eyebrow">{match.competition} · {match.status}</p><div className="score-line"><span>{match.homeTeam.shortName}</span><strong>{match.homeScore ?? '–'} : {match.awayScore ?? '–'}</strong><span>{match.awayTeam.shortName}</span></div></div>) : <p>{strings.empty}</p>}</div>;
}
function Leaders({ players, metric = 'goals' }: { players: Player[]; metric?: 'goals' | 'assists' }) {
  return players.length ? <ol className="more-leaders">{[...players].sort((a, b) => b[metric] - a[metric]).slice(0, 3).map(player => <li key={player.id}><Link href={search(player.name)}>{player.name}</Link><strong>{player[metric]} <span>{c[metric]}</span></strong></li>)}</ol> : <p>{strings.empty}</p>;
}
function Newsletter({ final = false }: { final?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState(false);
  return <Card className="newsletter-card"><p className="home-eyebrow">{c.newsletterLabel}</p><h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">{final ? c.closingTitle : c.newsletterTitle}</h3><p className="my-5 leading-7 text-muted">{final ? c.closingBody : c.newsletterBody}</p><form onSubmit={event => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email');
    try { localStorage.setItem('touchline-newsletter-demo', String(email)); setSaved(true); setStatus(c.newsletterSuccess); } catch { setStatus(c.newsletterError); }
  }}><label htmlFor={id}>{c.email}</label><div className="newsletter-fields"><input id={id} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" aria-describedby={id + '-note'} onChange={() => { setSaved(false); setStatus(''); }} /><Button type="submit" disabled={saved}>{c.submit}<ArrowUpRight size={18} aria-hidden="true" /></Button></div><p className="mt-3 text-xs leading-5 text-muted" id={id + '-note'}>{c.newsletterNote}</p><p role="status" className="mt-3 text-sm">{status}</p></form></Card>;
}

export function HomeMore({ articles, matches, standings, players }: Data) {
  const root = useRef<HTMLDivElement>(null);
  const [feature, setFeature] = useState(0);
  const [tileGroup, setTileGroup] = useState(0);
  const [voice, setVoice] = useState(0);
  const [league, setLeague] = useState(standings[0]?.team.league ?? '');
  const [metric, setMetric] = useState<'goals' | 'assists'>('goals');
  const leagues = [...new Set(standings.map(row => row.team.league))];
  const categories = [...new Map(articles.map(article => [article.category.id, article.category])).values()];
  const competitions = [...new Set(matches.map(match => match.competition))];
  const tileGroups = [leagues, competitions, categories.map(category => category.name)];
  const counts = [articles.filter(a => a.featured).length, new Set(standings.map(row => row.team.id)).size, players.length];
  const featureContent = [<Scores key="scores" matches={matches} />, <Table key="table" rows={standings} />, <Leaders key="players" players={players} />, <div key="transfers"><p className="text-3xl font-display">{c.features[3].title}</p><p className="my-6 leading-7">{c.features[3].body}</p><ButtonLink href={search('transfers')}>{c.cta}</ButtonLink></div>, <div key="news">{articles.slice(0, 2).map(article => <Link key={article.id} className="feature-story" href={search(article.title)}><span className="feature-image"><SafeImage src={article.image} alt="" fill sizes="(max-width: 767px) 80vw, 240px" className="object-cover" /></span><span className="line-clamp-2">{article.title}</span></Link>)}{!articles.length && <p>{strings.empty}</p>}</div>];
  return <div ref={root} className="home-more">
    <section className="match-showcase more-section" aria-labelledby="center-title"><div className="center-transition" aria-hidden="true" /><div className="container-shell relative"><Heading label={c.centerLabel} title={c.centerTitle} id="center-title" /><p className="max-w-xl text-lg leading-8 text-muted">{c.centerBody}</p><div className="paper-stack">{[c.live, c.table, c.playerStats].map((title, index) => <article className={'paper-panel pastel-' + index} key={title}><p className="home-eyebrow">0{index + 1} / {title}</p><div className="paper-content">{index === 0 ? <Scores matches={matches} /> : index === 1 ? <Table rows={standings} /> : <Leaders players={players} />}</div></article>)}</div><p className="text-xs text-muted">{c.fixtureNote}</p></div></section>
    <section className="container-shell more-section" aria-labelledby="everything-title"><Heading label={c.allLabel} title={c.allTitle} id="everything-title" /><div className="overview-grid"><Reveal><Card className="overview-card"><h3>{c.leagues}</h3><p className="my-4 text-sm text-muted">{c.leagueNote}</p><div className="league-tabs" role="group" aria-label={c.leagues}>{leagues.map(name => <button key={name} aria-pressed={league === name} onClick={() => setLeague(name)}>{name}</button>)}</div><Table rows={standings.filter(row => row.team.league === league)} /></Card></Reveal><Reveal><Card className="overview-card"><h3>{c.goals}</h3><Leaders players={players} /></Card></Reveal><Reveal><Card className="overview-card"><h3>{c.assists}</h3><Leaders players={players} metric="assists" /></Card></Reveal></div><div className="more-counts">{counts.map((count, i) => <div key={c.stats[i]}><strong data-count={count}>{count}</strong><p>{c.stats[i]}</p></div>)}</div><div className="connection-diagram"><h3>{c.connectionLeft}</h3><div className="connection-ring"><span>{c.connection}</span></div><h3>{c.connectionRight}</h3></div><Reveal><div className="lime-callout"><h3>{c.ctaTitle}</h3><ButtonLink href="/search">{c.cta}</ButtonLink></div></Reveal></section>
    <section className="feature-showcase more-section grid-paper" aria-labelledby="features-title"><div className="container-shell"><Heading label={c.featuresLabel} title={c.featuresTitle} id="features-title" /><div className="feature-stage"><div className="feature-text">{c.features.map((item, index) => <article className={'feature-description ' + (index === feature ? 'is-selected' : '')} key={item.title}><p className="home-eyebrow">0{index + 1} / 05</p><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="feature-layers">{c.features.map((item, index) => <article key={item.title} className={'feature-panel pastel-' + index + (index === feature ? ' is-selected' : '')} style={{ '--layer': index } as CSSProperties}><h3>{item.title}</h3><p className="feature-mobile-body">{item.body}</p>{featureContent[index]}</article>)}</div></div></div></section>
    <section className="container-shell more-section tile-section" aria-labelledby="tiles-title"><Heading label={c.tilesLabel} title={c.tilesTitle} id="tiles-title" /><div className="tile-groups" role="region" aria-roledescription="carousel" aria-label={c.tilesTitle}>{tileGroups.map((group, groupIndex) => <div className={'tile-group' + (groupIndex === tileGroup ? ' is-active' : '')} aria-hidden={groupIndex === tileGroup ? undefined : true} key={c.tileTypes[groupIndex]}><div className="tile-group-head"><h3 className="home-eyebrow">{c.tileTypes[groupIndex]}</h3><p className="tile-group-count">0{groupIndex + 1} / 03</p></div><div className="football-tiles">{group.map((name, index) => { const Icon = [Trophy, Goal, Shapes][(index + groupIndex) % 3]; return <Link className={'football-tile pastel-' + (index + groupIndex) % 5} href={search(name)} key={name}><Icon size={62} strokeWidth={1.2} aria-hidden="true" /><span>{name}</span><ArrowUpRight aria-hidden="true" /></Link>; })}{!group.length && <Card className="p-6">{strings.empty}</Card>}</div></div>)}</div><div className="tile-pagination" role="tablist" aria-label={c.tilesTitle}>{c.tileTypes.map((label, index) => <button key={label} type="button" role="tab" aria-selected={tileGroup === index} className={tileGroup === index ? 'is-active' : ''} onClick={() => setTileGroup(index)}>{label}</button>)}</div></section>
    <section className="container-shell more-section" aria-labelledby="voices-title"><Heading label={c.voicesLabel} title={c.voicesTitle} id="voices-title" /><div className="voice-carousel" role="region" aria-roledescription="carousel" aria-label={c.voicesTitle}><div aria-live="polite" aria-atomic="true"><article className="voice-card" key={voice}><div className="voice-avatar" aria-hidden="true">{c.voices[voice].initials}</div><blockquote>“{c.voices[voice].quote}”</blockquote><p className="font-semibold">{c.voices[voice].name}</p><p>{c.voices[voice].club}</p></article></div><div className="voice-controls"><Button aria-label={c.previous} onClick={() => setVoice((voice + c.voices.length - 1) % c.voices.length)}><ArrowLeft size={20} /></Button><span>{String(voice + 1).padStart(2, '0')} / 0{c.voices.length}</span><Button aria-label={c.next} onClick={() => setVoice((voice + 1) % c.voices.length)}><ArrowRight size={20} /></Button></div></div><p className="mt-4 text-xs text-muted">{c.voicesNote}</p></section>
    <section className="matchday-section more-section" aria-labelledby="path-title"><div className="container-shell"><Heading label={c.pathLabel} title={c.pathTitle} id="path-title" /></div><div className="matchday-window"><svg className="matchday-curve" viewBox="0 0 1200 300" fill="none" aria-hidden="true"><path d="M-100 210 C200 -50 400 350 600 150 S1000 50 1300 180" stroke="currentColor" strokeWidth="2" strokeDasharray="3 12" /></svg><div className="matchday-track">{c.path.map((step, index) => <article className={'path-card pastel-' + index} key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p><ButtonLink href={search(step.query)}>{step.title}</ButtonLink></article>)}</div></div></section>
    <section className="container-shell more-section" aria-labelledby="newsletter-title"><h2 id="newsletter-title" className="sr-only">{c.newsletterTitle}</h2><div className="newsletter-grid"><Newsletter /><div className="newsletter-stats pastel-1"><p className="home-eyebrow">{c.toggleTitle}</p><div role="group" aria-label={c.ranking} className="stat-toggle">{(['goals', 'assists'] as const).map(value => <button key={value} aria-pressed={metric === value} onClick={() => setMetric(value)}>{c[value]}</button>)}</div><div key={metric} className="toggle-result" aria-live="polite"><Leaders players={players} metric={metric} /></div><p className="mt-8 text-sm">{counts[2]} {c.stats[2]}</p></div></div><div className="faq-grid"><h3 className="home-section-title">{c.faqTitle}</h3><div>{c.faqs.map(faq => <details className="home-faq" key={faq.question}><summary>{faq.question}<span aria-hidden="true" className="faq-symbol">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>
    <section className="closing-section more-section" aria-label={c.closingTitle}><div className="closing-words container-shell" aria-hidden="true">{c.closingWords.map(word => <div className="closing-word" key={word}>{word}</div>)}</div><div className="container-shell"><Newsletter final /></div></section>
    <MoreScroll root={root} onFeature={setFeature} />
  </div>;
}


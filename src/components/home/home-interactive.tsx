'use client';

import { useEffect, useState } from 'react';
import type { Match } from '@/types';
import { strings } from '@/content/strings';
import { homeCopy as copy } from '@/content/strings';

const number = (value: number) => String(value).padStart(2, '0');

function Countdown({ kickoff }: { kickoff: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const seconds = now === null ? null : Math.max(0, Math.floor((Date.parse(kickoff) - now) / 1000));
  return <><time dateTime={kickoff} className="text-sm text-muted">{new Date(kickoff).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC</time><p className="mt-2 font-display text-xl tabular-nums" aria-label={copy.countdown}>{seconds === null ? copy.scheduled : seconds === 0 ? copy.kickoff : `${Math.floor(seconds / 86400)}${copy.days} ${number(Math.floor(seconds / 3600) % 24)}${copy.hours} ${number(Math.floor(seconds / 60) % 60)}${copy.minutes} ${number(seconds % 60)}${copy.seconds}`}</p></>;
}

export function MatchStrip({ matches }: { matches: Match[] }) {
  const live = matches.filter(match => match.status === 'live');
  const next = matches.filter(match => match.status === 'scheduled').sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))[0];
  return <section className="container-shell match-strip" aria-label={strings.score}><div className="match-live"><p className="home-eyebrow"><span className="live-dot" />{copy.live}</p>{live.length ? <div className="live-matches">{live.map(match => <div key={match.id}><p className="text-xs text-muted">{match.competition}</p><p className="mt-2 font-display text-xl font-semibold">{match.homeTeam.shortName} <span className="mx-2 tabular-nums">{match.homeScore ?? '–'} : {match.awayScore ?? '–'}</span> {match.awayTeam.shortName}</p></div>)}</div> : <p className="text-muted">{copy.noLive}</p>}<p className="mt-3 text-xs text-muted">{copy.fixtureNote}</p></div><div className="next-match"><p className="home-eyebrow">{copy.nextMatch}</p>{next ? <><p className="mb-2 font-semibold">{next.homeTeam.shortName} / {next.awayTeam.shortName}</p><Countdown kickoff={next.kickoff} /></> : <p className="text-muted">{copy.noNext}</p>}</div></section>;
}

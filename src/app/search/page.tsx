import type { Metadata } from 'next';
import { SearchPanel } from '@/components/search';
import { MarkdownContent } from '@/components/markdown-content';
import { SafeImage } from '@/components/safe-image';
import { Card } from '@/components/ui';
import { search, getTeams, getPlayers } from '@/services';
import { strings } from '@/content/strings';

export async function generateMetadata(): Promise<Metadata> {
  return { title: strings.search, alternates: { canonical: '/search' }, robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const { q = '', type } = await searchParams;
  const results = q.trim() ? await search(q) : {
    news: [],
    teams: type === 'teams' ? await getTeams() : [],
    players: type === 'players' ? await getPlayers() : [],
  };
  const hasResults = results.news.length + results.teams.length + results.players.length > 0;
  return (
    <main id="main" className="container-shell min-h-[55vh] max-w-3xl py-16">
      <p className="mb-4 text-xs uppercase tracking-widest text-muted">{strings.searchHint}</p>
      <h1 className="mb-10 font-display text-5xl font-bold tracking-[-.06em]">{strings.search}</h1>
      <SearchPanel key={q} initialQuery={q} pageMode />
      {(q.trim() || type) && <section className="mt-10 space-y-8" aria-label={strings.searchResults}>
        {q && <p className="text-sm text-muted">{strings.resultsFor} <strong className="text-ink">{q}</strong></p>}
        {!hasResults && <p className="rounded-card border border-line p-8 text-muted">{strings.noResults}</p>}
        {results.news.length > 0 && <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">{strings.news} <span className="text-muted">({results.news.length})</span></h2>
          <div className="space-y-4">{results.news.map(article => <Card key={article.id} className="p-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted">{article.category.name}</p>
            <h3 className="line-clamp-3 font-display text-2xl font-semibold tracking-tight">{article.title}</h3>
            <p className="mt-3 leading-7 text-muted">{article.excerpt}</p>
            <details className="smooth-details mt-4"><summary className="hover-link inline-flex items-center gap-2 rounded-full py-2 text-sm font-semibold">{strings.read}<span aria-hidden="true" className="faq-symbol"><i /><i /></span></summary><div className="smooth-panel"><MarkdownContent content={article.content} /></div></details>
          </Card>)}</div>
        </div>}
        {results.teams.length > 0 && <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">{strings.teams}</h2>
          <div className="grid gap-4 sm:grid-cols-2">{results.teams.map(team => <Card key={team.id} className="flex items-center gap-4 p-5">
            <SafeImage src={team.crest} alt="" width={64} height={64} sizes="64px" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0"><h3 className="line-clamp-2 font-semibold">{team.name}</h3><p className="mt-1 text-xs text-muted">{team.league}</p></div>
          </Card>)}</div>
        </div>}
        {results.players.length > 0 && <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">{strings.players}</h2>
          <div className="grid gap-4 sm:grid-cols-2">{results.players.map(player => <Card key={player.id} className="p-5">
            <h3 className="line-clamp-2 font-semibold">{player.name}</h3><p className="mt-1 text-sm text-muted">{player.position}</p>
            <p className="mt-4 text-xs text-muted">{strings.goals}: {player.goals} · {strings.assists}: {player.assists}</p>
          </Card>)}</div>
        </div>}
      </section>}
    </main>
  );
}

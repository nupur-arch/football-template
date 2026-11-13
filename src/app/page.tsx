import type { Metadata } from 'next';
import { getArticles, getMatches } from '@/services';
import { siteConfig } from '@/content/site.config';
import { strings } from '@/content/strings';
import { HomeHero, StoryDeck, MatchStrip } from '@/components/home/home-interactive';
import { HomeScenes } from '@/components/home/home-scenes';
import './home.css';

export async function generateMetadata(): Promise<Metadata> {
  return { title: siteConfig.name + ' — ' + strings.tagline, alternates: { canonical: '/' } };
}
export default async function Home() {
  const [articles, matches] = await Promise.all([getArticles(), getMatches()]);
  const featured = articles.filter(article => article.featured).slice(0, 20);
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: strings.home, item: siteConfig.url }] },
    ...featured.map(article => ({ '@type': 'NewsArticle', headline: article.title, datePublished: article.publishedAt,
      author: { '@type': 'Organization', name: article.author }, publisher: { '@type': 'Organization', name: siteConfig.name },
      image: new URL(article.image, siteConfig.url).href })),
  ] };
  return <main id="main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <HomeHero /><StoryDeck articles={featured} /><MatchStrip matches={matches} />
    <HomeScenes articles={articles.slice(0, 4)} />
  </main>;
}

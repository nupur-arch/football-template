import type { Article, Banner, Match, Player, Standing, Team } from '@/types';
export const teams: Team[] = [ ['arsenal','Arsenal','ARS'], ['liverpool','Liverpool','LIV'], ['city','Manchester City','MCI'], ['chelsea','Chelsea','CHE'], ['villa','Aston Villa','AVL'], ['brighton','Brighton & Hove Albion','BHA'] ].map(([id,name,shortName]) => ({ id, name, shortName, crest: '/images/fallback.svg', league: 'Premier League' }));
export const players: Player[] = [ ['saka','Bukayo Saka','arsenal','Forward'], ['salah','Mohamed Salah','liverpool','Forward'], ['haaland','Erling Haaland','city','Forward'], ['palmer','Cole Palmer','chelsea','Midfielder'], ['watkins','Ollie Watkins','villa','Forward'], ['mitoma','Kaoru Mitoma','brighton','Winger'] ].map(([id,name,teamId,position], i) => ({id,name,teamId,position,goals:14-i,assists:8-i,image:'/images/fallback.svg'}));
const titles = ['Arsenal and the art of building from the back','The next chapter of Champions League nights','Why the number ten still matters','Liverpool find a new rhythm in midfield','Inside the academy: tomorrow starts here','Saka and the joy of playing wide','The quiet science behind the perfect press','Manchester City: space is the extra player','A weekend for the unexpected heroes','Chelsea’s young core takes the next step','The beautiful game beyond the big stadiums','How Brighton keep finding the next big thing','Aston Villa and a city dreaming bigger','The full-back is rewriting the rulebook','Five fixtures to make time for this weekend','From the terraces: a story of belonging','What makes a great captain?','The set-piece revolution in the Premier League','On the training ground with the goalkeepers','The moments that make a football season'];
export const articles: Article[] = titles.map((title,i) => ({ id: `article-${i+1}`, slug: title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''), title, excerpt: 'A closer look at the ideas, people and small details shaping the game we love.', content: `## The view from the touchline

${title}. Football is built on **connections**: between players, supporters and the places they call home.

- The tactical detail
- The people behind the performance
- What comes next

Explore the [Premier League](https://www.premierleague.com/) for competition information.

![Touchline pitch illustration](/images/fallback.svg)`, image: '/images/fallback.svg', category: {id: i%2 ? 'culture':'analysis',name:i%2?'Culture':'Analysis',slug:i%2?'culture':'analysis'}, publishedAt: new Date(Date.UTC(2026,10,13-i,9)).toISOString(), author: 'Touchline editorial', featured: true, readingMinutes: 4+i%4 }));
export const matches: Match[] = [{id:'match-1',homeTeam:teams[0],awayTeam:teams[1],homeScore:2,awayScore:1,kickoff:'2026-11-13T15:00:00Z',status:'live',competition:'Premier League'},{id:'match-2',homeTeam:teams[2],awayTeam:teams[3],homeScore:null,awayScore:null,kickoff:'2026-11-14T17:30:00Z',status:'scheduled',competition:'Premier League'}];
export const standings: Standing[] = teams.map((team,i)=>({id:`standing-${team.id}`,team,rank:i+1,played:11,won:8-i,drawn:2,lost:1+i,goalsFor:26-i*2,goalsAgainst:8+i,points:(8-i)*3+2}));
export const banners: Banner[] = articles.filter(article => article.featured).slice(0, 20).map(article => ({ id: article.id, title: article.title, description: article.category.name, image: article.image, href: '/search?q=' + encodeURIComponent(article.title) }));
export const mockData = { articles, matches, standings, teams, players, banners };

export type Category = { id: string; name: string; slug: string };
export type Article = { id: string; slug: string; title: string; excerpt: string; content: string; image: string; category: Category; publishedAt: string; author: string; featured: boolean; readingMinutes: number };
export type Team = { id: string; name: string; shortName: string; crest: string; league: string };
export type Player = { id: string; name: string; teamId: string; position: string; goals: number; assists: number; image: string };
export type Match = { id: string; homeTeam: Team; awayTeam: Team; homeScore: number | null; awayScore: number | null; kickoff: string; status: 'live' | 'scheduled' | 'finished'; competition: string };
export type Standing = { id: string; team: Team; rank: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number };
export type Banner = { id: string; title: string; description: string; image: string; href: string };
export type SearchResults = { news: Article[]; teams: Team[]; players: Player[] };

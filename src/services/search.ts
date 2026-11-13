import { getArticles } from './articles';
import { getTeams } from './teams';
import { getPlayers } from './players';
import type { SearchResults } from '@/types';
export async function search(query: string, signal?: AbortSignal): Promise<SearchResults> {
 const q=query.trim().toLocaleLowerCase(); if (!q) return {news:[],teams:[],players:[]};
 const [news,teams,players]=await Promise.all([getArticles(signal),getTeams(signal),getPlayers(signal)]);
 return {news:news.filter(x=>`${x.title} ${x.excerpt} ${x.category.name}`.toLocaleLowerCase().includes(q)),teams:teams.filter(x=>`${x.name} ${x.league}`.toLocaleLowerCase().includes(q)),players:players.filter(x=>x.name.toLocaleLowerCase().includes(q))};
}

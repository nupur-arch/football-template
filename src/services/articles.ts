import { apiList } from '@/lib/api/client';
import { mapApiArticle } from '@/lib/api/mappers';
export const getArticles = (signal?: AbortSignal) => apiList('articles', mapApiArticle, signal);
export async function getArticle(slug: string) { return (await getArticles()).find(article => article.slug === slug) ?? null; }

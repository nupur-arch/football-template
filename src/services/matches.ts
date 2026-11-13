import { apiList } from '@/lib/api/client';
import { mapApiMatch } from '@/lib/api/mappers';
export const getMatches = (signal?: AbortSignal) => apiList('matches', mapApiMatch, signal);

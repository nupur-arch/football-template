import { apiList } from '@/lib/api/client';
import { mapApiStanding } from '@/lib/api/mappers';
export const getStandings = (signal?: AbortSignal) => apiList('standings', mapApiStanding, signal);

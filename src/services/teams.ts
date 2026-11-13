import { apiList } from '@/lib/api/client';
import { mapApiTeam } from '@/lib/api/mappers';
export const getTeams = (signal?: AbortSignal) => apiList('teams', mapApiTeam, signal);

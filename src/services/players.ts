import { apiList } from '@/lib/api/client';
import { mapApiPlayer } from '@/lib/api/mappers';
export const getPlayers = (signal?: AbortSignal) => apiList('players', mapApiPlayer, signal);

import { apiList } from '@/lib/api/client';
import { mapApiBanner } from '@/lib/api/mappers';
export const getBanners = (signal?: AbortSignal) => apiList('banners', mapApiBanner, signal);

import { mockData } from '@/mocks';
export type Resource = keyof typeof mockData;
export const endpoints: Record<Resource,string> = {articles:'/articles',matches:'/matches',standings:'/standings',teams:'/teams',players:'/players',banners:'/banners'};
export const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
export async function apiList<T>(resource: Resource, mapper: (value: unknown)=>T, signal?: AbortSignal): Promise<T[]> {
 if (useMock) { signal?.throwIfAborted(); return (mockData[resource] as unknown[]).map(mapper); }
 const base = process.env.NEXT_PUBLIC_API_BASE_URL;
 if (!base) throw new Error('NEXT_PUBLIC_API_BASE_URL is required in API mode');
 const response = await fetch(`${base.replace(/\/$/,'')}${endpoints[resource]}`, {signal, next:{revalidate:60}});
 if (!response.ok) throw new Error(`API request failed (${response.status})`);
 const payload: unknown = await response.json();
 const data = Array.isArray(payload) ? payload : (payload as {data?:unknown})?.data;
 if (!Array.isArray(data)) throw new Error('Expected an API array or { data: [] }');
 return data.map(mapper);
}

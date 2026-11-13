import { Skeleton } from '@/components/ui';
import { strings } from '@/content/strings';
export default function Loading(){return <main id="main" role="status" aria-label={strings.loading} className="container-shell min-h-[60vh] space-y-6 py-20"><Skeleton className="mx-auto h-20 max-w-xl"/><Skeleton className="mx-auto h-8 max-w-sm"/><Skeleton className="h-96"/></main>}

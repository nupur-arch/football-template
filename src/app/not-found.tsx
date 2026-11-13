import { ButtonLink } from '@/components/ui';
import { strings } from '@/content/strings';
export default function NotFound(){return <main id="main" className="container-shell min-h-[50vh] py-20"><p className="mb-4 text-muted">404</p><h1 className="mb-8 font-display text-4xl">{strings.empty}</h1><ButtonLink href="/">{strings.home}</ButtonLink></main>}

'use client';
import { strings } from '@/content/strings';
import { Button } from '@/components/ui';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="container-shell min-h-[50vh] py-20"><h1 className="mb-6 font-display text-3xl">{strings.error}</h1><Button onClick={reset}>{strings.retry}</Button></main>}

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { strings } from '@/content/strings';
export function Button({className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas hover:opacity-80 '+className} {...props}/>}
export function ButtonLink({href,children}:{href:string;children:ReactNode}){return <Link href={href} className="inline-flex min-h-11 items-center gap-3 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-pitch hover:bg-mint">{children}<ArrowUpRight size={18}/></Link>}
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <div className={'overflow-hidden rounded-card border border-line bg-surface shadow-soft '+className}>{children}</div>}
export function Skeleton({className=''}:{className?:string}){return <div aria-hidden="true" className={'animate-pulse rounded-2xl bg-line motion-reduce:animate-none '+className}/>}
export function AdSlot(){return <aside aria-label={strings.ad} className="flex h-28 flex-col items-center justify-center rounded-card border border-dashed border-line text-xs text-muted"><span className="uppercase tracking-[.18em]">{strings.ad}</span><span className="mt-2">{strings.adEmpty}</span></aside>}

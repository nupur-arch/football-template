import Link from 'next/link';
import { Logo } from './logo';
import { siteConfig } from '@/content/site.config';
import { strings } from '@/content/strings';
import { ArrowUpRight } from 'lucide-react';
export function Footer(){return <footer className="mt-24 bg-footer py-14 text-white"><div className="container-shell"><div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]"><div><Logo light/><p className="mt-5 max-w-xs text-sm leading-7 text-white/60">{strings.footerNote}</p></div>{siteConfig.nav.slice(1).map(group=><div key={group.label}><p className="mb-5 text-xs uppercase tracking-widest text-white/50">{group.label}</p><ul className="space-y-4">{group.items.map(item=><li key={item.label}><Link className="inline-flex items-center gap-2 text-sm hover:text-lime" href={item.href}>{item.label}<ArrowUpRight size={14}/></Link></li>)}</ul></div>)}</div><div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/50"><p>© {new Date().getFullYear()} {strings.copyright}</p><p>{strings.tagline}</p></div></div></footer>}

import Link from 'next/link';
import { siteConfig } from '@/content/site.config';

function Mark() {
  return <svg aria-hidden="true" viewBox="0 0 40 40" className="logo-glyph h-9 w-9 overflow-visible" fill="none" strokeWidth="7" strokeLinecap="square">
    <path className="logo-stroke" pathLength="1" d="M6 12H16" />
    <path className="logo-stroke logo-stroke-2" pathLength="1" d="M26 12H34" />
    <path className="logo-stroke logo-stroke-3" pathLength="1" d="M20 12V36" />
    <path className="logo-notch" pathLength="1" d="M14 12H28" />
  </svg>;
}

export function Logo({ variant = 'full', light = false, className = '' }: { variant?: 'full' | 'mark' | 'stacked'; light?: boolean; className?: string }) {
  const stacked = variant === 'stacked';
  return <Link href="/" aria-label={siteConfig.name + ' home'} className={'logo-link inline-flex ' + (stacked ? 'flex-col items-center gap-1.5 text-center ' : 'items-center gap-2.5 ') + (light ? 'text-white ' : '') + className}>
    <Mark />
    {variant !== 'mark' && <span className="logo-word font-display text-[1.05rem] font-bold uppercase leading-none tracking-[-0.12em]">Touchline</span>}
  </Link>;
}

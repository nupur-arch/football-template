import type { Metadata } from 'next';
import { Logo } from '@/components/logo';

export const metadata: Metadata = { title: 'Brand', robots: { index: false, follow: false } };

const grounds = [
  { name: 'Light', background: '#fafaf6', color: '#14251c', accent: '#d5f86c' },
  { name: 'Dark', background: '#123c2c', color: '#ffffff', accent: '#d5f86c' },
  { name: 'Lime', background: '#d5f86c', color: '#123c2c', accent: '#ffffff' },
  { name: 'Single color', background: '#fafaf6', color: '#14251c', accent: 'currentColor' },
];

export default function BrandPage() {
  return <main id="main" className="container-shell py-16">
    <p className="text-xs uppercase tracking-[.18em] text-muted">Touchline</p>
    <h1 className="mt-3 font-display text-5xl font-bold tracking-[-.06em]">Brand</h1>
    <div className="mt-12 grid gap-6">
      {grounds.map(ground => <section key={ground.name} className="rounded-card p-8" style={{ background: ground.background, color: ground.color, ['--logo-accent' as string]: ground.accent }}>
        <p className="mb-8 text-xs uppercase tracking-[.16em] opacity-70">{ground.name}</p>
        <div className="flex flex-wrap items-end gap-10">
          <Logo variant="full" />
          <Logo variant="mark" />
          <Logo variant="stacked" />
        </div>
      </section>)}
    </div>
  </main>;
}

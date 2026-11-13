export const siteConfig = {
 name: 'Touchline', locale: 'en', description: 'A fresh perspective on the beautiful game.',
 url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
 colors: { footer: '#111e17', accent: '#799c34', pitch: '#123c2c', lime: '#d5f86c', light: { canvas: '#fafaf6', ink: '#14251c', muted: '#58665e', surface: '#ffffff', line: '#dde3d9' }, dark: { canvas: '#0b1712', ink: '#f4f6ec', muted: '#a8b8aa', surface: '#14251c', line: '#304338' }, blue: '#d7e8ee', coral: '#f6cbbd', mint: '#e2edda' },
 nav: [ { label: 'Discover', href: '/', items: [{ label: 'Today’s edit', href: '/#stories' }, { label: 'Find your football', href: '/search' }] }, { label: 'Competitions', href: '/search?q=Premier', items: [{ label: 'Premier League', href: '/search?q=Premier' }, { label: 'Champions League', href: '/search?q=Champions' }] }, { label: 'The game', href: '/search?q=Arsenal', items: [{ label: 'Clubs', href: '/search?type=teams' }, { label: 'Players', href: '/search?type=players' }] } ],
 trending: ['Arsenal', 'Champions', 'Saka'],
} as const;

import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/content/site.config';
import { strings } from '@/content/strings';
import './globals.css';
const body=DM_Sans({subsets:['latin'],variable:'--font-body',display:'swap'});
const display=Space_Grotesk({subsets:['latin'],variable:'--font-display',display:'swap'});
const colorVariables: Record<string, string> = {};
for (const [name, value] of Object.entries(siteConfig.colors)) {
  if (typeof value === 'string') colorVariables['--' + name] = value;
  else for (const [token, color] of Object.entries(value)) colorVariables['--palette-' + name + '-' + token] = color;
}
export const metadata:Metadata={metadataBase:new URL(siteConfig.url),title:{default:siteConfig.name+' — '+strings.tagline,template:'%s | '+siteConfig.name},description:siteConfig.description,alternates:{canonical:'/'},openGraph:{title:siteConfig.name,description:siteConfig.description,type:'website',locale:siteConfig.locale}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang={siteConfig.locale} style={colorVariables as React.CSSProperties} suppressHydrationWarning><body className={body.variable+' '+display.variable+' font-sans antialiased'}><Providers><a href="#main" className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-lime px-5 py-3 text-pitch focus:translate-y-0">{strings.skip}</a><Header/>{children}<Footer/></Providers></body></html>}

'use client';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
const MotionProvider=dynamic(()=>import('./motion').then(mod=>mod.MotionProvider));
export function Providers({children}:{children:ReactNode}){return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><MotionProvider>{children}</MotionProvider></ThemeProvider>}

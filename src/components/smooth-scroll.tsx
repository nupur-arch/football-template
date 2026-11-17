'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

function ScrollOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  useEffect(() => {
    const current = lenisRef.current;
    const hash = window.location.hash;
    if (hash) {
      try {
        const target = document.querySelector(hash);
        if (target && current) current.scrollTo(target, { immediate: true });
      } catch { /* invalid hash */ }
      return;
    }
    if (current) current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    setReady(true);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  if (!ready || reduced) return children;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: true, autoRaf: true }}>
      <ScrollOnNavigate />
      {children}
    </ReactLenis>
  );
}

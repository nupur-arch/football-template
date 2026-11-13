'use client';
import { LazyMotion, m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
export const motionTokens={ease:[.22,1,.36,1] as [number,number,number,number],entrance:.65,stagger:.075,toggle:.25,accordion:.3};
export function MotionProvider({children}:{children:ReactNode}){return <LazyMotion features={() => import('./motion-features').then(mod => mod.default)}>{children}</LazyMotion>}
export function Reveal({children}:{children:ReactNode}){const reduced=useReducedMotion();return <m.div initial={false} whileInView={{opacity:[.85,1],y:reduced?0:[12,0]}} viewport={{once:true,amount:.15}} transition={{duration:reduced?0:motionTokens.entrance,ease:motionTokens.ease}}>{children}</m.div>}
export { m };

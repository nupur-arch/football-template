'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
export function SafeImage({src,alt,...props}:ImageProps){
 const [failed,setFailed]=useState<string | null>(null);
 const safe=typeof src==='string' && src.startsWith('/') && !src.startsWith('//') ? src : '/images/fallback.svg';
 return <Image {...props} src={failed===safe?'/images/fallback.svg':safe} alt={alt} onError={()=>setFailed(safe)}/>;
}

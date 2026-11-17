'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
export function SafeImage({src,alt,className,onLoad,fill,...props}:ImageProps){
 const [failed,setFailed]=useState<string | null>(null);
 const [shown,setShown]=useState(false);
 const safe=typeof src==='string' && src.startsWith('/') && !src.startsWith('//') ? src : '/images/fallback.svg';
 const image=<Image {...props} fill={fill} className={(className??'')+(fill?'':' '+(shown?'':'image-pending'))} src={failed===safe?'/images/fallback.svg':safe} alt={alt} onLoad={event=>{setShown(true);onLoad?.(event);}} onError={()=>setFailed(safe)}/>;
 if(fill)return image;
 return <span className={'image-frame'+(shown?' is-shown':'')}>{!shown&&<span className="image-shimmer" aria-hidden="true"/>}{image}</span>;
}

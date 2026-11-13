import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { SafeImage } from './safe-image';
export function MarkdownContent({content}:{content:string}){return <div className="prose-content"><Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={{a:({href,children})=>{const external=!!href && /^https?:\/\//.test(href);return <a href={href} rel={external?'noopener noreferrer':undefined} target={external?'_blank':undefined}>{children}</a>},img:({src,alt})=><SafeImage src={typeof src==='string'?src:'/images/fallback.svg'} alt={alt || ''} width={1200} height={800} sizes="(max-width: 768px) 100vw, 800px" className="my-4 h-auto w-full rounded-card"/>}}>{content}</Markdown></div>}

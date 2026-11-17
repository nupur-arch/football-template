/* Targeted component-logic and CSS checks; this does not replace browser QA. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import postcss from 'postcss';
const root = path.resolve(import.meta.dirname, '..');
const jsx = (type, props) => ({ type, props: props || {} });
const copy = {};
function compile(file, imports, globals = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: id => {
    if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
    if (id in imports) return imports[id];
    throw new Error('Unexpected import: ' + id);
  }, ...globals }, { filename: file });
  return compiled.exports;
}
Object.assign(copy, compile('src/content/strings.ts', {}));
const walk = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(walk) : [node, ...walk(node.props?.children)];
let checks = 0;
const banners = Array.from({ length: 20 }, (_, i) => ({ id: 'b' + i, title: 'Story ' + (i + 1), description: i % 2 ? 'Culture' : 'Analysis', image: '/images/fallback.svg', href: '/search?q=story-' + (i + 1) }));
const motionValue = () => ({ get: () => 0, set() {}, on: () => () => {} });
let galleryCursor = 0, gallerySlots = [];
const gallery = compile('src/components/home/story-gallery.tsx', {
  react: {
    useState(value) { const id = galleryCursor++; if (!(id in gallerySlots)) gallerySlots[id] = value; return [gallerySlots[id], () => {}]; },
    useRef(value) { const id = galleryCursor++; return gallerySlots[id] || (gallerySlots[id] = { current: value }); },
    useEffect() {},
  },
  'framer-motion': { useMotionValue: motionValue, useScroll: () => ({ scrollYProgress: motionValue() }), useTransform: () => motionValue() },
  'next/link': { default: 'link' }, 'lucide-react': { ArrowUpRight: 'arrow' },
  '@/content/strings': copy, '@/components/safe-image': { SafeImage: 'image' }, '@/components/ui': { ButtonLink: 'button-link' },
});
galleryCursor = 0;
const galleryTree = gallery.StoryGallery({ banners });
const galleryCards = walk(galleryTree).filter(node => String(node.props?.banner?.href || '').startsWith('/search?q='));
assert.equal(galleryCards.length, 20);
assert.equal(galleryCards.filter(node => node.props.priority === true).length, 3);
assert.ok(fs.readFileSync(path.join(root, 'src/components/home/story-gallery.tsx'), 'utf8').includes('const SCROLL_DIRECTION = -1'));
checks += 2;
const css = postcss.parse(fs.readFileSync(path.join(root, 'src/app/home.css'), 'utf8'));
function property(selector, name, width, reduced) {
  let result;
  css.walkRules(rule => {
    if (!rule.selector.split(',').map(s => s.trim()).includes(selector)) return;
    let parent = rule.parent, applies = true;
    while (parent) { if (parent.type === 'atrule' && parent.name === 'media') {
      const max = parent.params.match(/max-width:\s*(\d+)px/);
      if (max && width > Number(max[1])) applies = false;
      if (parent.params.includes('prefers-reduced-motion:reduce') && !reduced) applies = false;
    } parent = parent.parent; }
    if (applies) rule.walkDecls(name, declaration => { result = declaration.value; });
  });
  return result;
}
for (const width of [320, 375, 767, 768, 1440]) for (const reduced of [false, true]) {
  const staticLayout = width < 768 || reduced;
  assert.equal(property('.stack-card', 'position', width, reduced), staticLayout ? 'relative' : 'sticky');
  assert.equal(property('.qa-live .fans-stage', 'position', width, reduced), reduced ? 'relative' : 'sticky');
  assert.equal(property('.home-fans.qa-live', 'height', width, reduced), reduced ? 'auto' : width < 768 ? '160vh' : '220vh');
  assert.equal(property('.gallery-pin.is-live', 'height', width, reduced), reduced ? 'auto' : width < 768 ? '250vh' : '350vh');
  assert.equal(property('.gallery-pin.is-live .gallery-stage', 'position', width, reduced), reduced ? 'relative' : 'sticky');
  if (staticLayout) assert.equal(property('.stack-card', 'transform', width, reduced), 'none');
  checks++;
}
console.log(`PASS: ${checks} gallery, stack and reduced-motion CSS checks. Browser rendering remains unverified.`);

// Exercise the lazy scroll enhancement against desktop, mobile and reduced motion.
for (const mode of [{ width: 1440, reduced: false }, { width: 375, reduced: false }, { width: 1440, reduced: true }]) {
  const listeners = {};
  let enabled = mode.width >= 768 && !mode.reduced;
  const style = () => ({ removeProperty(name) { delete this[name]; }, setProperty(name, value) { this[name] = value; } });
  const cards = [0, 1, 2, 3].map(() => ({ style: style(), getBoundingClientRect: () => ({ top: 350 }) }));
  const stack = { current: { querySelectorAll: () => cards } };
  let mediaChange;
  const media = { get matches() { return enabled; }, addEventListener(_, fn) { mediaChange = fn; }, removeEventListener() {} };
  const effects = compile('src/components/home/scroll-effects.tsx', {
    react: { useEffect: fn => fn() },
    'framer-motion': { useScroll: () => ({ scrollY: 'scroll', scrollYProgress: 'progress' }), useTransform: () => 'darkness', useMotionValueEvent: (value, _, fn) => { listeners[value] = fn; } },
  }, { window: { innerHeight: 900, matchMedia: () => media } });
  effects.default({ stack });
  listeners.scroll(1000);
  if (enabled) {
    assert.match(cards[0].style.transform, /scale\(0\.9/);
    assert.ok(Number(cards[0].style.opacity) < 1);
    enabled = false; mediaChange();
    assert.equal(cards[0].style.transform, undefined);
  } else {
    assert.equal(cards[0].style.transform, undefined);
  }
  checks++;
}
console.log('PASS: scroll transforms, pill staggering, mobile/reduced-motion guards and preference-change cleanup.');

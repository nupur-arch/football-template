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
const articles = Array.from({ length: 20 }, (_, i) => ({ id: 'a' + i, title: 'Story ' + (i + 1), image: '/images/fallback.svg', category: { name: 'Analysis' }, author: 'Editorial', readingMinutes: 4, excerpt: 'A football story' }));
const walk = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(walk) : [node, ...walk(node.props?.children)];
const text = node => node == null ? '' : typeof node !== 'object' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children);
let checks = 0;
function harness(component, reduced = false) {
  let slots = [], cursor = 0, pending = [], tree, dirty = false, clock = 0, timerId = 0;
  const timers = new Map();
  const hooks = {
    useState(value) { const id = cursor++; if (!(id in slots)) slots[id] = value; return [slots[id], next => { slots[id] = typeof next === 'function' ? next(slots[id]) : next; dirty = true; }]; },
    useRef(value) { const id = cursor++; return slots[id] || (slots[id] = { current: value }); },
    useEffect(fn, deps) { const id = cursor++; if (!slots[id] || deps.some((value, i) => !Object.is(value, slots[id].deps[i]))) pending.push(() => { slots[id]?.cleanup?.(); slots[id] = { deps, cleanup: fn() }; }); },
  };
  let railScroll = 0;
  const api = compile('src/components/home/home-interactive.tsx', {
    react: hooks, 'framer-motion': { useReducedMotion: () => reduced },
    'next/link': { default: 'link' }, 'lucide-react': { ArrowLeft: 'left', ArrowRight: 'right', Pause: 'pause', Play: 'play' },
    '@/content/strings': copy, '@/components/safe-image': { SafeImage: 'image' },
    '@/components/ui': { Button: 'button', ButtonLink: 'button-link', Card: 'card' },
  }, { performance: { now: () => clock }, document: { hidden: false }, window: {
    setInterval(fn, duration) { timers.set(++timerId, { fn, duration, next: clock + duration }); return timerId; },
    clearInterval(id) { timers.delete(id); },
  } });
  const render = () => {
    cursor = 0; pending = []; dirty = false;
    tree = api[component]({ articles });
    const rail = walk(tree).find(node => node.props.className === 'story-rail');
    if (rail && !rail.props.ref.current) rail.props.ref.current = { offsetLeft: 0, clientWidth: 300, children: articles.map((_, i) => ({ offsetLeft: i * 100, clientWidth: 88 })), scrollTo: ({ left }) => { railScroll = left; } };
    pending.forEach(fn => fn());
  };
  render();
  return {
    get tree() { return tree; }, get railScroll() { return railScroll; },
    find(predicate) { const result = walk(tree).find(predicate); assert.ok(result, 'Expected node'); return result; },
    event(node, name, value) { node.props[name](value); render(); },
    advance(ms) { const end = clock + ms; while (clock < end) { clock += 50; [...timers.values()].forEach(timer => { if (clock >= timer.next) { timer.next += timer.duration; timer.fn(); } }); if (dirty) render(); } },
    sync(expected) {
      const active = walk(tree).filter(node => node.props.className?.includes('story-slide') && node.props['aria-hidden'] === false);
      assert.equal(active.length, 1); assert.equal(active[0].props['data-slide'], expected); assert.equal(active[0].props.inert, false);
      const thumbs = walk(tree).filter(node => node.props.className === 'story-thumb');
      assert.equal(thumbs.length, 20); assert.equal(thumbs.findIndex(node => node.props['aria-current']) + 1, expected);
      assert.equal(text(this.find(node => node.props.className === 'story-counter')), String(expected).padStart(2, '0') + ' / 20');
      assert.equal(walk(tree).filter(node => node.props.className?.includes('story-slide')).length, 20);
      checks++;
    },
  };
}
const deck = harness('StoryDeck');
deck.sync(1);
for (let i = 1; i <= 20; i++) {
  deck.event(deck.find(node => node.props['aria-label']?.startsWith('Go to story ' + String(i).padStart(2, '0') + ':')), 'onClick');
  deck.sync(i);
}
assert.ok(deck.railScroll > 1500, 'Rail follows story 20');
deck.event(deck.find(node => node.props['aria-label'] === copy.homeCopy.next), 'onClick'); deck.sync(1);
deck.event(deck.find(node => node.props['aria-label'] === copy.homeCopy.previous), 'onClick'); deck.sync(20);
const region = () => deck.find(node => node.props['aria-roledescription'] === 'carousel');
deck.event(region(), 'onKeyDown', { key: 'ArrowRight', preventDefault() {} }); deck.sync(1);
deck.advance(6050); deck.sync(2);
deck.event(region(), 'onMouseEnter'); deck.advance(7000); deck.sync(2);
deck.event(region(), 'onMouseLeave'); deck.event(region(), 'onFocusCapture'); deck.advance(7000); deck.sync(2);
deck.event(region(), 'onBlurCapture', { currentTarget: { contains: () => false }, relatedTarget: null });
deck.event(deck.find(node => node.props['aria-label'] === copy.homeCopy.pause), 'onClick'); deck.advance(7000); deck.sync(2);
deck.event(deck.find(node => node.props['aria-label'] === copy.homeCopy.play), 'onClick'); deck.advance(6050); deck.sync(3);
const surface = () => deck.find(node => node.props.className === 'story-deck');
deck.event(surface(), 'onPointerDown', { button: 0, clientX: 250, pointerId: 1, target: { closest: () => null } });
deck.event(surface(), 'onPointerMove', { clientX: 100, pointerId: 1, currentTarget: { setPointerCapture() {} } });
deck.event(surface(), 'onPointerUp', { clientX: 100 }); deck.sync(4);
const progress = deck.find(node => node.props.role === 'progressbar'); assert.equal(progress.props['aria-valuenow'], 0);
let prevented = false;
deck.event(deck.find(node => node.type === 'link' && node.props.href.includes('Story%204')), 'onClick', { preventDefault() { prevented = true; } });
assert.ok(prevented, 'Swiping does not navigate');
const reducedDeck = harness('StoryDeck', true); reducedDeck.advance(12000); reducedDeck.sync(1);
reducedDeck.event(reducedDeck.find(node => node.props['aria-label'] === copy.homeCopy.next), 'onClick'); reducedDeck.sync(2);
assert.equal(reducedDeck.find(node => node.props['aria-label'] === copy.homeCopy.pause).props.disabled, true);
const hero = harness('HomeHero'); hero.advance(4250); assert.ok(text(hero.tree).includes('standings'));
hero.event(hero.find(node => node.props['aria-label'] === copy.homeCopy.pauseHero), 'onClick'); hero.advance(5000); assert.ok(text(hero.tree).includes('standings'));
const reducedHero = harness('HomeHero', true); reducedHero.advance(9000); assert.ok(text(reducedHero.tree).includes('live scores'));
checks += 5;
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
  assert.equal(property('.fans-stage', 'position', width, reduced), staticLayout ? 'relative' : 'sticky');
  assert.equal(property('.home-fans', 'height', width, reduced), staticLayout ? 'auto' : '220vh');
  if (staticLayout) assert.equal(property('.stack-card', 'transform', width, reduced), 'none');
  if (width < 768) assert.equal(property('.fan-pill', 'position', width, reduced), 'static');
  checks++;
}
console.log(`PASS: ${checks} carousel synchronization, autoplay, hover/focus/pause, swipe, hero and responsive/reduced-motion CSS checks. Browser rendering remains unverified.`);

// Exercise the lazy scroll enhancement against desktop, mobile and reduced motion.
for (const mode of [{ width: 1440, reduced: false }, { width: 375, reduced: false }, { width: 1440, reduced: true }]) {
  const listeners = {};
  let enabled = mode.width >= 768 && !mode.reduced;
  const style = () => ({ removeProperty(name) { delete this[name]; }, setProperty(name, value) { this[name] = value; } });
  const cards = [0, 1, 2, 3].map(() => ({ style: style(), getBoundingClientRect: () => ({ top: 350 }) }));
  const pills = [0, 1, 2, 3, 4, 5].map(() => ({ style: style() }));
  const stack = { current: { querySelectorAll: () => cards } };
  const fans = { current: { querySelectorAll: () => pills, style: style() } };
  let mediaChange;
  const media = { get matches() { return enabled; }, addEventListener(_, fn) { mediaChange = fn; }, removeEventListener() {} };
  const effects = compile('src/components/home/scroll-effects.tsx', {
    react: { useEffect: fn => fn() },
    'framer-motion': { useScroll: () => ({ scrollY: 'scroll', scrollYProgress: 'progress' }), useTransform: () => 'darkness', useMotionValueEvent: (value, _, fn) => { listeners[value] = fn; } },
  }, { window: { innerHeight: 900, matchMedia: () => media } });
  effects.default({ stack, fans });
  listeners.scroll(1000); listeners.progress(.8); listeners.darkness(1);
  if (enabled) {
    assert.match(cards[0].style.transform, /scale\(0\.9/);
    assert.ok(Number(cards[0].style.opacity) < 1);
    assert.equal(pills[5].style.opacity, '1');
    assert.equal(fans.current.style['--fan-darkness'], '1');
    enabled = false; mediaChange();
    assert.equal(cards[0].style.transform, undefined);
    assert.equal(pills[0].style.opacity, undefined);
    assert.equal(fans.current.style['--fan-darkness'], undefined);
  } else {
    assert.equal(cards[0].style.transform, undefined);
    assert.equal(pills[0].style.opacity, undefined);
    assert.equal(fans.current.style['--fan-darkness'], undefined);
  }
  checks++;
}
console.log('PASS: scroll transforms, pill staggering, mobile/reduced-motion guards and preference-change cleanup.');

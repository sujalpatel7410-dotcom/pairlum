import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginOrSignup, Pairing } from './AuthForms';

type CSSVars = React.CSSProperties & Record<string, string | number>;

const LANDING_STYLES = `
.pl-landing{--bg:#FFD3DE;--ink:#4A0420;--accent:#E11D48;--on-accent:#FFF1F4;--ground:#9F1239;--rock:#D0607E;
  --display:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;
  --body:'Instrument Sans','Helvetica Neue',Arial,sans-serif;
  --pad:clamp(20px,4vw,56px);
  background:var(--bg);color:var(--ink);font-family:var(--body);font-size:1.0625rem;line-height:1.5;
  -webkit-font-smoothing:antialiased;position:relative;overflow-x:clip;min-height:100vh;
}
@media (prefers-color-scheme:dark){
  html:not([data-theme="light"]) .pl-landing{--bg:#2A0716;--ink:#FFE4EA;--accent:#FB5F86;--on-accent:#2A0716;--ground:#5A0D2B;--rock:#7A1F45}
}
html[data-theme="dark"] .pl-landing{--bg:#2A0716;--ink:#FFE4EA;--accent:#FB5F86;--on-accent:#2A0716;--ground:#5A0D2B;--rock:#7A1F45}
.pl-landing *,.pl-landing *::before,.pl-landing *::after{box-sizing:border-box}
.pl-landing a{color:inherit;text-decoration:none}
.pl-landing :focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:4px}

.pl-landing .loader{display:flex;position:fixed;inset:0;z-index:50;background:var(--accent);color:var(--on-accent);
  align-items:flex-end;justify-content:space-between;padding:var(--pad);
  transition:transform .9s cubic-bezier(.76,0,.24,1)}
.pl-landing .loader p{margin:0;font-size:.95rem;max-width:16ch}
.pl-landing .loader b{font:600 clamp(5rem,22vw,18rem)/.8 var(--display);letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.pl-landing.ready .loader{transform:translateY(-100%)}
.pl-landing .loader small{display:block;text-align:right;font-size:.95rem;margin-top:8px}

.pl-landing header{position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:20px var(--pad)}
.pl-landing .logo{font:700 1.35rem var(--display);letter-spacing:-.03em}
.pl-landing nav{display:flex;align-items:center;gap:clamp(10px,2vw,28px)}
.pl-landing nav .links{display:flex;gap:clamp(14px,3vw,32px)}
.pl-landing nav .links a,.pl-landing nav .links button{padding:6px 0;background:linear-gradient(currentColor,currentColor) 0 100%/0 2px no-repeat;transition:background-size .25s;border:0;color:inherit;font:inherit;cursor:pointer}
.pl-landing nav .links a:hover,.pl-landing nav .links button:hover{background-size:100% 2px}
.pl-landing .settings{position:relative}
.pl-landing .set-btn{height:40px;padding:0 2px;border:0;color:var(--ink);font:inherit;cursor:pointer;background:linear-gradient(currentColor,currentColor) 0 100%/0 2px no-repeat;transition:background-size .25s}
.pl-landing .set-btn:hover,.pl-landing .set-btn[aria-expanded="true"]{background-size:100% 2px}
.pl-landing .panel{position:absolute;right:0;top:calc(100% + 12px);min-width:230px;padding:8px;border-radius:18px;background:var(--bg);border:1.5px solid var(--ink)}
.pl-landing .panel[hidden]{display:none}
.pl-landing .sw{display:flex;width:100%;justify-content:space-between;align-items:center;gap:16px;padding:12px;background:none;border:0;border-radius:10px;color:var(--ink);font:inherit;cursor:pointer}
.pl-landing .sw:hover{background:var(--ink);color:var(--bg)}
.pl-landing .sw b{position:relative;flex:none;width:38px;height:22px;border-radius:999px;border:1.5px solid currentColor}
.pl-landing .sw b::after{content:"";position:absolute;top:3px;left:3px;width:13px;height:13px;border-radius:50%;background:currentColor;transition:transform .25s}
.pl-landing .sw[aria-checked="true"] b{background:var(--accent);border-color:var(--accent)}
.pl-landing .sw[aria-checked="true"] b::after{transform:translateX(16px);background:var(--on-accent)}
.pl-landing .pill{display:inline-flex;align-items:center;padding:11px 22px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-weight:600;transition:transform .2s}
.pl-landing .pill:hover{transform:translateY(-2px)}
.pl-landing button.pill{border:0;font:inherit;font-weight:600;cursor:pointer}
.pl-landing header{color:var(--ink)}
.pl-landing.deep header{--ink:#FFF1F4;--bg:#3a0a1f}
@media(max-width:700px){.pl-landing nav .links{display:none}}

.pl-landing .journey{height:420vh;position:relative}
.pl-landing .hero{position:sticky;top:0;height:100vh;height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:110px var(--pad) 0;overflow:hidden}
.pl-landing .veil{position:absolute;inset:0;opacity:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,#be123c 0%,#2a0716 72%)}
.pl-landing .world{position:absolute;inset:0;z-index:2;display:grid;place-content:center;justify-items:center;gap:16px;padding:var(--pad);text-align:center;color:#F1E9FF;opacity:0;pointer-events:none}
.pl-landing .world h2{margin:0;font:600 clamp(2.6rem,9vw,8rem)/.92 var(--display);letter-spacing:-.045em}
.pl-landing .world p{margin:0;max-width:34ch;font-size:1.15rem}
.pl-landing #fx{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.pl-landing .tag{position:relative;z-index:1;margin:0 0 20px;max-width:30ch;font-size:1.05rem}
.pl-landing h1{position:relative;z-index:1;margin:0;font:600 clamp(2.6rem,9.2vw,8.6rem)/.9 var(--display);letter-spacing:-.045em;font-variation-settings:'opsz' 96;pointer-events:none}
.pl-landing h1 span{display:block;overflow:hidden;padding-bottom:.08em}
.pl-landing h1 i{display:block;font-style:normal;transform:translateY(105%);transition:transform 1s cubic-bezier(.16,1,.3,1)}
.pl-landing.ready h1 i{transform:none}
.pl-landing.ready h1 span:nth-child(2) i{transition-delay:.1s}
.pl-landing.ready h1 span:nth-child(3) i{transition-delay:.2s}

.pl-landing .ground{position:relative;z-index:1;margin:clamp(28px,4vw,48px) calc(var(--pad)*-1) 0;padding:clamp(26px,4vw,44px) var(--pad);background:var(--ground);color:#F1E9FF}
.pl-landing .rocks{position:absolute;left:0;right:0;bottom:100%;width:100%;height:clamp(50px,9vw,120px);display:block;pointer-events:none}
.pl-landing .rocks path{fill:var(--rock)}
.pl-landing .hero-foot{display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between}
.pl-landing .hero-foot p{margin:0;max-width:36ch;font-size:1.15rem}
.pl-landing .ground .pill{background:#F1E9FF;color:var(--ground)}

.pl-landing [data-p]{--p:1}
.pl-landing .blk{position:relative;isolation:isolate;min-height:100vh;display:grid;grid-template-columns:1fr;gap:clamp(32px,5vw,72px);align-items:center;padding:clamp(56px,9vw,130px) var(--pad);overflow:hidden}
.pl-landing .blk::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--blob)}
.pl-landing .b1{--blob:radial-gradient(55% 60% at 88% 20%,color-mix(in srgb,var(--accent) 28%,transparent),transparent)}
.pl-landing .b2{--blob:radial-gradient(55% 60% at 10% 80%,color-mix(in srgb,#F59E0B 30%,transparent),transparent)}
.pl-landing .b3{--blob:radial-gradient(60% 60% at 90% 70%,color-mix(in srgb,var(--accent) 26%,transparent),transparent)}
.pl-landing .b4{--blob:radial-gradient(60% 60% at 15% 25%,color-mix(in srgb,#F59E0B 32%,transparent),transparent)}
.pl-landing .blk .txt{display:grid;gap:24px;justify-items:start}
.pl-landing .blk .lab{display:inline-flex;align-items:center;gap:10px;padding:6px 14px;border:1.5px solid var(--ink);border-radius:999px;font-size:.9rem}
.pl-landing .blk .lab::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.pl-landing .blk h2{margin:0;font:600 clamp(2.4rem,6.4vw,6rem)/.95 var(--display);letter-spacing:-.04em;max-width:11ch}
.pl-landing .blk p{margin:0;max-width:34ch;font-size:1.2rem}
.pl-landing .viz{position:relative;width:100%;max-width:520px;justify-self:center}
.pl-landing .viz svg{display:block;width:100%;height:auto;overflow:visible}
@media(min-width:900px){.pl-landing .blk{grid-template-columns:1fr 1fr}.pl-landing .blk.flip .viz{order:-1}}
.pl-landing .hearts{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.pl-landing .hearts i{position:absolute;bottom:-40px;left:var(--l);font-style:normal;font-size:var(--s);color:var(--c);opacity:0;animation:pl-rise var(--d) linear var(--dl) infinite}
.pl-landing .b4 .txt,.pl-landing .b4 .viz{position:relative;z-index:1}
@keyframes pl-rise{0%{transform:translate(0,0) scale(.6);opacity:0}10%{opacity:.9}50%{transform:translate(var(--sw),-55vh) scale(1)}100%{transform:translate(calc(var(--sw)*-1),-115vh) scale(1.1);opacity:0}}

@keyframes pl-spin{to{transform:rotate(360deg)}}
@keyframes pl-ping{from{transform:scale(.55);opacity:.7}to{transform:scale(1.25);opacity:0}}
@keyframes pl-beat{50%{transform:scale(1.05)}}
.pl-landing .c1{transform:translateX(calc((1 - var(--p))*-70px))}
.pl-landing .c2{transform:translateX(calc((1 - var(--p))*70px))}
.pl-landing .orb{transform-origin:200px 150px;animation:pl-spin 40s linear infinite}
.pl-landing .hrt{transform-origin:200px 152px;transform:scale(calc(var(--p)*var(--p)*1.6));opacity:var(--p)}
.pl-landing .stack{position:relative;height:clamp(320px,44vw,480px)}
.pl-landing .pol{position:absolute;left:50%;top:50%;margin:0;width:min(60%,250px);padding:10px 10px 46px;background:#FFF6FB;border-radius:6px;box-shadow:0 24px 50px rgba(74,4,32,.3);transform:translate(-50%,-50%) translate(calc(var(--x)*var(--p)),calc(var(--y)*var(--p))) rotate(calc(var(--r)*var(--p)))}
.pl-landing .ph{position:relative;aspect-ratio:1;border-radius:3px;overflow:hidden}
.pl-landing .ph:focus-within{outline:3px solid var(--accent);outline-offset:2px}
.pl-landing .pick{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:2}
.pl-landing .hint{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.88);color:#4A0420;font-size:.8rem;white-space:nowrap;transition:opacity .2s}
.pl-landing .ph.has .hint{opacity:0}.pl-landing .ph.has:hover .hint{opacity:1}
.pl-landing .ph1{background:radial-gradient(circle at 50% 62%,#fff3b0 0 14%,transparent 15%),linear-gradient(180deg,#ffb27a,#e11d48 62%,#5a0d2b)}
.pl-landing .ph2{background:radial-gradient(circle at 72% 26%,#fff8e1 0 7%,transparent 8%),radial-gradient(circle at 20% 18%,#fff 0 1.2%,transparent 1.7%),radial-gradient(circle at 42% 34%,#fff 0 1%,transparent 1.5%),linear-gradient(180deg,#1a0620,#7a1240 70%,#f59e0b)}
.pl-landing .ph3{background:radial-gradient(circle at 38% 55%,#ffe0c2 0 22%,transparent 23%),radial-gradient(circle at 62% 55%,#ffb3c8 0 22%,transparent 23%),linear-gradient(160deg,#ffd9b3,#f28aa0)}
.pl-landing .pol figcaption{position:absolute;left:14px;right:14px;bottom:13px;font:italic 500 1rem var(--display);color:#4A0420}
.pl-landing .braid{position:relative}
.pl-landing .braid path{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--p))}
.pl-landing .nd{opacity:clamp(0,calc((var(--p) - var(--t))*4),1)}
.pl-landing .chip{position:absolute;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:var(--bg);border:1.5px solid var(--ink);font-size:.9rem;white-space:nowrap;opacity:clamp(0,calc((var(--p) - var(--t))*4),1)}
.pl-landing .chip::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--c)}
.pl-landing .ping{transform-origin:200px 200px;animation:pl-ping 3.6s ease-out infinite}
.pl-landing .orbit{transform-origin:200px 200px;animation:pl-spin 16s linear infinite}
.pl-landing .heart{transform-origin:200px 205px;transform:scale(calc(.6 + var(--p)*.4));filter:drop-shadow(0 12px 30px rgba(225,29,72,.5))}
.pl-landing .beat{transform-origin:200px 205px;animation:pl-beat 2.4s ease-in-out infinite}
.pl-landing .what{padding:clamp(60px,10vw,140px) var(--pad);border-top:1.5px solid var(--ink)}
.pl-landing .lead{margin:0 0 32px;max-width:30ch;font:500 clamp(1.5rem,3.4vw,3rem)/1.15 var(--display);letter-spacing:-.025em}
.pl-landing .svc{list-style:none;margin:clamp(48px,7vw,100px) 0 0;padding:0}
.pl-landing .svc li{display:flex;gap:24px;align-items:baseline;padding:16px 0;border-top:1.5px solid var(--ink);font:500 clamp(1.4rem,3.4vw,2.8rem)/1.1 var(--display);letter-spacing:-.03em;transition:padding-left .3s}
.pl-landing .svc li:last-child{border-bottom:1.5px solid var(--ink)}
.pl-landing .svc li:hover{padding-left:16px}
.pl-landing .svc li span{min-width:3.5rem;font:500 .95rem var(--body);letter-spacing:0}
.pl-landing .start{padding:clamp(60px,10vw,140px) var(--pad);border-top:1.5px solid var(--ink);display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}
.pl-landing .start .lead{text-align:center;max-width:34ch}

@media(prefers-reduced-motion:reduce){
  .pl-landing .loader{display:none!important}
  .pl-landing .journey{height:auto}.pl-landing .hero{position:relative}.pl-landing .world{display:none}
  .pl-landing .orb,.pl-landing .orbit,.pl-landing .ping,.pl-landing .beat{animation:none!important}
  .pl-landing .hearts{display:none}
  .pl-landing h1 i{transform:none!important;transition:none!important}
  .pl-landing .sw b::after{transition:none!important}
}
`;

const SERVICES = [
  'Shared Timeline', 'Photo & Video Albums', 'Voice Notes', 'Anniversary Reminders',
  'Date Night Ideas', 'Shared Bucket List', 'Love Letters', 'Milestone Cards',
  'Travel Journals', 'Playlists for Two', 'Memory Capsules', 'Yearly Recap Books',
];

export const Landing: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const { session, membership } = useAuth();

  const scrollToStart = () => startRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const win = window as typeof window & { THREE?: any };
    const htmlEl = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(
      target: EventTarget,
      type: string,
      handler: (ev: any) => void,
      opts?: boolean | AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    let act = 0, prog = 0, entered = false, readyAt: number | null = null;

    // Preloader
    const countEl = root.querySelector<HTMLElement>('#pl-count');
    const dur = 1500;
    let t0: number | null = null;
    let tickRaf = 0;
    function markReady() {
      root!.classList.add('ready');
      readyAt = performance.now();
    }
    function tick(t: number) {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      if (countEl) countEl.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (p < 1) tickRaf = requestAnimationFrame(tick);
      else setTimeout(markReady, 250);
    }
    if (reduce) markReady(); else tickRaf = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(tickRaf));

    // Theme toggle (shared with the rest of the app via pairlum_theme_mode)
    const tbtn = root.querySelector<HTMLButtonElement>('#pl-theme');
    const isDark = () => {
      const c = htmlEl.getAttribute('data-theme');
      return c ? c === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    };
    try {
      const saved = localStorage.getItem('pairlum_theme_mode');
      if (saved === 'dark' || saved === 'light') htmlEl.setAttribute('data-theme', saved);
    } catch { /* ignore */ }
    if (tbtn) {
      tbtn.setAttribute('aria-checked', String(isDark()));
      const onThemeClick = () => {
        const next = isDark() ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        htmlEl.classList.toggle('dark', next === 'dark');
        tbtn.setAttribute('aria-checked', String(next === 'dark'));
        try { localStorage.setItem('pairlum_theme_mode', next); } catch { /* ignore */ }
      };
      on(tbtn, 'click', onThemeClick);
    }

    // Particle vortex (Three.js), gracefully skipped if the library failed to load
    const hero = root.querySelector<HTMLElement>('#pl-hero');
    const cv = root.querySelector<HTMLCanvasElement>('#pl-fx');
    const journey = root.querySelector<HTMLElement>('#pl-journey');
    const vx = { tx: 0, ty: 0, visible: true };

    try {
      const THREE = win.THREE;
      if (!THREE || !hero || !cv || !journey) throw new Error('three.js unavailable');

      const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
      camera.position.z = 5.5;
      const group = new THREE.Group();
      scene.add(group);

      const N = 16000;
      const pos = new Float32Array(N * 3);
      const rnd = new Float32Array(N * 4);
      for (let i = 0; i < N; i++) {
        rnd[i * 4] = Math.random() * 6.2832;
        rnd[i * 4 + 1] = Math.random() * 6.2832;
        rnd[i * 4 + 2] = Math.pow(Math.random(), 1.5);
        rnd[i * 4 + 3] = Math.random();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 4));
      const uni = { uTime: { value: 0 }, uIntro: { value: 0 }, uSize: { value: 0.022 }, uScale: { value: 1000 } };
      const mat = new THREE.ShaderMaterial({
        uniforms: uni, transparent: true, depthWrite: false,
        vertexShader: [
          'uniform float uTime,uIntro,uSize,uScale;',
          'attribute vec4 aRand;',
          'varying vec3 vCol;varying float vA;',
          'void main(){',
          ' float th=aRand.x+uTime*(0.35+aRand.w*0.25)*(1.0-aRand.z*0.4);',
          ' float tube=0.12+aRand.z*0.5;',
          ' float ph=aRand.y+uTime*0.6*aRand.w;',
          ' float R=1.25+0.15*sin(th*2.0+uTime*0.5);',
          ' float rr=R+cos(ph)*tube;',
          ' vec3 p=vec3(cos(th)*rr,sin(th)*rr,sin(ph)*tube*1.3+0.25*sin(th*3.0+uTime*0.7));',
          ' float s=step(0.5,aRand.w);float a=0.9*s;',
          ' p=vec3(p.x*cos(a)+p.z*sin(a),p.y,-p.x*sin(a)+p.z*cos(a));p.x+=(s*2.0-1.0)*0.55;',
          ' float glow=pow(1.0-aRand.z,2.0)+exp(-pow(p.y*1.6,2.0))*0.55;',
          ' vec3 base=mix(vec3(0.88,0.11,0.28),vec3(0.96,0.62,0.04),s),mid=mix(vec3(1.0,0.36,0.5),vec3(1.0,0.78,0.3),s),hot=vec3(1.0,0.93,0.88);',
          ' vCol=mix(mix(base,mid,aRand.w),hot,clamp(glow*0.8,0.0,1.0));',
          ' vA=uIntro;',
          ' p*=mix(0.15,1.0,uIntro);',
          ' vec4 mv=modelViewMatrix*vec4(p,1.0);',
          ' gl_Position=projectionMatrix*mv;',
          ' gl_PointSize=uSize*(0.6+aRand.w*1.1)*uScale/-mv.z;',
          '}',
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vCol;varying float vA;',
          'void main(){',
          ' float d=length(gl_PointCoord-0.5);',
          ' if(d>0.5)discard;',
          ' gl_FragColor=vec4(vCol,smoothstep(0.5,0.15,d)*vA*0.95);',
          '}',
        ].join('\n'),
      });
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      group.add(pts);

      const M = 2200;
      const dp = new Float32Array(M * 3);
      for (let j = 0; j < M; j++) {
        dp[j * 3] = (Math.random() - 0.5) * 14;
        dp[j * 3 + 1] = (Math.random() - 0.5) * 8;
        dp[j * 3 + 2] = Math.random() * 34 - 28;
      }
      const dg = new THREE.BufferGeometry();
      dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
      const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.75, depthWrite: false }));
      scene.add(dust);

      let W = 1, H = 1, dpr = 1, q = 2, bx = 0, by = 0;

      function render(t: number) {
        uni.uTime.value = t;
        const f = 1 - prog * 0.85;
        group.rotation.y += ((Math.sin(t * 0.3) * 0.5 + vx.tx * 0.7) * f - group.rotation.y) * 0.05;
        group.rotation.x += ((-0.35 + vx.ty * 0.4) * f - group.rotation.x) * 0.05;
        dust.rotation.z = t * 0.03;
        renderer.render(scene, camera);
      }
      function resize() {
        dpr = Math.min(devicePixelRatio || 1, q);
        W = hero!.clientWidth; H = hero!.clientHeight;
        renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
        camera.aspect = W / H; camera.updateProjectionMatrix();
        uni.uScale.value = (H * dpr) / (2 * Math.tan((22.5 * Math.PI) / 180));
        const wide = W / H > 1.1;
        bx = wide ? 1.1 : 0; by = wide ? 0.35 : 0.9; group.position.set(bx, by, 0);
        group.scale.setScalar(wide ? 0.9 : 0.72);
        if (reduce) render(3);
      }

      const h1 = hero!.querySelector<HTMLElement>('h1');
      const tag = hero!.querySelector<HTMLElement>('.tag');
      const gr = hero!.querySelector<HTMLElement>('.ground');
      const veil = hero!.querySelector<HTMLElement>('.veil');
      const wd = hero!.querySelector<HTMLElement>('.world');
      const ss = (a: number, b: number, x: number) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

      function applyProg() {
        const p = prog, o = 1 - ss(0, 0.4, p), k = 1 - Math.min(1, p * 2);
        if (h1) { h1.style.opacity = String(o); h1.style.transformOrigin = '50% 100%'; h1.style.transform = `scale(${1 + p * 0.5})`; }
        if (tag) tag.style.opacity = String(o);
        if (gr) gr.style.transform = `translateY(${ss(0, 0.5, p) * 105}%)`;
        if (veil) veil.style.opacity = String(ss(0.25, 0.85, p));
        if (wd) wd.style.opacity = String(ss(0.72, 0.95, p));
        camera.position.z = 5.5 - 7 * p;
        camera.fov = 45 + p * 20; camera.updateProjectionMatrix();
        uni.uScale.value = (H * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
        group.position.set(bx * k, by * k, 0);
        if (!entered && p > 0.75) { entered = true; enterFx(); }
        if (entered && p < 0.5) entered = false;
      }

      let last = performance.now(), tm = 0, loopRaf = 0;
      function loop(now: number) {
        loopRaf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        act *= 0.95;
        const jr = journey!.getBoundingClientRect();
        const tg = Math.min(1, Math.max(0, -jr.top / (jr.height - innerHeight)));
        prog += (tg - prog) * Math.min(1, dt * 6);
        root!.classList.toggle('deep', vx.visible && prog > 0.5);
        if (!vx.visible) return;
        tm += dt * (1 + act * 2.5 + prog * 4);
        applyProg();
        if (readyAt !== null) {
          const k = Math.min((now - readyAt) / 2200, 1);
          uni.uIntro.value = 1 - Math.pow(1 - k, 3);
        }
        render(tm);
      }

      on(window, 'resize', resize);
      resize();
      const qb = root.querySelector<HTMLButtonElement>('#pl-quality');
      if (qb) {
        const onQuality = () => {
          const hi = qb.getAttribute('aria-checked') !== 'true';
          qb.setAttribute('aria-checked', String(hi));
          geo.setDrawRange(0, hi ? N : 5000);
          q = hi ? 2 : 1;
          resize();
        };
        on(qb, 'click', onQuality);
      }
      if (reduce) { uni.uIntro.value = 1; render(3); } else { loopRaf = requestAnimationFrame(loop); }
      cleanups.push(() => cancelAnimationFrame(loopRaf));

      const onPointerMove = (e: PointerEvent) => {
        const r = hero!.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        act = Math.min(1, act + Math.hypot(nx - vx.tx, ny - vx.ty) * 2);
        vx.tx = nx; vx.ty = ny;
      };
      on(hero!, 'pointermove', onPointerMove);

      const io = new IntersectionObserver((en) => { vx.visible = en[0].isIntersecting; });
      io.observe(hero!);
      cleanups.push(() => io.disconnect());
      cleanups.push(() => { renderer.dispose(); geo.dispose(); dg.dispose(); mat.dispose(); });
    } catch {
      if (cv) cv.style.display = 'none';
    }

    // Ambient sound (synthesized pad + chimes), off by default
    const sbtn = root.querySelector<HTMLButtonElement>('#pl-sound');
    let A: { c: AudioContext; m: GainNode; lp: BiquadFilterNode; d: DelayNode } | null = null;
    let on_ = false;
    let chimeTimer: ReturnType<typeof setTimeout> | undefined;
    const scale = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];

    function build() {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return false;
      const c = new AC();
      const m = c.createGain(); m.gain.value = 0; m.connect(c.destination);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.6; lp.connect(m);
      [110, 164.81, 220, 277.18].forEach((f) => {
        [-6, 6].forEach((dt) => {
          const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt;
          const g = c.createGain(); g.gain.value = 0.028; o.connect(g); g.connect(lp); o.start();
        });
      });
      const lfo = c.createOscillator(); lfo.frequency.value = 0.08;
      const lg = c.createGain(); lg.gain.value = 160;
      lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
      const d = c.createDelay(1); d.delayTime.value = 0.45;
      const fb = c.createGain(); fb.gain.value = 0.5;
      d.connect(fb); fb.connect(d);
      const wet = c.createGain(); wet.gain.value = 0.5; d.connect(wet); wet.connect(m);
      A = { c, m, lp, d };
      return true;
    }
    function chime() {
      if (!A) return;
      const c = A.c, t = c.currentTime, f = scale[Math.floor(Math.random() * scale.length)];
      [1, 2].forEach((h, i) => {
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * h;
        const g = c.createGain(); g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(i ? 0.03 : 0.11, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0005, t + 2.6);
        o.connect(g); g.connect(A!.m); g.connect(A!.d); o.start(t); o.stop(t + 2.7);
      });
    }
    function enterFx() {
      if (!on_ || !A) return;
      const t = A.c.currentTime;
      A.lp.frequency.setTargetAtTime(2200, t, 0.15);
      A.lp.frequency.setTargetAtTime(420, t + 1.6, 0.8);
      [0, 180, 360].forEach((d) => setTimeout(chime, d));
    }
    function loopChime() {
      if (!on_ || !A) return;
      chime();
      A.lp.frequency.setTargetAtTime(420 + act * 900 + prog * 600, A.c.currentTime, 0.25);
      chimeTimer = setTimeout(loopChime, Math.max(350, 900 + Math.random() * 2200 - act * 1200));
    }
    if (sbtn) {
      const onSoundClick = () => {
        if (!on_) {
          if (!A && !build()) return;
          A!.c.resume(); A!.m.gain.setTargetAtTime(0.6, A!.c.currentTime, 0.6);
          on_ = true; loopChime();
        } else {
          on_ = false; clearTimeout(chimeTimer);
          A!.m.gain.setTargetAtTime(0, A!.c.currentTime, 0.25);
        }
        sbtn.setAttribute('aria-checked', String(on_));
      };
      on(sbtn, 'click', onSoundClick);
    }
    const onVisibility = () => {
      if (!A) return;
      if (document.hidden) A.c.suspend(); else if (on_) A.c.resume();
    };
    on(document, 'visibilitychange', onVisibility);
    cleanups.push(() => clearTimeout(chimeTimer));
    cleanups.push(() => { if (A) A.c.close().catch(() => {}); });

    // Enter your world -> scroll through the journey
    const enterBtn = root.querySelector<HTMLButtonElement>('#pl-enter');
    if (enterBtn && journey) {
      const onEnter = () => {
        const top = journey.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + journey.offsetHeight - innerHeight + 1, behavior: reduce ? 'auto' : 'smooth' });
      };
      on(enterBtn, 'click', onEnter);
    }

    // Scroll-linked --p progress for the story blocks
    const pel: HTMLElement[] = Array.from(root.querySelectorAll<HTMLElement>('[data-p]'));
    let scrollTicking = false;
    function updateProgress() {
      const vh = innerHeight;
      pel.forEach((e) => {
        const r = e.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const p = Math.min(1, Math.max(0, 1 - (c - vh * 0.5) / (vh * 0.6)));
        e.style.setProperty('--p', p.toFixed(3));
      });
    }
    if (!reduce) {
      const onScroll = () => {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(() => { scrollTicking = false; updateProgress(); });
        }
      };
      on(window, 'scroll', onScroll, { passive: true });
      on(window, 'resize', updateProgress);
      updateProgress();
    }

    // Floating hearts
    const hc = root.querySelector<HTMLElement>('.hearts');
    if (hc) {
      const cs = ['#E11D48', '#FF6B8A', '#F59E0B', '#FFD166'];
      const nodes: HTMLElement[] = [];
      for (let i = 0; i < 18; i++) {
        const h = document.createElement('i');
        h.textContent = '♥';
        h.style.cssText = `--l:${Math.random() * 96}%;--s:${14 + Math.random() * 26}px;--d:${7 + Math.random() * 7}s;--dl:-${Math.random() * 12}s;--sw:${Math.random() * 80 - 40}px;--c:${cs[i % 4]}`;
        hc.appendChild(h);
        nodes.push(h);
      }
      cleanups.push(() => nodes.forEach((n) => n.remove()));
    }

    // Demo photo picker previews
    const pickInputs: HTMLInputElement[] = Array.from(root.querySelectorAll<HTMLInputElement>('.pick'));
    const pickHandlers = pickInputs.map((inp: HTMLInputElement) => {
      const handler = () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        const ph = inp.parentElement as HTMLElement;
        const url = URL.createObjectURL(f);
        ph.style.background = `center/cover no-repeat url("${url}")`;
        ph.classList.add('has');
        const hint = ph.querySelector<HTMLElement>('.hint');
        if (hint) hint.textContent = 'Change';
      };
      inp.addEventListener('change', handler);
      return { inp, handler };
    });
    cleanups.push(() => pickHandlers.forEach(({ inp, handler }) => inp.removeEventListener('change', handler)));

    // Settings panel open/close
    const sb = root.querySelector<HTMLButtonElement>('#pl-setbtn');
    const sp = root.querySelector<HTMLElement>('#pl-setpanel');
    if (sb && sp) {
      const setOpen = (o: boolean) => { sb.setAttribute('aria-expanded', String(o)); sp.hidden = !o; };
      const onSetClick = (e: Event) => { e.stopPropagation(); setOpen(sp.hidden); };
      const onDocClick = (e: Event) => { if (!sp.contains(e.target as Node)) setOpen(false); };
      const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
      on(sb, 'click', onSetClick);
      on(document, 'click', onDocClick);
      on(document, 'keydown', onKeydown);
    }

    return () => {
      cleanups.forEach((fn) => { try { fn(); } catch { /* ignore */ } });
    };
  }, []);

  return (
    <div ref={rootRef} className="pl-landing">
      <style>{LANDING_STYLES}</style>
      <div className="loader" aria-hidden="true">
        <p>Your story is loading, please wait</p>
        <div><b id="pl-count">000</b><small>out of 100%</small></div>
      </div>

      <header>
        <a href="#pl-top" className="logo" aria-label="Pairlum, home">Pairlum</a>
        <nav aria-label="Main">
          <div className="links">
            <a href="#pl-about">About</a>
            <a href="#pl-services">Memories</a>
            <button type="button" onClick={scrollToStart}>Join</button>
          </div>
          <div className="settings">
            <button className="set-btn" id="pl-setbtn" type="button" aria-expanded="false" aria-controls="pl-setpanel">Settings</button>
            <div className="panel" id="pl-setpanel" hidden>
              <button className="sw" id="pl-sound" type="button" role="switch" aria-checked="false"><span>Sound</span><b /></button>
              <button className="sw" id="pl-theme" type="button" role="switch" aria-checked="false"><span>Dark mode</span><b /></button>
              <button className="sw" id="pl-quality" type="button" role="switch" aria-checked="true"><span>Quality</span><b /></button>
            </div>
          </div>
          <button className="pill" type="button" onClick={scrollToStart}>Start together</button>
        </nav>
      </header>

      <main id="pl-top">
        <section className="journey" id="pl-journey">
          <div className="hero" id="pl-hero">
            <div className="veil" />
            <canvas id="pl-fx" aria-hidden="true" />
            <p className="tag">A private space for two, made to keep what matters</p>
            <h1>
              <span><i>Where two people</i></span>
              <span><i>make memories</i></span>
              <span><i>worth keeping</i></span>
            </h1>
            <div className="ground">
              <svg className="rocks" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,100 L0,62 30,40 60,54 90,20 140,46 170,72 230,30 280,56 330,26 380,62 430,42 470,74 520,52 560,14 620,48 660,72 720,36 770,60 820,22 880,54 930,70 990,38 1040,58 1090,28 1140,56 1200,46 L1200,100 Z" />
              </svg>
              <div className="hero-foot">
                <p>Scroll to step into your world together</p>
                <button className="pill" id="pl-enter" type="button">Enter your world</button>
              </div>
            </div>
            <div className="world">
              <h2>Welcome to Pairlum</h2>
              <p>This is where your memories live. Keep scrolling to see how.</p>
            </div>
          </div>
        </section>

        <section className="blk b1" id="pl-about" data-p>
          <div className="txt">
            <span className="lab">Together</span>
            <h2>Every couple has a story</h2>
            <p>Pairlum gives yours a place to live, grow and be revisited.</p>
          </div>
          <div className="viz">
            <svg viewBox="0 0 400 300" role="img" aria-label="Two circles drifting together until they overlap around a heart">
              <defs>
                <linearGradient id="pl-gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF6B8A" /><stop offset="1" stopColor="#E11D48" /></linearGradient>
                <linearGradient id="pl-gB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD166" /><stop offset="1" stopColor="#D97706" /></linearGradient>
              </defs>
              <circle className="orb" cx="200" cy="150" r="142" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" opacity=".55" />
              <circle className="c1" cx="150" cy="150" r="100" fill="url(#pl-gA)" opacity=".82" />
              <circle className="c2" cx="250" cy="150" r="100" fill="url(#pl-gB)" opacity=".82" />
              <path className="hrt" d="M200 178 C168 155 168 128 186 124 C195 122 200 129 200 135 C200 129 205 122 214 124 C232 128 232 155 200 178Z" fill="#FFF0FA" />
            </svg>
          </div>
        </section>

        <section className="blk b2 flip" data-p>
          <div className="txt">
            <span className="lab">Moments</span>
            <h2>Small days become memories</h2>
            <p>Save the detour, the dinner, the inside joke: the moments that never make it into a photo album.</p>
          </div>
          <div className="viz">
            <div className="stack">
              <figure className="pol" style={{ '--r': '-11deg', '--x': '-70px', '--y': '10px' } as CSSVars}>
                <div className="ph ph1"><input className="pick" type="file" accept="image/*" aria-label="Add your photo" /><span className="hint">+ Add photo</span></div>
                <figcaption>Sunset, wrong exit</figcaption>
              </figure>
              <figure className="pol" style={{ '--r': '9deg', '--x': '75px', '--y': '-6px' } as CSSVars}>
                <div className="ph ph2"><input className="pick" type="file" accept="image/*" aria-label="Add your photo" /><span className="hint">+ Add photo</span></div>
                <figcaption>Lake house, 2 a.m.</figcaption>
              </figure>
              <figure className="pol" style={{ '--r': '-2deg', '--x': '0px', '--y': '-14px' } as CSSVars}>
                <div className="ph ph3"><input className="pick" type="file" accept="image/*" aria-label="Add your photo" /><span className="hint">+ Add photo</span></div>
                <figcaption>First dinner, first laugh</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="blk b3" data-p>
          <div className="txt">
            <span className="lab">Shared</span>
            <h2>Built for two</h2>
            <p>One space, two people. Add together, look back together.</p>
          </div>
          <div className="viz braid">
            <svg viewBox="0 0 400 420" role="img" aria-label="Two strands, one from each partner, weaving together">
              <path pathLength={1} d="M120 10 C320 90 320 150 200 210 C80 270 80 330 280 410" stroke="#E11D48" />
              <path pathLength={1} d="M280 10 C80 90 80 150 200 210 C320 270 320 330 120 410" stroke="#F59E0B" />
              <circle className="nd" style={{ '--t': '.3' } as CSSVars} cx="280" cy="117.5" r="9" fill="#E11D48" />
              <circle className="nd" style={{ '--t': '.3' } as CSSVars} cx="120" cy="117.5" r="9" fill="#F59E0B" />
              <circle className="nd" style={{ '--t': '.5' } as CSSVars} cx="200" cy="210" r="13" fill="#FFF0FA" stroke="#E11D48" strokeWidth="4" />
              <circle className="nd" style={{ '--t': '.7' } as CSSVars} cx="120" cy="302.5" r="9" fill="#E11D48" />
              <circle className="nd" style={{ '--t': '.7' } as CSSVars} cx="280" cy="302.5" r="9" fill="#F59E0B" />
            </svg>
            <span className="chip" style={{ '--t': '.3', '--c': '#E11D48', top: '21%', right: 0 } as CSSVars}>Our first trip</span>
            <span className="chip" style={{ '--t': '.35', '--c': '#F59E0B', top: '21%', left: 0 } as CSSVars}>Sunday pancakes</span>
            <span className="chip" style={{ '--t': '.7', '--c': '#E11D48', top: '65%', left: 0 } as CSSVars}>Moved in together</span>
            <span className="chip" style={{ '--t': '.75', '--c': '#F59E0B', top: '65%', right: 0 } as CSSVars}>Rainy-day playlist</span>
          </div>
        </section>

        <section className="blk b4 flip" data-p>
          <div className="hearts" aria-hidden="true" />
          <div className="txt">
            <span className="lab">Private</span>
            <h2>Just yours</h2>
            <p>Kept between the two of you, so you can be as honest and as silly as you like.</p>
          </div>
          <div className="viz">
            <svg viewBox="0 0 400 400" role="img" aria-label="A glowing heart with a keyhole, orbited by two dots">
              <defs><linearGradient id="pl-gH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF4D6D" /><stop offset="1" stopColor="#F59E0B" /></linearGradient></defs>
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <circle className="ping" cx="200" cy="200" r="120" />
                <circle className="ping" cx="200" cy="200" r="120" style={{ animationDelay: '1.2s' }} />
                <circle className="ping" cx="200" cy="200" r="120" style={{ animationDelay: '2.4s' }} />
                <circle cx="200" cy="200" r="150" strokeDasharray="2 9" strokeLinecap="round" opacity=".5" />
              </g>
              <g className="orbit"><circle cx="200" cy="50" r="9" fill="#E11D48" /><circle cx="200" cy="350" r="9" fill="#F59E0B" /></g>
              <g className="heart"><g className="beat">
                <path d="M200 300 C90 230 90 130 150 115 C180 108 200 128 200 145 C200 128 220 108 250 115 C310 130 310 230 200 300Z" fill="url(#pl-gH)" />
                <circle cx="200" cy="185" r="15" fill="#FFF0FA" /><rect x="195" y="193" width="10" height="32" rx="4" fill="#FFF0FA" />
              </g></g>
            </svg>
          </div>
        </section>

        <section className="what" id="pl-services">
          <p className="lead">Pairlum turns everyday moments into a shared timeline, from first dates to whole decades. Start with one memory, then keep building.</p>
          <button className="pill" type="button" onClick={scrollToStart}>See how it works</button>
          <ol className="svc">
            {SERVICES.map((s, i) => (
              <li key={s}><span>({String(i + 1).padStart(3, '0')})</span>{s}</li>
            ))}
          </ol>
        </section>

        <section className="start" ref={startRef}>
          <p className="lead">{!session ? 'Sign in or create an account to begin' : 'Almost there'}</p>
          <div className="w-full max-w-sm">
            {!session ? <LoginOrSignup /> : !membership ? <Pairing /> : null}
          </div>
        </section>
      </main>
    </div>
  );
};

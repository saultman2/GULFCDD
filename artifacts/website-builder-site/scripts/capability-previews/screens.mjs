// Compositions for the 20 capability preview screenshots.
// Shared primitives at the top; each screen below has its own fictional brand.
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const photo = (n) => `file://${here}/photos/${n}.jpg`;
const font = (f) => `file://${here}/fonts/${f}.woff2`;
const poppins = (w) => `file://${path.resolve(here, "../../public/fonts")}/poppins-${w}.woff2`;

const fontFaces = [
  ["Fraunces", 600, font("Fraunces-600")], ["DM Sans", 400, font("DMSans-400")], ["DM Sans", 500, font("DMSans-500")],
  ["DM Sans", 700, font("DMSans-700")], ["Playfair", 700, font("PlayfairDisplay-700")], ["Space Grotesk", 500, font("SpaceGrotesk-500")],
  ["Space Grotesk", 700, font("SpaceGrotesk-700")], ["Archivo Black", 400, font("ArchivoBlack-400")], ["Baskerville", 700, font("LibreBaskerville-700")],
  ["Poppins", 400, poppins(400)], ["Poppins", 600, poppins(600)], ["Poppins", 800, poppins(800)],
].map(([f, w, u]) => `@font-face{font-family:"${f}";font-weight:${w};src:url(${u}) format("woff2")}`).join("");

const baseCss = `${fontFaces}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:788px;overflow:hidden}
body{font-family:"DM Sans",sans-serif;color:#1d2230;background:#e9e5dc;-webkit-font-smoothing:antialiased}
.win{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff}
.chrome{height:40px;flex:none;background:#eceae6;border-bottom:1px solid #d6d2ca;display:flex;align-items:center;gap:14px;padding:0 14px}
.dots{display:flex;gap:7px}.dots i{width:11px;height:11px;border-radius:50%;background:#e06c5f}.dots i:nth-child(2){background:#e4b448}.dots i:nth-child(3){background:#5fb760}
.url{flex:1;max-width:560px;height:26px;border-radius:13px;background:#fff;border:1px solid #d6d2ca;display:flex;align-items:center;gap:8px;padding:0 12px;font:500 13px "DM Sans";color:#4a4f5c}
.url svg{flex:none}
.view{flex:1;position:relative;overflow:hidden}
.sample{position:absolute;right:14px;bottom:12px;z-index:50;background:rgba(20,22,28,.86);color:#fff;font:600 11px "Poppins";letter-spacing:.06em;text-transform:uppercase;padding:6px 11px;border-radius:999px}
img{display:block;object-fit:cover}
.lbl{font-size:11px;font-weight:700;letter-spacing:.04em;margin-bottom:5px;display:block}
.inp{border:1px solid #cfd3db;border-radius:7px;padding:9px 11px;font-size:14px;background:#fff;color:#1d2230}
.star{color:#e7a92b;letter-spacing:2px}
`;
const lock = `<svg width="12" height="13" viewBox="0 0 12 13"><rect x="1.5" y="5.5" width="9" height="7" rx="1.5" fill="#3d7d55"/><path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="#3d7d55" stroke-width="1.5" fill="none"/></svg>`;
const doc = (url, css, body, opts = {}) => `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}${css}</style></head><body>
${opts.bare ? body : `<div class="win"><div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url">${lock}${url}</div></div><div class="view">${body}</div></div>`}
<div class="sample">${opts.badge ?? "Sample design · fictional business"}</div></body></html>`;

const icon = {
  phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
  msg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  pin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>`,
  cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>`,
  play: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>`,
  mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
};
const social = (bg, fg) => ["Facebook", "Instagram", "YouTube", "TikTok"].map((s) =>
  `<span style="display:inline-flex;align-items:center;gap:6px;background:${bg};color:${fg};padding:7px 12px;border-radius:999px;font-size:12px;font-weight:700">${socialGlyph(s, fg)}${s}</span>`).join("");
function socialGlyph(s, c) {
  if (s === "Facebook") return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${c}"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/></svg>`;
  if (s === "Instagram") return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`;
  if (s === "YouTube") return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${c}"><path d="M2 7c0-2 1-3 3-3h14c2 0 3 1 3 3v10c0 2-1 3-3 3H5c-2 0-3-1-3-3zm8 2v6l5-3z"/></svg>`;
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${c}"><path d="M15 2c.4 3 2.3 4.7 5 5v3.5c-1.9 0-3.6-.6-5-1.6V16a6 6 0 1 1-6-6v3.6a2.5 2.5 0 1 0 2.5 2.4V2z"/></svg>`;
}

export const screens = {};

/* 1 ─ One page site: Live Oak Lawn Co. */
screens["service-one-page"] = doc("liveoaklawn.example", `
.s{font-family:"DM Sans"}.nav{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:18px 40px;color:#fff}
.logo{font:600 22px "Fraunces"}.nav a{font-size:14px;font-weight:500;margin-left:24px;opacity:.9}
.hero{position:relative;height:420px}.hero img{width:100%;height:100%}.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,32,45,.88),rgba(14,32,45,.25))}
.hc{position:absolute;z-index:2;left:40px;top:84px;color:#fff;width:540px}.hc h1{font:600 48px/1.05 "Fraunces";margin:10px 0 14px}.hc p{font-size:17px;opacity:.9;line-height:1.5}
.btn{display:inline-block;background:#f2c14e;color:#13283a;font-weight:700;padding:13px 22px;border-radius:8px;margin-top:20px;margin-right:10px}.ghost{border:1.5px solid rgba(255,255,255,.6);color:#fff;background:none}
.row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:26px 40px 0}.card{border:1px solid #e3e6e0;border-radius:12px;padding:16px}.card b{font:600 18px "Fraunces";color:#13283a;display:block;margin-bottom:6px}.card p{font-size:13px;color:#56606b;line-height:1.45}.card em{display:block;font-style:normal;color:#2f6f4f;font-weight:700;font-size:13px;margin-top:10px}
.strip{margin:18px 40px 0;background:#13283a;color:#fff;border-radius:12px;display:grid;grid-template-columns:1.1fr 1fr 1fr;padding:20px 24px;gap:20px}.strip h4{font:600 16px "Fraunces";color:#f2c14e;margin-bottom:6px}.strip p{font-size:13px;line-height:1.6;opacity:.9}
.rail{position:absolute;right:16px;top:120px;z-index:6;background:rgba(255,255,255,.95);border-radius:10px;padding:12px 14px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.18)}.rail div{display:flex;gap:8px;align-items:center;padding:4px 0;color:#56606b}.rail i{width:8px;height:8px;border-radius:50%;background:#cfd6cf}.rail .on{color:#13283a;font-weight:700}.rail .on i{background:#f2c14e}
`, `<div class="s"><div class="nav"><div class="logo">Live Oak Lawn Co.</div><div><a>Services</a><a>Hours</a><a>Service area</a><a>Contact</a></div></div>
<div class="hero"><img src="${photo("lawn")}" style="object-position:center 60%"><div class="hc"><small style="letter-spacing:.14em;font-weight:700;font-size:12px;color:#f2c14e">MOWING · EDGING · SEASONAL CLEANUPS</small><h1>Sharp lawns for busy Long Beach homeowners.</h1><p>Weekly and every-other-week service, same crew each visit. Text a photo of your yard and get a price the same day.</p><span class="btn">Request a quote</span><span class="btn ghost">(228) 555-0147</span></div></div>
<div class="row"><div class="card"><b>Weekly mowing</b><p>Mow, string-trim, edge walks, and blow off drives and porches.</p><em>From $45 per visit</em></div><div class="card"><b>Hedge &amp; shrub care</b><p>Shaping for azaleas, boxwoods and hedges every 6 to 8 weeks.</p><em>Quoted by yard</em></div><div class="card"><b>Leaf &amp; storm cleanup</b><p>Limbs, leaves and debris hauled away after fall and storms.</p><em>From $120</em></div><div class="card"><b>Mulch &amp; beds</b><p>Fresh pine straw or mulch, weeded beds, crisp edges.</p><em>Spring booking open</em></div></div>
<div class="strip"><div><h4>Hours</h4><p>Mon to Fri, 7:00 am to 6:00 pm<br>Saturday, 8:00 am to noon<br>Closed Sunday</p></div><div><h4>Service area</h4><p>Long Beach, Pass Christian, Gulfport and Diamondhead</p></div><div><h4>Contact</h4><p>(228) 555-0147<br>hello@liveoaklawn.example</p></div></div>
<div class="rail"><div class="on"><i></i>Top</div><div><i></i>Services</div><div><i></i>Hours</div><div><i></i>Service area</div><div><i></i>Contact</div></div></div>`);

/* 2 ─ Full business site: Tidewater Homebuilders */
screens["service-multipage"] = doc("tidewaterhomes.example/about", `
.top{display:flex;align-items:center;justify-content:space-between;padding:0 36px;height:70px;border-bottom:1px solid #e7e1d6;background:#faf7f1}
.logo{font:700 20px "Playfair";color:#1e3a34}.logo small{display:block;font:500 10px "DM Sans";letter-spacing:.2em;color:#a0742f}
.menu a{font-size:14px;margin-left:26px;color:#3b4740;padding-bottom:6px}.menu a.on{color:#1e3a34;font-weight:700;border-bottom:2px solid #a0742f}
.cta{background:#1e3a34;color:#fff;padding:10px 16px;border-radius:6px;font-weight:700;font-size:13px;margin-left:26px}
.crumb{padding:18px 36px 0;font-size:12px;color:#8a8576}
.body{display:grid;grid-template-columns:1fr 1fr;gap:34px;padding:12px 36px 0}
h1{font:700 40px/1.1 "Playfair";color:#1e3a34;margin-bottom:14px}.stats{padding-top:18px;border-top:1px solid #e7e1d6}.body p{font-size:15px;line-height:1.65;color:#4a524c;margin-bottom:12px}
.stats{display:flex;gap:26px;margin-top:16px}.stats b{font:700 28px "Playfair";color:#a0742f;display:block}.stats span{font-size:12px;color:#6c6a60}
.ph{position:relative}.ph img{width:100%;height:410px;border-radius:6px}.ph .tag{position:absolute;left:-20px;bottom:26px;background:#faf7f1;padding:14px 18px;border-left:3px solid #a0742f;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.pages{position:absolute;left:0;right:0;bottom:0;height:120px;background:#1e3a34;display:flex;gap:16px;padding:16px 36px;align-items:center}
.pg{flex:1;background:#faf7f1;border-radius:6px;height:88px;overflow:hidden;display:flex}.pg img{width:90px;height:100%}.pg div{padding:10px 12px;font-size:12px;color:#4a524c}.pg b{display:block;font:700 15px "Playfair";color:#1e3a34;margin-bottom:3px}
.pg.on{outline:3px solid #d9a95a}
`, `<div class="top"><div class="logo">Tidewater Homebuilders<small>CUSTOM HOMES · OCEAN SPRINGS</small></div><div class="menu"><a>Home</a><a class="on">About</a><a>Services</a><a>Gallery</a><a>Contact</a><span class="cta">Start your project</span></div></div>
<div class="crumb">Home / About us</div>
<div class="body"><div><h1>Three generations building on the Coast.</h1><p>We are a family builder with one crew lead per home, start to finish. You get a weekly photo update, a shared selections sheet, and one phone number that always answers.</p><p>Our homes are designed for coastal wind codes, raised foundations, and long Mississippi summers, without losing the porches and light that make a house feel like home.</p>
<div class="stats"><div><b>1987</b><span>Family business since</span></div><div><b>Weekly</b><span>Photo progress reports</span></div><div><b>5 pages</b><span>One shared menu</span></div></div></div>
<div class="ph"><img src="${photo("home")}"><div class="tag"><b style="font-family:Playfair;color:#1e3a34">Meet the crew lead</b><br>Every home has one point of contact.</div></div></div>
<div class="pages"><div class="pg"><img src="${photo("kitchen")}"><div><b>Home</b>Custom coastal homes</div></div><div class="pg on"><img src="${photo("home")}"><div><b>About</b>Our story and crew</div></div><div class="pg"><img src="${photo("porch")}"><div><b>Services</b>Builds, additions, porches</div></div><div class="pg"><img src="${photo("bath")}"><div><b>Gallery</b>Finished projects</div></div><div class="pg"><img src="${photo("deck")}"><div><b>Contact</b>Visit or call</div></div></div>`);

/* 3 ─ Search-ready structure: Bayline Roofing */
screens["service-search-structure"] = doc("baylineroofing.example/roof-replacement-biloxi", `
.top{display:flex;justify-content:space-between;align-items:center;height:60px;padding:0 32px;background:#14213d;color:#fff}.logo{font:700 19px "Space Grotesk"}.logo span{color:#fca311}.top a{font-size:13px;margin-left:20px;opacity:.85}
.wrap{display:grid;grid-template-columns:1fr 330px;gap:28px;padding:22px 32px}
.crumb{font-size:12px;color:#6b7280;margin-bottom:10px}.crumb u{color:#1d4ed8}
h1{font:700 34px/1.15 "Space Grotesk";color:#14213d;margin-bottom:10px}
.lead{font-size:15px;line-height:1.6;color:#374151;margin-bottom:14px}
.img{position:relative}.img img{width:100%;height:190px;border-radius:8px}
h2{font:700 21px "Space Grotesk";color:#14213d;margin:16px 0 6px}
.main p{font-size:14px;line-height:1.6;color:#4b5563}.main a{color:#1d4ed8;text-decoration:underline;font-weight:600}
.note{position:absolute;background:#fca311;color:#14213d;font:700 11px "Space Grotesk";padding:4px 8px;border-radius:4px;letter-spacing:.03em;box-shadow:0 4px 10px rgba(0,0,0,.15)}
.side{border:1px dashed #9ca3af;border-radius:10px;padding:16px;background:#f9fafb;font-size:13px}
.side h3{font:700 13px "Space Grotesk";letter-spacing:.1em;color:#6b7280;margin-bottom:12px}
.f{margin-bottom:12px}.f span{display:block;font-size:11px;font-weight:700;color:#6b7280;margin-bottom:3px}.f div{background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:8px 10px;color:#111827;line-height:1.4}
.f small{color:#15803d;font-weight:700;font-size:11px}
`, `<div class="top"><div class="logo">BAYLINE<span>.</span>ROOFING</div><div><a>Roof replacement</a><a>Storm repair</a><a>Inspections</a><a>Areas</a><a style="background:#fca311;color:#14213d;padding:8px 12px;border-radius:6px;font-weight:700;opacity:1">(228) 555-0193</a></div></div>
<div class="wrap"><div class="main" style="position:relative">
<div class="crumb"><u>Home</u> › <u>Services</u> › Roof replacement in Biloxi</div>
<h1>Roof Replacement in Biloxi, MS</h1>
<p class="lead">Architectural shingle and metal roof replacement for Biloxi and D'Iberville homes, with a written inspection before any price.</p>
<div class="img"><img src="${photo("roof")}"></div>
<h2>What a replacement includes</h2>
<p>Tear-off down to the deck, new synthetic underlayment, drip edge, ridge venting and a full cleanup. See our <a>storm damage repair</a> page or <a>book a roof inspection</a>.</p><h2>Materials we install</h2><p>Architectural shingles rated for 130 mph winds, standing seam metal, and <a>fortified roof upgrades</a> that may qualify for insurance discounts.</p>
<span class="note" style="left:250px;top:-3px">BREADCRUMB</span><span class="note" style="right:0;top:40px">H1 · ONE PER PAGE</span><span class="note" style="right:0;top:296px">H2 SUBHEADING</span><span class="note" style="right:0;top:380px">INTERNAL LINKS</span><span class="note" style="left:12px;top:150px;background:#fff;border:1px solid #fca311">IMAGE ALT: Crew installing shingles on a Biloxi home</span>
</div>
<div class="side"><h3>BEHIND THE PAGE</h3>
<div class="f"><span>Page title</span><div>Roof Replacement in Biloxi, MS | Bayline Roofing</div><small>52 characters</small></div>
<div class="f"><span>Meta description</span><div>Shingle and metal roof replacement in Biloxi with a written inspection first. Call (228) 555-0193.</div><small>101 characters</small></div>
<div class="f"><span>Web address</span><div>/roof-replacement-biloxi</div></div>
<div class="f"><span>Heading outline</span><div>H1 Roof Replacement in Biloxi, MS<br>&nbsp;&nbsp;H2 What a replacement includes<br>&nbsp;&nbsp;H2 Materials we install<br>&nbsp;&nbsp;H2 Questions homeowners ask</div></div>
<div style="font-size:11px;color:#6b7280">Structure helps pages be understood. Ranking is never guaranteed.</div></div></div>`);

/* 4 ─ Online store: Salt & Wick Candle Co. */
screens["service-online-store"] = doc("saltandwick.example/shop", `
.top{display:flex;align-items:center;justify-content:space-between;padding:0 30px;height:64px;background:#f4ede4;border-bottom:1px solid #e2d7c8}
.logo{font:600 24px "Fraunces";color:#3a2a4a}.top a{font-size:13px;margin-right:22px;color:#5c4b5c}
.bag{display:inline-flex;align-items:center;gap:6px;background:#3a2a4a;color:#fff;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:700}
.main{position:absolute;left:0;top:64px;right:340px;bottom:0;padding:22px 30px;background:#fbf8f3}
.chips{display:flex;gap:8px;margin:8px 0 16px}.chips span{font-size:12px;padding:6px 12px;border:1px solid #d8ccbb;border-radius:999px;color:#5c4b5c}.chips .on{background:#3a2a4a;color:#fff;border-color:#3a2a4a}
h1{font:600 30px "Fraunces";color:#3a2a4a}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.zc{height:250px;border-radius:10px;overflow:hidden;background:#eee}.zc img{height:250px;width:auto;max-width:none;transform:scale(1.9);transform-origin:0 70%}.mini{width:56px;height:56px;border-radius:8px;overflow:hidden;flex:none}.li .mini{flex:none;width:56px}.li .mini img{height:56px;width:auto;max-width:none;transform:scale(1.9);transform-origin:0 70%}.p b{display:block;font:600 16px "Fraunces";color:#3a2a4a;margin-top:10px}.p small{font-size:12px;color:#8a7a86}.p .pr{display:flex;justify-content:space-between;align-items:center;margin-top:8px}.p .pr span{font-weight:700;color:#3a2a4a}.p .pr em{font-style:normal;font-size:12px;font-weight:700;color:#3a2a4a;border:1.5px solid #3a2a4a;padding:6px 10px;border-radius:999px}
.p .pr em.in{background:#3a2a4a;color:#fff}
.cart{position:absolute;right:0;top:64px;bottom:0;width:340px;background:#fff;border-left:1px solid #e2d7c8;padding:22px;box-shadow:-12px 0 30px rgba(58,42,74,.08)}
.cart h3{font:600 20px "Fraunces";color:#3a2a4a;margin-bottom:14px}.li{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #f0e8de}.li img{width:56px;height:56px;border-radius:8px}.li div{flex:1;font-size:13px}.li b{display:block;color:#3a2a4a}.li small{color:#8a7a86}.li span{font-weight:700;font-size:14px}
.qty{display:inline-flex;border:1px solid #d8ccbb;border-radius:6px;margin-top:4px;font-size:12px}.qty i{font-style:normal;padding:1px 8px}
.tot{font-size:13px;color:#5c4b5c;margin-top:14px}.tot div{display:flex;justify-content:space-between;padding:4px 0}.tot .g{font-weight:700;color:#3a2a4a;font-size:16px;border-top:1px solid #e2d7c8;padding-top:10px;margin-top:6px}
.co{margin-top:16px;background:#3a2a4a;color:#fff;text-align:center;padding:13px;border-radius:999px;font-weight:700}.ship{margin-top:10px;font-size:12px;color:#2f7a5b;background:#eaf5ef;padding:8px 10px;border-radius:6px}
`, `<div class="top"><div class="logo">Salt &amp; Wick</div><div><a>Shop</a><a>Scents</a><a>Gift sets</a><a>Our studio</a><span class="bag">${icon.cart} Bag (3)</span></div></div>
<div class="main"><h1>Hand-poured coastal candles</h1><div class="chips"><span class="on">All candles</span><span>8 oz jars</span><span>Travel tins</span><span>Gift sets</span><span>Sort: Best sellers</span></div>
<div class="grid"><div class="p"><div class="zc"><img src="${photo("candles")}" style="margin-left:-58px"></div><b>Sandalwood + Amber</b><small>Warm woods, resin, vanilla · 8 oz</small><div class="pr"><span>$28.00</span><em class="in">Added</em></div></div>
<div class="p"><div class="zc"><img src="${photo("candles")}" style="margin-left:-136px"></div><b>Lavender + Sage</b><small>Herbal, calming, clean · 8 oz</small><div class="pr"><span>$28.00</span><em>Add to bag</em></div></div>
<div class="p"><div class="zc"><img src="${photo("candles")}" style="margin-left:-218px"></div><b>Oakmoss + Vetiver</b><small>Green, earthy, smoky · 8 oz</small><div class="pr"><span>$32.00</span><em class="in">Added</em></div></div></div>
<div style="display:flex;gap:24px;margin-top:22px;padding-top:16px;border-top:1px solid #e2d7c8;font-size:12px;color:#5c4b5c"><span><b style="color:#3a2a4a">Small batch</b> · poured weekly</span><span><b style="color:#3a2a4a">40 to 50 hour</b> burn time</span><span><b style="color:#3a2a4a">Gift wrap</b> at checkout</span></div></div>
<div class="cart"><h3>Your bag</h3>
<div class="li"><div class="mini" style="background:url(${photo("candles")}) 12% 62%/340% auto"></div><div><b>Sandalwood + Amber</b><small>8 oz jar</small><br><span class="qty"><i>−</i><i>2</i><i>+</i></span></div><span>$56.00</span></div>
<div class="li"><div class="mini" style="background:url(${photo("candles")}) 74% 62%/340% auto"></div><div><b>Oakmoss + Vetiver</b><small>8 oz jar</small><br><span class="qty"><i>−</i><i>1</i><i>+</i></span></div><span>$32.00</span></div>
<div class="tot"><div><span>Subtotal</span><span>$88.00</span></div><div><span>Shipping</span><span>Calculated next</span></div><div class="g"><span>Estimated total</span><span>$88.00</span></div></div>
<div class="ship">Local pickup available in Bay St. Louis</div><div class="co">Continue to checkout</div><div style="font-size:11px;color:#8a7a86;text-align:center;margin-top:8px">Picture only. No real purchase.</div></div>`);

/* 5 ─ Landing page: Brightline Pressure Washing */
screens["service-landing-page"] = doc("brightlinewash.example/driveway-spring", `
.v{background:#0e3b43;height:100%;color:#fff}
.top{display:flex;justify-content:space-between;align-items:center;padding:18px 36px}.logo{font:400 20px "Archivo Black";letter-spacing:.02em}.logo span{color:#7ee0c3}.top b{font-size:15px}
.grid{display:grid;grid-template-columns:1.2fr 1fr;gap:34px;padding:10px 36px}
.tag{display:inline-block;background:#7ee0c3;color:#0e3b43;font-weight:700;font-size:12px;padding:5px 10px;border-radius:4px;letter-spacing:.06em}
h1{font:400 44px/1.05 "Archivo Black";margin:14px 0}h1 em{font-style:normal;color:#7ee0c3}
.lead{font-size:16px;line-height:1.55;opacity:.88;margin-bottom:16px}
.img{position:relative;height:230px;border-radius:12px;overflow:hidden}.img img{width:100%;height:100%}.img span{position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,.6);font-size:11px;padding:4px 8px;border-radius:4px}
ul{list-style:none;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:16px}li{background:rgba(255,255,255,.07);border-radius:8px;padding:10px;font-size:13px;line-height:1.4}li b{display:block;color:#7ee0c3;font-size:15px}
.form{background:#fdfbf6;color:#1b2a2e;border-radius:14px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.3)}.form h3{font:400 22px "Archivo Black";color:#0e3b43}.form p{font-size:13px;color:#56656a;margin:4px 0 14px}
.f{margin-bottom:11px}.f .inp{width:100%}.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sz{display:flex;gap:6px}.sz span{flex:1;text-align:center;font-size:12px;border:1px solid #cfd3db;border-radius:6px;padding:8px 4px}.sz .on{background:#0e3b43;color:#fff;border-color:#0e3b43}
.go{background:#ff7a45;color:#fff;text-align:center;font-weight:700;padding:13px;border-radius:8px;margin-top:6px}
`, `<div class="v"><div class="top"><div class="logo">BRIGHTLINE<span>/</span>WASH</div><b>${"(228) 555-0162"}</b></div>
<div class="grid"><div><span class="tag">SPRING DRIVEWAY OFFER · ENDS MAY 31</span><h1>Pollen-stained driveway? <em>$149</em> makes it new.</h1><p class="lead">Surface-cleaner wash for driveways up to 2 car widths, with walkway and front steps included. Booked within the week across Gulfport and Biloxi.</p>
<div class="img"><img src="${photo("pressure")}"><span>Real cleaning, illustrated sample</span></div>
<ul><li><b>2 car width</b>Driveway, walk and front steps</li><li><b>No harsh streaks</b>Rotary surface cleaner</li><li><b>Soft wash</b>Safe for plants and pets</li></ul></div>
<div class="form"><h3>Claim the $149 driveway wash</h3><p>Reply within one business day with a confirmed date.</p>
<div class="two"><div class="f"><span class="lbl">First name</span><div class="inp">Dana</div></div><div class="f"><span class="lbl">Mobile</span><div class="inp">(228) 555-0118</div></div></div>
<div class="f"><span class="lbl">Street address</span><div class="inp">412 Seaway Ct, Gulfport</div></div>
<div class="f"><span class="lbl">Driveway size</span><div class="sz"><span>1 car</span><span class="on">2 car</span><span>3 car +</span></div></div>
<div class="f"><span class="lbl">Anything we should know?</span><div class="inp" style="height:58px">Oil spot near the garage, gate code 2210.</div></div>
<div class="go">Request my spring wash</div><div style="font-size:11px;color:#7a868a;text-align:center;margin-top:8px">Illustration only. Form does not submit.</div></div></div></div>`);

/* 6 ─ Redesign: Coastline Fence & Gate */
screens["service-redesign"] = doc("coastlinefence.example", `
.split{display:grid;grid-template-columns:1fr 1fr;height:100%}
.old{background:#d8d8c8;font-family:"DejaVu Serif",serif;padding:14px;position:relative;filter:saturate(.7)}
.old .hd{background:#2f4f2f;color:#ff0;font-size:26px;text-align:center;padding:10px;border:3px ridge #999}
.old .mq{background:#000;color:#0f0;font-size:12px;padding:4px;margin:6px 0;white-space:nowrap;overflow:hidden}
.old table{width:100%;border-collapse:collapse;font-size:11px}.old td{border:1px solid #888;padding:5px;vertical-align:top;background:#eee}
.old .nav td{background:#556b2f;color:#fff;text-align:center;font-weight:bold;text-decoration:underline}
.old img{width:100%;height:120px;border:4px outset #aaa;filter:contrast(.8) brightness(.9)}
.old p{font-size:11px;line-height:1.35;margin:6px 0}.old .blink{color:red;font-weight:bold;font-size:13px}
.new{background:#f6f3ee;position:relative}
.nt{display:flex;justify-content:space-between;align-items:center;padding:52px 26px 14px}.nt b{font:700 18px "Space Grotesk";color:#22303c}.nt span{background:#c2502f;color:#fff;font-size:12px;font-weight:700;padding:8px 13px;border-radius:6px}
.nh{position:relative;height:300px;margin:0 26px;border-radius:14px;overflow:hidden}.nh img{width:100%;height:100%}.nh div{position:absolute;inset:0;background:linear-gradient(0deg,rgba(18,26,32,.85),transparent 65%);color:#fff;padding:22px;display:flex;flex-direction:column;justify-content:flex-end}
.nh h2{font:700 30px/1.1 "Space Grotesk"}.nh p{font-size:14px;opacity:.9;margin-top:6px}
.ns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding:16px 26px}.ns div{background:#fff;border-radius:10px;padding:12px;font-size:12px;color:#55606a}.ns b{display:block;font:700 14px "Space Grotesk";color:#22303c;margin-bottom:4px}
.lab{position:absolute;top:12px;z-index:3;font:800 12px "Poppins";letter-spacing:.14em;padding:6px 12px;border-radius:999px}
.bar{display:flex;gap:10px;padding:0 26px}.bar span{flex:1;text-align:center;font-weight:700;font-size:13px;padding:11px;border-radius:8px;background:#22303c;color:#fff}.bar span+span{background:#fff;color:#22303c;border:1px solid #d5d0c8}
`, `<div class="split"><div class="old"><span class="lab" style="left:14px;background:#5a5a5a;color:#fff">BEFORE</span><div class="hd" style="margin-top:30px">*** COASTLINE FENCE &amp; GATE ***</div><div class="mq">WELCOME TO OUR WEB SITE!!! BEST PRICES ON THE COAST!!! CALL NOW!!! FREE ESTIMATES!!!</div>
<table class="nav"><tr><td>HOME</td><td>ABOUT US</td><td>FENCES</td><td>GATES</td><td>PICTURES</td><td>LINKS</td><td>GUESTBOOK</td></tr></table>
<table style="margin-top:6px"><tr><td style="width:55%"><img src="${photo("fence")}"><p>We do all kinds of fences wood fences chain link vinyl and more!! Family owned. Call for a free estimate today, we are licensed and insured. Click on PICTURES to see our work.</p><p class="blink">NEW!! Ask about gates!!</p><p style="text-align:center;margin-top:14px">[ UNDER CONSTRUCTION ]<br>Pictures page coming soon</p></td><td><p><b>Hours:</b> Call us</p><p><b>Phone:</b> 228-555-0175</p><p><b>Fax:</b> 228-555-0176</p><p>Page best viewed in 800x600</p><p>Visitors: 004817</p><p style="color:blue;text-decoration:underline">email us here</p></td></tr><tr><td colspan="2" style="text-align:center;background:#c9c9b8"><p>Copyright 2009 Coastline Fence | Last updated 03/14/2011 | <u style="color:blue">Sign our guestbook!</u></p></td></tr></table><div style="margin-top:12px;background:#fff;border:1px dashed #888;padding:10px;font-size:11px;line-height:1.5"><b>Problems we fixed:</b> no clear call to action, tiny text on phones, cluttered menu, no service area, outdated contact details.</div></div>
<div class="new"><span class="lab" style="left:26px;background:#c2502f;color:#fff">AFTER</span><div class="nt"><b>Coastline Fence &amp; Gate</b><span>Get a fence estimate</span></div>
<div class="nh"><img src="${photo("fence")}"><div><h2>Cedar, vinyl and aluminum fences built to last on the Coast.</h2><p>Free on-site measuring in Harrison and Jackson counties.</p></div></div>
<div class="ns"><div><b>Wood privacy</b>Cedar and pine, 6 and 8 ft</div><div><b>Vinyl</b>Low upkeep, salt air safe</div><div><b>Gates</b>Walk, drive, and automatic</div></div>
<div class="bar"><span>Call (228) 555-0175</span><span>See finished fences</span></div><div style="margin:14px 26px 0;background:#22303c;color:#dfe5ea;border-radius:10px;padding:12px 16px;font-size:12px;display:flex;justify-content:space-between"><span>Mon to Sat, 7 am to 5 pm</span><span>Licensed and insured</span><span>Free estimates</span></div></div></div>`);

/* 7 ─ Domain and hosting: launch checklist for Harbor Street Pottery */
screens["service-domain-hosting"] = doc("launch.example/projects/harborstreetpottery", `
.v{display:grid;grid-template-columns:420px 1fr;height:100%;background:#f3f1ec}
.l{padding:28px;background:#1f2430;color:#e9e6df}.l small{font-size:11px;letter-spacing:.16em;color:#9aa3b5;font-weight:700}.l h2{font:700 24px "Space Grotesk";margin:6px 0 4px;color:#fff}.l p{font-size:13px;color:#9aa3b5;margin-bottom:20px}
.st{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08)}.st .n{width:30px;height:30px;border-radius:50%;background:#3fae7a;color:#fff;display:flex;align-items:center;justify-content:center;flex:none}
.st b{display:block;font-size:15px;color:#fff}.st span{font-size:12px;color:#9aa3b5;line-height:1.5}.st code{font-family:"DejaVu Sans Mono";font-size:11px;color:#c9e7d8;background:rgba(63,174,122,.14);padding:2px 6px;border-radius:4px}
.r{padding:28px;position:relative}
.site{border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(31,36,48,.25);background:#fff}
.sb{height:34px;background:#eceae6;display:flex;align-items:center;padding:0 12px;gap:8px;font-size:12px;color:#3d7d55;font-weight:700}
.sh{position:relative;height:300px}.sh img{width:100%;height:100%;filter:sepia(.25)}.sh div{position:absolute;inset:0;background:linear-gradient(90deg,rgba(60,38,30,.8),transparent);color:#fff;padding:34px}
.sh h3{font:700 36px/1.05 "Baskerville";width:340px}.sh p{margin-top:10px;font-size:14px;width:300px}.sh span{display:inline-block;margin-top:16px;background:#e6c79c;color:#3c261e;padding:10px 16px;border-radius:4px;font-weight:700;font-size:13px}
.live{position:absolute;top:44px;right:44px;background:#3fae7a;color:#fff;padding:8px 14px;border-radius:999px;font-weight:700;font-size:13px;box-shadow:0 8px 20px rgba(63,174,122,.4)}
.dns{margin-top:18px;background:#fff;border-radius:10px;padding:14px 16px;font-size:12px;font-family:"DejaVu Sans Mono";color:#33394a}.dns div{display:grid;grid-template-columns:70px 120px 1fr 70px;padding:5px 0;border-bottom:1px solid #f0eee9}.dns .h{font-family:"DM Sans";font-weight:700;color:#8a8f9c}
`, `<div class="v"><div class="l"><small>LAUNCH CHECKLIST</small><h2>Harbor Street Pottery</h2><p>Sample launch for a fictional studio</p>
<div class="st"><div class="n">${icon.check}</div><div><b>Domain registered</b><span><code>harborstreetpottery.example</code><br>Renews yearly, owned by the business</span></div></div>
<div class="st"><div class="n">${icon.check}</div><div><b>Hosting set up</b><span>Site files deployed, daily backups on</span></div></div>
<div class="st"><div class="n">${icon.check}</div><div><b>DNS pointed</b><span>A and CNAME records connected to hosting</span></div></div>
<div class="st"><div class="n">${icon.check}</div><div><b>SSL certificate issued</b><span>HTTPS on, auto-renewal enabled</span></div></div>
<div class="st" style="border:none"><div class="n">${icon.check}</div><div><b>Site launched</b><span>Live and checked on phone and desktop</span></div></div><div style="margin-top:18px;background:rgba(255,255,255,.06);border-radius:10px;padding:14px;font-size:12px;line-height:1.6;color:#c9cfdb"><b style="color:#fff">Who owns what</b><br>The domain is registered to the business. Hosting, renewals and certificates are handled for you or by the provider you choose.</div></div>
<div class="r"><div class="site"><div class="sb">${lock} https://harborstreetpottery.example</div><div class="sh"><img src="${photo("owner")}"><div><h3>Stoneware made on Harbor Street.</h3><p>Mugs, platters and Saturday wheel classes in downtown Ocean Springs.</p><span>See this month's classes</span></div></div></div><span class="live">● Live</span>
<div class="dns"><div class="h"><span>Type</span><span>Host</span><span>Points to</span><span>Status</span></div><div><span>A</span><span>@</span><span>203.0.113.24</span><span style="color:#3fae7a">OK</span></div><div><span>CNAME</span><span>www</span><span>harborstreetpottery.example</span><span style="color:#3fae7a">OK</span></div><div style="border:none"><span>TXT</span><span>@</span><span>mail verification record</span><span style="color:#3fae7a">OK</span></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px;font-size:12px;color:#55607a"><div style="background:#fff;border-radius:10px;padding:12px"><b style="display:block;color:#1f2430;font-size:14px">Mon · Domain</b>Name chosen and registered</div><div style="background:#fff;border-radius:10px;padding:12px"><b style="display:block;color:#1f2430;font-size:14px">Wed · Hosting + DNS</b>Records pointed and verified</div><div style="background:#fff;border-radius:10px;padding:12px"><b style="display:block;color:#1f2430;font-size:14px">Fri · Launch</b>HTTPS on, final checks done</div></div><div style="font-size:11px;color:#8a8f9c;margin-top:8px">Sample timeline. Actual timing depends on the project.</div></div></div>`);

/* 8 ─ Maintenance: Pier Light Coffee */
screens["service-maintenance"] = doc("pierlightcoffee.example", `
.v{display:grid;grid-template-columns:330px 1fr;height:100%;background:#eef1f4}
.req{padding:24px;background:#dfe6ec}.req small{font:700 11px "Poppins";letter-spacing:.14em;color:#5b6b7a}
.bub{background:#fff;border-radius:16px 16px 16px 4px;padding:12px 14px;font-size:14px;line-height:1.45;margin-top:12px;color:#22303c;box-shadow:0 2px 6px rgba(0,0,0,.05)}
.me{background:#2c6e9b;color:#fff;border-radius:16px 16px 4px 16px;margin-left:40px}
.t{font-size:11px;color:#6d7b88;margin-top:4px}.t.r{text-align:right}
.site{padding:20px 26px}.top{display:flex;justify-content:space-between;align-items:center}.logo{font:600 24px "Fraunces";color:#1f3d4f}.top a{font-size:13px;margin-left:18px;color:#4c5b66}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:16px}.hero img{width:100%;height:220px;border-radius:12px}
.menu{background:#fffdf8;border-radius:12px;padding:18px;border:1px solid #e7e1d4}.menu h3{font:600 20px "Fraunces";color:#1f3d4f;display:flex;justify-content:space-between;align-items:center}
.upd{font:700 10px "Poppins";letter-spacing:.1em;background:#ffe08a;color:#6b4e00;padding:4px 8px;border-radius:999px}
.it{display:flex;justify-content:space-between;font-size:14px;padding:7px 0;border-bottom:1px dashed #e3dccd;color:#2b3a44}.it small{display:block;color:#7b8790;font-size:12px}
.new{background:#fff6d6;margin:0 -8px;padding:7px 8px;border-radius:6px}
.hours{margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hours div{background:#fff;border-radius:10px;padding:12px;font-size:13px;color:#4c5b66}.hours b{display:block;color:#1f3d4f;font-size:14px}
.hours .chg{outline:2px solid #ffd257}
`, `<div class="v"><div class="req"><small>CHANGE REQUEST · TEXT MESSAGE</small>
<div class="bub">Hi! Can you swap our menu to the fall drinks and change Sunday hours to 8 to 1 starting this weekend?</div><div class="t">Owner, Tue 9:12 am</div>
<div class="bub me">Got it. Fall menu and the new Sunday hours are live now. Take a look and let us know if anything needs tweaking.</div><div class="t r">Support, Tue 2:40 pm</div>
<div class="bub">Looks great, thank you!</div><div class="t">Owner, Tue 2:51 pm</div>
<div style="margin-top:22px;font-size:12px;color:#5b6b7a;line-height:1.5;background:#eef1f4;border-radius:10px;padding:12px">Sample conversation. Turnaround depends on the size of the change and your support plan.</div></div>
<div class="site"><div class="top"><div class="logo">Pier Light Coffee</div><div><a>Menu</a><a>Hours</a><a>Catering</a><a>Visit</a></div></div>
<div class="hero"><img src="${photo("cafe")}"><div class="menu"><h3>Fall menu <span class="upd">UPDATED TODAY</span></h3>
<div class="it new"><span>Cane syrup latte<small>Steen's cane syrup, oat milk</small></span><b>$5.75</b></div>
<div class="it new"><span>Pecan cold brew<small>Toasted pecan, sea salt cream</small></span><b>$5.25</b></div>
<div class="it new"><span>Satsuma mocha<small>Local citrus, dark chocolate</small></span><b>$5.50</b></div>
<div class="it" style="border:none"><span>Drip coffee<small>Rotating Gulf roaster</small></span><b>$3.00</b></div></div></div>
<div class="hours"><div><b>Mon to Fri</b>6:30 am to 3:00 pm</div><div><b>Saturday</b>7:00 am to 3:00 pm</div><div class="chg"><b>Sunday <span class="upd">NEW</span></b>8:00 am to 1:00 pm</div></div>
<div style="margin-top:14px;display:flex;gap:12px;align-items:center;font-size:13px;color:#4c5b66"><img src="${photo("latte")}" style="width:64px;height:64px;border-radius:10px">On the pier at 101 Front Beach Dr, Ocean Springs · (228) 555-0130</div>
<div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="background:#1f3d4f;color:#e8eef2;border-radius:12px;padding:14px;font-size:13px;line-height:1.5"><b style="font:600 17px Fraunces;color:#fff;display:block">Office catering</b>Coffee boxes and pastry trays for 10 to 40 people. Order by Thursday for Friday pickup.</div><div style="background:#fff;border-radius:12px;padding:14px;font-size:13px;line-height:1.5;color:#4c5b66"><b style="font:600 17px Fraunces;color:#1f3d4f;display:block">Recent site updates</b>Fall menu · Sunday hours · Holiday gift card banner scheduled for Nov 15</div></div></div></div>`);

/* 9 ─ Contact form: Gulfside Plumbing */
screens["feature-contact-form"] = doc("gulfsideplumbing.example/contact", `
.v{display:grid;grid-template-columns:1fr 1.05fr;height:100%}
.l{position:relative}.l img{width:100%;height:100%}.l div{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,40,70,.2),rgba(10,40,70,.92));color:#fff;padding:30px;display:flex;flex-direction:column;justify-content:flex-end}
.l .logo{position:absolute;top:24px;left:30px;font:700 20px "Space Grotesk"}.l .logo span{color:#ffb547}
.l h1{font:700 34px/1.1 "Space Grotesk"}.l p{font-size:14px;opacity:.9;margin:10px 0 16px;line-height:1.5}
.l li{list-style:none;display:flex;gap:8px;align-items:center;font-size:14px;margin-bottom:6px}
.r{padding:30px 34px;background:#f5f8fb;position:relative}
.r h2{font:700 24px "Space Grotesk";color:#0a2846}.r .s{font-size:13px;color:#5b6b7a;margin:4px 0 16px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.f{margin-bottom:12px}.f .inp{width:100%}.lbl{color:#0a2846}
.ch{display:flex;gap:8px;flex-wrap:wrap}.ch span{font-size:12px;border:1px solid #cfd3db;padding:7px 11px;border-radius:999px;background:#fff}.ch .on{background:#0a2846;color:#fff;border-color:#0a2846}
.go{display:inline-block;background:#ffb547;color:#0a2846;font-weight:700;padding:12px 22px;border-radius:8px}
.mail{position:absolute;right:26px;bottom:44px;width:310px;background:#fff;border-radius:12px;box-shadow:0 18px 40px rgba(10,40,70,.25);padding:14px;font-size:12px;border:1px solid #e1e7ee}
.mail .h{display:flex;align-items:center;gap:8px;font-weight:700;color:#0a2846;font-size:13px;margin-bottom:8px}.mail .row{color:#5b6b7a;line-height:1.5}
`, `<div class="v"><div class="l"><img src="${photo("plumber")}"><div><span class="logo">GULFSIDE<span>+</span>PLUMBING</span><h1>Tell us what's leaking. We'll call you back today.</h1><p>Licensed plumbers serving Gulfport, Long Beach and Saucier. Messages before 3 pm get a same-day callback.</p><ul><li>${icon.phone} (228) 555-0184</li><li>${icon.clock} Mon to Sat, 7 am to 6 pm</li><li>${icon.pin} 2210 Pass Rd, Gulfport</li></ul></div></div>
<div class="r"><h2>Send us a message</h2><div class="s">Fields marked * are required.</div>
<div class="two"><div class="f"><span class="lbl">Full name *</span><div class="inp">Marcus Bell</div></div><div class="f"><span class="lbl">Phone *</span><div class="inp">(228) 555-0109</div></div></div>
<div class="f"><span class="lbl">Email *</span><div class="inp">marcus.bell@mail.example</div></div>
<div class="f"><span class="lbl">What do you need help with?</span><div class="ch"><span class="on">Leak or drip</span><span>Water heater</span><span>Clogged drain</span><span>Remodel</span></div></div>
<div class="f"><span class="lbl">Message *</span><div class="inp" style="height:76px;line-height:1.45">Water under the kitchen sink since this morning. Shutoff valve is closed for now. Home most of the afternoon.</div></div>
<span class="go">Send message</span>
<div class="mail"><div class="h">${icon.mail} New website message</div><div class="row"><b>To:</b> office@gulfsideplumbing.example<br><b>From:</b> Marcus Bell, (228) 555-0109<br><b>Topic:</b> Leak or drip<br>"Water under the kitchen sink since this morning..."</div><div style="margin-top:6px;color:#8a97a4;font-size:11px">Arrives in your inbox · illustration only</div></div></div></div>`);

/* 10 ─ Booking request: Studio Marisol */
const cal = (() => {
  const days = []; for (let i = 0; i < 1; i++) days.push(`<span class="x"></span>`);
  for (let d = 1; d <= 30; d++) {
    const cls = d === 18 ? "sel" : [7, 14, 21, 28].includes(d) ? "off" : d < 9 ? "past" : "";
    days.push(`<span class="${cls}">${d}</span>`);
  }
  return days.join("");
})();
screens["feature-booking"] = doc("studiomarisol.example/book", `
.v{display:grid;grid-template-columns:330px 1fr;height:100%;background:#fbf4f1}
.l{position:relative}.l img{width:100%;height:100%}.l div{position:absolute;left:0;right:0;bottom:0;padding:24px;background:linear-gradient(0deg,rgba(60,24,34,.92),transparent);color:#fff}
.logo{position:absolute;top:22px;left:24px;font:700 26px "Playfair";color:#fff;font-style:italic}
.r{padding:24px 30px}.r h1{font:700 28px "Playfair";color:#5a1f33}.r .s{font-size:13px;color:#8a6a72;margin:4px 0 16px}
.steps{display:flex;gap:8px;margin-bottom:16px;font-size:12px;font-weight:700}.steps span{padding:6px 12px;border-radius:999px;background:#f1e2dd;color:#8a6a72}.steps .on{background:#5a1f33;color:#fff}
.g{display:grid;grid-template-columns:1.1fr 1fr;gap:20px}
.box{background:#fff;border-radius:14px;padding:16px;border:1px solid #efdcd5}
.mh{display:flex;justify-content:space-between;font:700 15px "Playfair";color:#5a1f33;margin-bottom:10px}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:13px}.cal b{font-size:11px;color:#a08890;padding-bottom:4px}.cal span{padding:8px 0;border-radius:8px;color:#3c2a30}.cal .past,.cal .off{color:#cdbbbf}.cal .off{text-decoration:line-through}.cal .sel{background:#5a1f33;color:#fff;font-weight:700}
.times{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px}.times span{text-align:center;font-size:13px;padding:8px 0;border:1px solid #e6d1ca;border-radius:8px}.times .on{background:#e9a48d;border-color:#e9a48d;color:#3c1420;font-weight:700}.times .no{color:#cdbbbf;text-decoration:line-through}
.svc{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f3e6e1;font-size:13px}.svc b{color:#3c2a30}.svc.on{color:#5a1f33}.svc i{width:16px;height:16px;border-radius:50%;border:2px solid #d8bfb7;display:inline-block;margin-right:8px;vertical-align:-3px}.svc.on i{border:5px solid #5a1f33}
.sum{margin-top:12px;background:#5a1f33;color:#fff;border-radius:12px;padding:14px;font-size:13px;line-height:1.6}.sum .go{margin-top:10px;background:#e9a48d;color:#3c1420;font-weight:700;text-align:center;padding:10px;border-radius:8px}
`, `<div class="v"><div class="l"><img src="${photo("salon")}"><span class="logo">Studio Marisol</span><div><b style="font:700 18px Playfair">Color · Cuts · Blowouts</b><p style="font-size:13px;opacity:.85;margin-top:6px">614 Main St, Bay St. Louis<br>Tue to Sat · (228) 555-0126</p></div></div>
<div class="r"><h1>Request an appointment</h1><div class="s">Choose a preferred time. We confirm by text within a few hours.</div>
<div class="steps"><span>1 Service</span><span class="on">2 Date and time</span><span>3 Your details</span></div>
<div class="g"><div class="box"><div class="mh"><span>‹</span><span>September</span><span>›</span></div><div class="cal"><b>S</b><b>M</b><b>T</b><b>W</b><b>T</b><b>F</b><b>S</b>${cal}</div><div style="margin-top:14px;padding-top:12px;border-top:1px solid #f3e6e1;font-size:12px;color:#8a6a72;line-height:1.6"><b style="color:#5a1f33">Stylist:</b> Ana R. · Color specialist<br><b style="color:#5a1f33">Closed</b> Sundays and Mondays<br>New guests: please arrive 10 minutes early.</div></div>
<div><div class="box"><div style="font-weight:700;color:#5a1f33;font-size:13px">Service</div><div class="svc"><span><i></i>Women's cut and style</span><b>$58</b></div><div class="svc on"><span><i></i>Partial highlights</span><b>$135</b></div><div class="svc" style="border:none"><span><i></i>Blowout</span><b>$40</b></div>
<div style="font-weight:700;color:#5a1f33;font-size:13px;margin-top:8px">Thu, Sept 18 · with Ana</div><div class="times"><span class="no">9:00</span><span>10:30</span><span class="on">1:00 pm</span><span>2:30</span><span class="no">4:00</span><span>5:15</span></div></div>
<div class="sum"><b>Your request</b><br>Partial highlights · Thu Sept 18 · 1:00 pm<br>About 2 hr 15 min<div class="go">Send booking request</div></div></div></div></div></div>`);

/* 11 ─ Gallery: Bayou Craft Builders */
screens["feature-gallery"] = doc("bayoucraft.example/our-work", `
.v{background:#16181d;color:#f1ede6;height:100%;padding:20px 30px}
.top{display:flex;justify-content:space-between;align-items:center}.logo{font:700 20px "Space Grotesk";letter-spacing:.04em}.logo span{color:#d9a066}.top a{font-size:13px;margin-left:20px;opacity:.75}
.hd{display:flex;justify-content:space-between;align-items:flex-end;margin:18px 0 14px}.hd h1{font:700 32px "Space Grotesk"}.hd p{font-size:13px;opacity:.7;margin-top:4px}
.ch span{font-size:12px;padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.2);margin-left:6px}.ch .on{background:#d9a066;color:#16181d;border-color:#d9a066;font-weight:700}
.g{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:250px 220px;gap:10px}
.t{position:relative;border-radius:10px;overflow:hidden}.t img{width:100%;height:100%}.t div{position:absolute;left:0;right:0;bottom:0;padding:12px 14px;background:linear-gradient(0deg,rgba(0,0,0,.8),transparent)}.t b{font:700 15px "Space Grotesk";display:block}.t small{font-size:12px;opacity:.8}
.big{grid-row:span 2}.pl{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.92);color:#16181d;display:flex;align-items:center;justify-content:center;padding-left:4px}
.dur{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.7);font-size:11px;padding:3px 7px;border-radius:4px}
`, `<div class="v"><div class="top"><div class="logo">BAYOU<span>CRAFT</span> BUILDERS</div><div><a>Services</a><a style="opacity:1;color:#d9a066">Our work</a><a>Process</a><a>Contact</a></div></div>
<div class="hd"><div><h1>Finished projects</h1><p>Photos from sample builds across Hancock and Harrison counties</p></div><div class="ch"><span class="on">All</span><span>Kitchens</span><span>Baths</span><span>Outdoor</span><span>Video tours</span></div></div>
<div class="g"><div class="t big"><img src="${photo("kitchen")}"><span class="pl">${icon.play}</span><span class="dur">2:14</span><div><b>Video tour: Diamondhead kitchen</b><small>Full gut remodel · 11 weeks</small></div></div>
<div class="t"><img src="${photo("bath")}"><div><b>Primary bath</b><small>Walk-in shower, soaking tub</small></div></div><div class="t"><img src="${photo("porch")}"><div><b>Screened porch</b><small>Tongue and groove ceiling</small></div></div>
<div class="t"><img src="${photo("deck")}"><div><b>Bayou deck</b><small>Composite, cable rail</small></div></div><div class="t"><img src="${photo("home")}"><div><b>Raised cottage</b><small>New build · 1,850 sq ft</small></div></div></div></div>`);

/* 12 ─ Map and location: Pass Christian Cycle Co. (illustrated map) */
screens["feature-map"] = doc("passcycle.example/visit", `
.v{display:grid;grid-template-columns:1fr 380px;height:100%}
.map{position:relative;background:#efe9dc;overflow:hidden}
.side{padding:26px;background:#fff;border-left:1px solid #e3ddd0}
.logo{font:400 18px "Archivo Black";color:#c2410c}.side h1{font:700 26px "Space Grotesk";color:#1c2b33;margin:12px 0 4px}
.side img{width:100%;height:150px;border-radius:10px;margin:12px 0}
.row{display:flex;gap:10px;font-size:14px;color:#33444d;padding:8px 0;border-bottom:1px solid #f0ebe0;line-height:1.45}.row svg{color:#c2410c;flex:none;margin-top:2px}
.hr{display:grid;grid-template-columns:1fr auto;font-size:13px;color:#33444d;gap:2px 10px}.hr .today{font-weight:700;color:#1c2b33}
.btns{display:flex;gap:8px;margin-top:14px}.btns span{flex:1;text-align:center;padding:11px;border-radius:8px;font-weight:700;font-size:13px;background:#c2410c;color:#fff}.btns span+span{background:#fff;color:#1c2b33;border:1px solid #d6d0c3}
.pin{position:absolute;left:47%;top:44%;transform:translate(-50%,-100%)}
.card{position:absolute;left:calc(47% + 26px);top:calc(44% - 74px);background:#fff;border-radius:10px;padding:10px 12px;font-size:12px;box-shadow:0 10px 24px rgba(0,0,0,.18);width:190px}.card b{font-size:14px;color:#1c2b33;display:block}
.note{position:absolute;left:14px;bottom:14px;background:rgba(255,255,255,.9);font-size:11px;padding:6px 10px;border-radius:6px;color:#55606a}
`, `<div class="v"><div class="map"><svg width="820" height="748" viewBox="0 0 820 748" style="position:absolute;inset:0">
<path d="M0 560 C180 520 300 600 460 560 S720 520 820 540 V748 H0z" fill="#9fd0d9"/><path d="M0 590 C200 560 320 630 470 595 S720 560 820 575" stroke="#b9e0e6" stroke-width="6" fill="none"/>
<path d="M0 500 L820 470" stroke="#fff" stroke-width="18"/><path d="M0 500 L820 470" stroke="#f6d27a" stroke-width="10"/>
<g stroke="#fff" stroke-width="9"><path d="M120 0 L170 500"/><path d="M380 0 L385 485"/><path d="M620 0 L600 478"/><path d="M0 300 L820 270"/><path d="M0 150 L820 130"/><path d="M250 0 L270 495"/><path d="M500 0 L495 482"/></g>
<g fill="#dcd4c2"><rect x="185" y="170" width="60" height="90" rx="4"/><rect x="285" y="175" width="80" height="80" rx="4"/><rect x="400" y="170" width="80" height="90" rx="4"/><rect x="515" y="165" width="70" height="90" rx="4"/><rect x="185" y="320" width="60" height="140" rx="4"/><rect x="285" y="315" width="80" height="150" rx="4"/><rect x="515" y="310" width="70" height="150" rx="4"/><rect x="640" y="160" width="140" height="90" rx="4"/><rect x="20" y="170" width="90" height="100" rx="4"/></g>
<rect x="400" y="315" width="80" height="80" rx="4" fill="#b9d8a8"/><text x="440" y="360" font-family="DM Sans" font-size="11" text-anchor="middle" fill="#4a6a3a">War Memorial Park</text>
<rect x="640" y="300" width="140" height="150" rx="4" fill="#b9d8a8"/>
<g font-family="DM Sans" font-size="12" font-weight="700" fill="#7b7466"><text x="20" y="492">Scenic Dr / Beach Blvd</text><text x="388" y="80" transform="rotate(90 388 80)">Davis Ave</text><text x="40" y="292">E Second St</text><text x="40" y="142">Market St</text></g>
<text x="560" y="660" font-family="Fraunces" font-size="22" fill="#5f9aa5">Mississippi Sound</text>
<g transform="translate(330 520)"><rect width="110" height="16" fill="#c8b48e"/><rect x="50" y="16" width="10" height="70" fill="#c8b48e"/></g><text x="340" y="618" font-family="DM Sans" font-size="11" fill="#5f9aa5">Harbor pier</text>
</svg>
<svg class="pin" width="44" height="56" viewBox="0 0 24 30"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 30 12 30s12-10 12-18.3C24 5.2 18.6 0 12 0z" fill="#c2410c"/><circle cx="12" cy="11.5" r="4.5" fill="#fff"/></svg>
<div class="card"><b>Pass Christian Cycle Co.</b>Rentals · Repairs · Beach cruisers<br><span style="color:#2f7a5b;font-weight:700">Open until 6:00 pm</span></div>
<div class="note">Illustrated map for this example</div></div>
<div class="side"><div class="logo">PASS CHRISTIAN CYCLE CO.</div><h1>Visit the shop</h1><div style="font-size:13px;color:#6b767c">Two blocks from the harbor. Free parking behind the building.</div>
<img src="${photo("bikes")}">
<div class="row">${icon.pin}<span>214 Davis Ave<br>Pass Christian, MS 39571</span></div>
<div class="row">${icon.phone}<span>(228) 555-0158</span></div>
<div class="row" style="border:none">${icon.clock}<div class="hr"><span>Mon to Fri</span><span>9:00 am to 6:00 pm</span><span class="today">Saturday (today)</span><span class="today">8:00 am to 6:00 pm</span><span>Sunday</span><span>10:00 am to 4:00 pm</span></div></div>
<div class="btns"><span>Get directions</span><span>Call the shop</span></div></div></div>`);

/* 13 ─ Reviews: Magnolia Paws Grooming, explicit sample feedback */
const rev = (init, name, when, svc, txt, c) => `<div class="rv"><div class="rh"><span class="av" style="background:${c}">${init}</span><div><b>${name}</b><small>${when} · ${svc}</small></div><span class="star">★★★★★</span></div><p>${txt}</p><em>Sample review text</em></div>`;
screens["feature-reviews"] = doc("magnoliapaws.example/reviews", `
.v{background:#f7f2ea;height:100%;padding:22px 34px}
.top{display:flex;justify-content:space-between;align-items:center}.logo{font:600 22px "Fraunces";color:#2f4858}.logo span{color:#d9776a}.top a{font-size:13px;margin-left:18px;color:#5b6770}
.banner{margin:16px 0;background:#2f4858;color:#fff;border-radius:10px;padding:10px 16px;font-size:13px;display:flex;justify-content:space-between;align-items:center}.banner b{color:#ffd6a5;letter-spacing:.06em;font-size:12px}
.hd{display:grid;grid-template-columns:300px 1fr;gap:26px}
.sumry{background:#fff;border-radius:14px;padding:20px;border:1px solid #ece3d6}.sumry h1{font:600 26px "Fraunces";color:#2f4858}.sumry .big{font:600 52px "Fraunces";color:#2f4858;line-height:1}
.bars div{display:flex;align-items:center;gap:8px;font-size:12px;color:#5b6770;margin:5px 0}.bars i{flex:1;height:8px;border-radius:4px;background:#efe6d9;position:relative;overflow:hidden}.bars i:after{content:"";position:absolute;inset:0;width:var(--w);background:#e7a92b;border-radius:4px}
.sumry img{width:100%;height:150px;border-radius:10px;margin-top:14px}
.list{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:start}
.rv{background:#fff;border-radius:14px;padding:16px;border:1px solid #ece3d6}.rh{display:flex;gap:10px;align-items:center}.rh div{flex:1}.rh b{color:#2f4858;font-size:14px;display:block}.rh small{font-size:11px;color:#8a949b}
.av{width:38px;height:38px;border-radius:50%;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px}
.rv p{font-size:13.5px;line-height:1.5;color:#3d4a52;margin-top:10px}.rv em{display:inline-block;margin-top:8px;font-style:normal;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a6b3a;background:#fbefdc;padding:3px 7px;border-radius:4px}
`, `<div class="v"><div class="top"><div class="logo">Magnolia <span>Paws</span> Grooming</div><div><a>Services</a><a>Prices</a><a style="color:#2f4858;font-weight:700">Reviews</a><a>Book</a></div></div>
<div class="banner"><span><b>SAMPLE FEEDBACK</b> &nbsp;Illustrative reviews for a fictional business. Real sites only show genuine reviews shared with permission.</span></div>
<div class="hd"><div class="sumry"><h1>What owners say</h1><div style="display:flex;align-items:flex-end;gap:10px;margin:10px 0"><span class="big">4.8</span><span><span class="star">★★★★★</span><br><small style="color:#8a949b;font-size:12px">sample average · 126 sample reviews</small></span></div>
<div class="bars"><div>5<i style="--w:86%"></i></div><div>4<i style="--w:10%"></i></div><div>3<i style="--w:3%"></i></div><div>2<i style="--w:1%"></i></div><div>1<i style="--w:0%"></i></div></div><img src="${photo("owner")}"></div>
<div class="list">${rev("RT", "Renee T.", "2 weeks ago", "Full groom", "Biscuit came home looking like a show dog and actually calm. They sent a photo halfway through, which I loved.", "#d9776a")}
${rev("JM", "James M.", "1 month ago", "Bath and nails", "Easy text booking and they were right on time for pickup. Our older lab hates nail trims and they were so patient.", "#2f4858")}
${rev("LS", "Lena S.", "1 month ago", "Puppy intro", "First groom for our doodle. They kept it short and positive, and explained exactly how to brush her at home.", "#6a9a8a")}
${rev("DW", "Dwayne W.", "2 months ago", "De-shed treatment", "Our husky blows coat twice a year and this made a huge difference. Clean shop and friendly people.", "#9a6b3a")}<div style="grid-column:span 2;background:#2f4858;color:#fff;border-radius:14px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center"><span><b style="font:600 18px Fraunces">Had a visit recently?</b><br><span style="font-size:13px;opacity:.85">Owners can leave a review after their appointment.</span></span><span style="background:#ffd6a5;color:#2f4858;font-weight:700;padding:10px 16px;border-radius:999px;font-size:13px">Leave a review</span></div></div></div></div>`);

/* 14 ─ SEO: search result in context */
screens["feature-seo"] = doc("search.example/?q=roof+replacement+biloxi", `
.v{background:#fff;height:100%;padding:18px 0 0 0}
.sb{display:flex;align-items:center;gap:22px;padding:0 34px 14px;border-bottom:1px solid #ebebeb}.sb .lg{font:700 22px "Space Grotesk";color:#3b5bdb}.sb .q{flex:1;max-width:620px;border:1px solid #dfe1e5;border-radius:24px;padding:11px 18px;font-size:15px;display:flex;justify-content:space-between;box-shadow:0 1px 6px rgba(32,33,36,.12)}
.tabs{display:flex;gap:22px;padding:10px 0 0 170px;font-size:13px;color:#5f6368}.tabs .on{color:#3b5bdb;border-bottom:3px solid #3b5bdb;padding-bottom:8px}
.res{padding:16px 0 0 170px;width:860px}
.r{margin-bottom:22px}.r .site{display:flex;align-items:center;gap:10px;font-size:13px;color:#202124}.r .fav{width:28px;height:28px;border-radius:50%;background:#f1f3f4;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px}.r small{display:block;color:#4d5156;font-size:12px}
.r h3{font:400 20px "DM Sans";color:#1a0dab;margin:6px 0 4px}.r p{font-size:14px;color:#4d5156;line-height:1.55}.r .sl{display:flex;gap:18px;margin-top:6px;font-size:13px;color:#1a0dab}
.hl{position:relative;background:#fffbea;border:2px solid #f5b400;border-radius:12px;padding:14px 16px;margin-left:-18px}
.ann{position:absolute;right:-250px;width:220px;font-size:12px;color:#5b4300;background:#fff3c4;border-radius:8px;padding:8px 10px;line-height:1.4}.ann b{display:block;font-size:11px;letter-spacing:.06em}
.ad{font-weight:700;color:#202124}
.fade{opacity:.5}
`, `<div class="v"><div class="sb"><span class="lg">Searchly</span><div class="q"><span>roof replacement biloxi</span>${icon.search}</div></div><div class="tabs"><span class="on">All</span><span>Images</span><span>Maps</span><span>News</span></div>
<div class="res"><div style="font-size:12px;color:#70757a;margin-bottom:14px">Example results page. Not a real search engine or ranking.</div>
<div class="r hl"><div class="site"><span class="fav" style="background:#14213d;color:#fca311">B</span><div>Bayline Roofing<small>https://baylineroofing.example › roof-replacement-biloxi</small></div></div><h3>Roof Replacement in Biloxi, MS | Bayline Roofing</h3><p>Shingle and metal roof replacement in Biloxi with a written inspection first. Licensed and insured crews, full cleanup. Call (228) 555-0193.</p><div class="sl"><span>Storm damage repair</span><span>Roof inspections</span><span>Financing</span></div>
<span class="ann" style="top:10px"><b>WEB ADDRESS</b>Short, readable page path</span><span class="ann" style="top:62px"><b>PAGE TITLE</b>Service + city + business name</span><span class="ann" style="top:118px"><b>META DESCRIPTION</b>What, where, and how to reach you</span></div>
<div class="r fade"><div class="site"><span class="fav">G</span><div>Gulf Shingle Supply<small>https://gulfshingle.example › products</small></div></div><h3>Architectural Shingles and Underlayment</h3><p>Browse shingle colors, underlayment and flashing for contractors across south Mississippi.</p></div>
<div class="r fade"><div class="site"><span class="fav">C</span><div>Coast Home Guide<small>https://coasthomeguide.example › roofing</small></div></div><h3>How to choose a roofer on the Coast</h3><p>Questions to ask before you sign, what an inspection should include, and typical timelines.</p></div>
<div style="border:1px solid #ebebeb;border-radius:12px;padding:12px 16px;margin-bottom:16px" class="fade"><b style="font-size:16px;color:#202124">People also ask</b><div style="font-size:14px;color:#202124;padding:9px 0;border-bottom:1px solid #ebebeb">How long does a roof replacement take?</div><div style="font-size:14px;color:#202124;padding:9px 0">Metal or shingle roof on the Gulf Coast?</div></div><div style="font-size:12px;color:#70757a">Clear titles and descriptions help people choose your result. Placement is never guaranteed.</div></div></div>`);

/* 15 ─ Local SEO: Delisle Auto Works business information */
screens["feature-local-seo"] = doc("delisleautoworks.example/contact", `
.v{display:grid;grid-template-columns:1fr 400px;height:100%;background:#f2f2ee}
.site{background:#fff}.top{display:flex;justify-content:space-between;align-items:center;background:#1b1b1f;color:#fff;padding:14px 28px}.logo{font:400 20px "Archivo Black"}.logo span{color:#e63946}.top a{font-size:13px;margin-left:18px;opacity:.85}
.hero{position:relative;height:250px}.hero img{width:100%;height:100%}.hero div{position:absolute;inset:0;background:linear-gradient(90deg,rgba(27,27,31,.9),transparent);color:#fff;padding:30px 28px}.hero h1{font:400 32px/1.1 "Archivo Black";width:380px}.hero p{margin-top:10px;font-size:14px;width:340px;opacity:.9}
.nap{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:20px 28px}.nap div{border:1px solid #e6e6e1;border-radius:10px;padding:14px;font-size:14px;color:#33363d;line-height:1.55}.nap b{display:block;font-size:12px;letter-spacing:.08em;color:#e63946;margin-bottom:4px}
.hrs{display:grid;grid-template-columns:auto 1fr;gap:0 16px;font-size:13px}
.mk{position:absolute;font:700 10px "Poppins";letter-spacing:.08em;background:#2f7a5b;color:#fff;padding:3px 7px;border-radius:4px}
.panel{padding:22px}.panel small{font:700 11px "Poppins";letter-spacing:.14em;color:#6b6f78}
.lp{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.12);margin-top:10px}.lp img{width:100%;height:120px}
.lp .b{padding:14px 16px}.lp h2{font:700 20px "Space Grotesk";color:#1b1b1f}.lp .cat{font-size:13px;color:#6b6f78;margin:2px 0 10px}
.ac{display:flex;gap:6px;margin-bottom:10px}.ac span{flex:1;text-align:center;font-size:12px;font-weight:700;color:#1a5fb4;border:1px solid #d6dbe3;border-radius:999px;padding:7px 0}
.lr{display:flex;gap:10px;font-size:13px;color:#33363d;padding:6px 0;border-top:1px solid #f0f0ec}.lr svg{color:#6b6f78;flex:none}
.match{margin-top:12px;background:#e8f4ee;color:#1f5f45;border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.5}
`, `<div class="v"><div class="site"><div class="top"><div class="logo">DELISLE<span>/</span>AUTO WORKS</div><div><a>Repairs</a><a>Brakes</a><a>A/C</a><a style="opacity:1;color:#e63946">Contact</a></div></div>
<div class="hero"><img src="${photo("auto")}"><div><h1>Honest repairs, done right the first time.</h1><p>Family-run shop for domestic and import vehicles. Free check engine light scan.</p></div></div>
<div class="nap" style="position:relative"><div><b>ADDRESS</b>18120 Hwy 605<br>Gulfport, MS 39503</div><div><b>PHONE</b>(228) 555-0137<br>service@delisleautoworks.example</div><div style="grid-column:span 2"><b>HOURS</b><div class="hrs"><span>Mon to Fri</span><span>7:30 am to 5:30 pm</span><span>Saturday</span><span>8:00 am to noon</span><span>Sunday</span><span>Closed</span></div></div>
<div style="grid-column:span 2;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px"><div><b>SERVICE AREA</b>Gulfport, Saucier, Delisle and Long Beach</div><div><b>PAYMENT</b>Cash, card and fleet accounts</div><div><b>PARKING</b>Drop-off lot open after hours</div></div>
<span class="mk" style="left:38px;top:12px">MATCHES LISTING</span><span class="mk" style="left:330px;top:12px">MATCHES LISTING</span><span class="mk" style="left:38px;top:122px">MATCHES LISTING</span></div></div>
<div class="panel"><small>EXAMPLE BUSINESS LISTING</small><div class="lp"><img src="${photo("auto")}" style="object-position:center 30%"><div class="b"><h2>Delisle Auto Works</h2><div class="cat">Auto repair shop · Gulfport</div>
<div class="ac"><span>Website</span><span>Directions</span><span>Call</span></div>
<div class="lr">${icon.pin}18120 Hwy 605, Gulfport, MS 39503</div><div class="lr">${icon.phone}(228) 555-0137</div><div class="lr">${icon.clock}Open · Closes 5:30 pm</div><div class="lr">${icon.search}delisleautoworks.example</div></div></div>
<div class="match"><b>Same name, address, phone and hours</b> on your website and listings, so customers and search engines see one consistent business. Illustration only; not a real listing.</div></div></div>`);

/* 16 ─ Social: Crumb & Current Bakery */
screens["feature-social"] = doc("crumbandcurrent.example", `
.v{background:#fff6ee;height:100%}
.top{display:flex;justify-content:space-between;align-items:center;padding:16px 32px}.logo{font:700 24px "Playfair";color:#7a2e1f}.top a{font-size:13px;margin-left:18px;color:#6b4a40}
.ic{display:inline-flex;gap:6px;margin-left:18px}.ic span{width:30px;height:30px;border-radius:50%;background:#7a2e1f;display:inline-flex;align-items:center;justify-content:center}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:4px 32px}.hero img{width:100%;height:260px;border-radius:16px}
.hero h1{font:700 40px/1.08 "Playfair";color:#3d1a12;margin-top:20px}.hero p{font-size:15px;line-height:1.55;color:#6b4a40;margin:12px 0 16px}
.feed{margin:20px 32px 0;background:#fff;border-radius:16px;padding:16px 18px;border:1px solid #f0dfd0}
.fh{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.fh b{font:700 18px "Playfair";color:#3d1a12}.fh span{font-size:13px;color:#7a2e1f;font-weight:700}
.posts{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.posts div{position:relative;border-radius:10px;overflow:hidden;height:190px}.posts img{width:100%;height:100%}.posts small{position:absolute;left:6px;bottom:6px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;padding:3px 6px;border-radius:4px}
.foot{position:absolute;left:0;right:0;bottom:0;height:56px;background:#3d1a12;color:#f6dccb;display:flex;align-items:center;justify-content:space-between;padding:0 240px 0 32px;font-size:13px}
`, `<div class="v"><div class="top"><div class="logo">Crumb &amp; Current</div><div style="display:flex;align-items:center"><a>Menu</a><a>Custom cakes</a><a>Wholesale</a><a>Visit</a><span class="ic">${["Facebook", "Instagram", "YouTube", "TikTok"].map((s) => `<span>${socialGlyph(s, "#fff")}</span>`).join("")}</span></div></div>
<div class="hero"><div><h1>Sourdough at sunrise, croissants till they're gone.</h1><p>A small-batch bakery on Second Street. We post the day's bake every morning at 6:30, so follow along before you head over.</p><div style="display:flex;gap:8px;flex-wrap:wrap">${social("#7a2e1f", "#fff")}</div></div><img src="${photo("bakery")}"></div>
<div class="feed"><div class="fh"><b>Fresh from our Instagram</b><span>@crumbandcurrent.example · Follow</span></div><div class="posts"><div><img src="${photo("bakery")}" style="object-position:20% 50%"><small>Today's bake</small></div><div><img src="${photo("latte")}"><small>Muffin Monday</small></div><div><img src="${photo("bakery")}" style="object-position:80% 30%"><small>Reel · 0:42</small></div><div><img src="${photo("cafe")}"><small>Behind the counter</small></div><div><img src="${photo("owner")}"><small>Meet Joanna</small></div></div></div>
<div class="foot"><span>412 Second St, Bay St. Louis · (228) 555-0141</span><span style="display:flex;gap:8px">${social("rgba(255,255,255,.12)", "#f6dccb")}</span></div></div>`, { badge: "Sample design · sample posts" });

/* 17 ─ Responsive: Seabreeze Family Dental on three devices */
const dental = (w) => `<div class="d" style="width:${w}px"><div class="dt"><b>Seabreeze <span>Family Dental</span></b>${w > 500 ? "<i>Services</i><i>New patients</i><i>Insurance</i><i>Contact</i>" : "<i>☰</i>"}</div>
<div class="dh" style="${w > 500 ? "display:grid;grid-template-columns:1fr 1fr" : ""}"><div class="dc"><h2>Gentle dental care for the whole family.</h2><p>Cleanings, fillings and Saturday appointments in Gulfport.</p><span class="db">Request a visit</span><span class="db g">(228) 555-0122</span></div><img src="${photo("dental")}"></div>
<div class="ds" style="grid-template-columns:${w > 900 ? "repeat(4,1fr)" : w > 500 ? "1fr 1fr" : "1fr"}"><div><b>Cleanings</b>Every 6 months</div><div><b>Kids' dentistry</b>Ages 2 and up</div><div><b>Whitening</b>In-office or take-home</div><div><b>Emergencies</b>Same-day when possible</div></div></div>`;
screens["feature-responsive"] = doc("", `
body{background:linear-gradient(160deg,#dbeef0,#f4efe6)}
.d{background:#fff;font-family:"DM Sans";color:#12343b}.dt{display:flex;align-items:center;gap:22px;padding:16px 26px;border-bottom:1px solid #e3eef0}.dt b{flex:1;font:700 20px "Fraunces"}.dt b span{color:#2a9d8f}.dt i{font-style:normal;font-size:14px;color:#4a6970}
.dh img{width:100%;height:300px}.dc{padding:34px 26px;background:#eaf6f4}.dc h2{font:600 34px/1.1 "Fraunces"}.dc p{font-size:16px;color:#4a6970;margin:12px 0 18px}.db{display:inline-block;background:#2a9d8f;color:#fff;font-weight:700;padding:12px 18px;border-radius:999px;margin:0 8px 8px 0;font-size:15px}.db.g{background:#fff;color:#12343b;border:1px solid #bcd9d6}
.ds{display:grid;gap:12px;padding:20px 26px}.ds div{border:1px solid #e3eef0;border-radius:12px;padding:14px;font-size:14px;color:#4a6970}.ds b{display:block;color:#12343b;font-size:16px}
.dev{position:absolute;background:#1f2a30;box-shadow:0 30px 60px rgba(18,52,59,.3);overflow:hidden}.scr{overflow:hidden;background:#fff;position:relative}.scr>.d{transform-origin:0 0}
h3{position:absolute;font:700 13px "Poppins";letter-spacing:.14em;color:#12343b}
`, `<div class="dev" style="left:30px;top:56px;width:720px;height:470px;border-radius:14px;padding:12px"><div class="scr" style="width:696px;height:446px;border-radius:4px"><div style="transform:scale(.58);transform-origin:0 0">${dental(1200)}</div></div></div>
<div style="position:absolute;left:330px;top:526px;width:120px;height:60px;background:#c9d4d6;clip-path:polygon(25% 0,75% 0,100% 100%,0 100%)"></div><div style="position:absolute;left:280px;top:584px;width:220px;height:10px;border-radius:5px;background:#b7c3c6"></div>
<div class="dev" style="left:690px;top:160px;width:380px;height:510px;border-radius:24px;padding:16px"><div class="scr" style="width:348px;height:478px;border-radius:8px"><div style="transform:scale(.464);transform-origin:0 0">${dental(750)}</div></div></div>
<div class="dev" style="left:1000px;top:280px;width:180px;height:370px;border-radius:28px;padding:9px"><div class="scr" style="width:162px;height:352px;border-radius:20px"><div style="transform:scale(.415);transform-origin:0 0">${dental(390)}</div></div></div>
<h3 style="left:30px;top:22px">DESKTOP</h3><h3 style="left:770px;top:126px">TABLET</h3><h3 style="left:1060px;top:660px">PHONE</h3>
<div style="position:absolute;left:30px;bottom:40px;width:600px;font:500 15px 'DM Sans';color:#33545a">One site, one set of content. The layout rearranges itself for each screen size.</div>`, { bare: true });

/* 18 ─ Custom domain: Salt & Wick before/after address */
screens["feature-custom-domain"] = doc("", `
body{background:#f4ede4}
.bar{position:absolute;left:60px;right:60px;background:#fff;border-radius:16px;box-shadow:0 14px 34px rgba(58,42,74,.12);padding:16px 20px;display:flex;align-items:center;gap:16px}
.bar .u{flex:1;font:500 22px "DM Sans";color:#3a3340;display:flex;align-items:center;gap:12px}.bar small{font:700 11px "Poppins";letter-spacing:.12em;padding:5px 10px;border-radius:999px}
.bad{opacity:.75}.bad .u{color:#8a8290;text-decoration:line-through;text-decoration-color:#d06a6a}
.site{position:absolute;left:60px;right:60px;top:250px;height:380px;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 20px 50px rgba(58,42,74,.18);display:grid;grid-template-columns:1fr 1fr}
.site img{width:100%;height:100%}.sc{padding:34px}.sc .logo{font:600 22px "Fraunces";color:#3a2a4a}.sc h2{font:600 36px/1.1 "Fraunces";color:#3a2a4a;margin:28px 0 12px}.sc p{color:#6b5b6b;font-size:15px;line-height:1.55}
.cards{position:absolute;left:60px;right:60px;bottom:36px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.c{background:#3a2a4a;color:#f4ede4;border-radius:12px;padding:14px 16px;font-size:13px;line-height:1.45}.c b{display:block;color:#fff;font-size:15px;margin-bottom:2px}
`, `<div class="bar bad" style="top:40px"><small style="background:#f3dede;color:#a04040">GENERIC</small><div class="u">saltandwick.sitebuilder-free.example/store-82731</div></div>
<div class="bar" style="top:130px;outline:3px solid #3a2a4a"><small style="background:#3a2a4a;color:#fff">YOUR DOMAIN</small><div class="u">${lock.replace(/12/g, "18").replace(/13/g, "19")}<span>https://www.<b style="color:#3a2a4a">saltandwick</b>.example</span></div></div>
<div class="site"><img src="${photo("candles")}"><div class="sc"><div class="logo">Salt &amp; Wick</div><h2>Hand-poured coastal candles from Bay St. Louis.</h2><p>Small batches, cotton wicks, and scents inspired by the Gulf.</p></div></div>
<div class="cards"><div class="c"><b>Easy to remember</b>Print it on labels, cards and the van.</div><div class="c"><b>Matching email</b>hello@saltandwick.example</div><div class="c"><b>Yours to keep</b>Registered in the business's name.</div></div>`, { bare: true });

/* 19 ─ SSL: padlock details on a checkout-style page */
screens["feature-ssl"] = doc("", `
body{background:#e9eef2}
.win{position:absolute;inset:24px 40px 40px;border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.18)}
.url{max-width:620px;font-size:14px}.url b{color:#1d2230}
.v{display:grid;grid-template-columns:1fr 1fr;height:100%;background:#fbfaf7}
.l{position:relative}.l img{width:100%;height:100%}.l div{position:absolute;inset:auto 0 0 0;padding:26px;color:#fff;background:linear-gradient(0deg,rgba(20,30,40,.9),transparent)}.l h2{font:600 30px "Fraunces"}
.r{padding:30px 34px}.r h1{font:600 26px "Fraunces";color:#1f3d4f}.r .s{font-size:13px;color:#6d7b88;margin:4px 0 16px}
.f{margin-bottom:12px}.f .inp{width:100%}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.go{background:#1f3d4f;color:#fff;text-align:center;font-weight:700;padding:13px;border-radius:8px;display:flex;justify-content:center;gap:8px;align-items:center}
.pop{position:absolute;left:110px;top:74px;width:360px;background:#fff;border-radius:12px;box-shadow:0 18px 44px rgba(0,0,0,.25);padding:16px;z-index:10;font-size:13px;color:#3a4350;border:1px solid #e3e6ea}
.pop h4{display:flex;align-items:center;gap:8px;font-size:15px;color:#1d2230;margin-bottom:8px}.pop .ok{color:#2f7a4b;font-weight:700}
.pop .row{display:flex;justify-content:space-between;padding:7px 0;border-top:1px solid #f0f2f4}
.flow{display:flex;align-items:center;gap:10px;margin-top:10px;font-size:12px;color:#1d2230}.flow span{background:#eef6f1;border-radius:8px;padding:6px 8px}.flow i{flex:1;height:2px;background:repeating-linear-gradient(90deg,#2f7a4b 0 6px,transparent 6px 10px)}
`, `<div class="win"><div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url" style="outline:2px solid #2f7a4b">${lock}<span><b>https://</b>pierlightcoffee.example/gift-cards</span></div></div><div class="view"><div class="v"><div class="l"><img src="${photo("latte")}"><div><h2>Pier Light gift cards</h2><p style="font-size:14px;opacity:.9">Sent by email, good for any drink or pastry.</p></div></div>
<div class="r"><h1>Send a gift card</h1><div class="s">Your details travel over an encrypted HTTPS connection.</div>
<div class="two"><div class="f"><span class="lbl">Amount</span><div class="inp">$25.00</div></div><div class="f"><span class="lbl">Delivery date</span><div class="inp">Dec 20</div></div></div>
<div class="f"><span class="lbl">Recipient email</span><div class="inp">grace.l@mail.example</div></div>
<div class="f"><span class="lbl">Card number</span><div class="inp">•••• •••• •••• 4242</div></div>
<div class="two"><div class="f"><span class="lbl">Expiry</span><div class="inp">08 / 28</div></div><div class="f"><span class="lbl">Security code</span><div class="inp">•••</div></div></div>
<div class="go">${lock.replace(/#3d7d55/g, "#fff")} Continue securely</div><div style="font-size:11px;color:#8a97a4;text-align:center;margin-top:8px">Picture only. No payment is taken.</div></div></div></div></div>
<div class="pop"><h4>${lock} Connection is secure</h4><div class="ok">Your information is encrypted in transit.</div>
<div class="row"><span>Certificate</span><b>Valid</b></div><div class="row"><span>Issued to</span><b>pierlightcoffee.example</b></div><div class="row"><span>Renews</span><b>Automatically</b></div>
<div class="flow"><span>Visitor</span><i></i>${lock}<i></i><span>Website</span></div></div>`, { bare: true });

/* 20 ─ Click to call / text: Coastal Comfort Air */
const phoneSite = `<div style="background:#0b3954;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center"><b style="font:700 15px 'Space Grotesk'">Coastal Comfort <span style="color:#ff9f1c">Air</span></b><span style="font-size:18px">☰</span></div>
<div style="position:relative;height:210px"><img src="${photo("hvac")}" style="width:100%;height:100%"><div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,57,84,.92),transparent 60%);color:#fff;padding:14px;display:flex;flex-direction:column;justify-content:flex-end"><b style="font:700 22px/1.1 'Space Grotesk'">A/C out? We answer 24/7.</b><span style="font-size:12px;opacity:.85;margin-top:4px">Gulfport · Biloxi · Ocean Springs</span></div></div>
<div style="padding:14px;display:grid;gap:10px"><div style="background:#ff9f1c;color:#0b3954;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:center;justify-content:center;font-weight:700;font-size:16px">${icon.phone} Call now</div><div style="background:#fff;border:2px solid #0b3954;color:#0b3954;border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;justify-content:center;font-weight:700;font-size:16px">${icon.msg} Send a text</div>
<div style="font-size:12px;color:#4a6475;line-height:1.5;text-align:center">(228) 555-0169 · Licensed and insured</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px"><div style="background:#eef4f7;border-radius:10px;padding:10px"><b style="display:block;color:#0b3954">Repair</b>All brands</div><div style="background:#eef4f7;border-radius:10px;padding:10px"><b style="display:block;color:#0b3954">Tune-ups</b>Spring and fall</div></div></div>`;
screens["feature-click-to-call"] = doc("", `
body{background:linear-gradient(135deg,#0b3954,#13506f)}
.ph{position:absolute;width:300px;height:620px;background:#111;border-radius:44px;padding:12px;box-shadow:0 30px 60px rgba(0,0,0,.4)}
.sc{width:100%;height:100%;border-radius:34px;overflow:hidden;background:#fff;position:relative;font-family:"DM Sans"}
.notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:90px;height:24px;background:#111;border-radius:14px;z-index:5}
.sbar{height:40px}
.copy{position:absolute;left:60px;top:120px;width:380px;color:#fff}.copy small{font:700 12px "Poppins";letter-spacing:.16em;color:#ff9f1c}.copy h1{font:700 40px/1.1 "Space Grotesk";margin:12px 0}.copy p{font-size:16px;line-height:1.55;opacity:.85}
.copy li{list-style:none;margin-top:14px;display:flex;gap:10px;font-size:15px}.copy li b{color:#ff9f1c}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#f2f2f6;border-radius:20px 20px 0 0;padding:18px;text-align:center}
`, `<div class="copy"><small>CLICK TO CALL · CLICK TO TEXT</small><h1>One tap from your site to your phone.</h1><p>Visitors on a phone don't have to copy a number. They tap, and their phone starts the call or opens a text already addressed to you.</p><ul><li><b>1</b>Tap Call now or Send a text</li><li><b>2</b>The phone's own dialer or messages app opens</li><li><b>3</b>The customer reaches you directly</li></ul></div>
<div class="ph" style="left:500px;top:84px"><div class="sc"><div class="notch"></div><div class="sbar"></div>${phoneSite}</div></div>
<div class="ph" style="left:850px;top:84px"><div class="sc" style="background:#fafafa"><div class="notch"></div><div class="sbar"></div>
<div style="padding:12px 16px;border-bottom:1px solid #e5e5ea;text-align:center"><div style="width:52px;height:52px;border-radius:50%;background:#0b3954;color:#fff;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-weight:700">CC</div><b style="font-size:14px">Coastal Comfort Air</b><div style="font-size:12px;color:#8e8e93">(228) 555-0169</div></div>
<div style="padding:16px;display:grid;gap:10px"><div style="align-self:end;justify-self:end;background:#0a84ff;color:#fff;border-radius:18px 18px 4px 18px;padding:10px 13px;font-size:13px;max-width:220px;text-align:left">Hi, my upstairs unit is blowing warm air. Is anyone available today? 1420 Pine St, Biloxi.</div><div style="font-size:11px;color:#8e8e93;text-align:right">Sample text message</div></div>
<div class="sheet"><div style="font-size:13px;color:#8e8e93;margin-bottom:8px">From the website</div><div style="background:#34c759;color:#fff;border-radius:14px;padding:13px;font-weight:700;display:flex;justify-content:center;gap:8px;align-items:center">${icon.phone} Call (228) 555-0169</div><div style="margin-top:8px;background:#fff;border-radius:14px;padding:12px;font-weight:600;color:#0a84ff">Cancel</div></div></div></div>`, { bare: true });

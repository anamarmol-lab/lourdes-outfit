/* Lourdes — Armá su outfit
   Las prendas son capas PNG en img/ (mismo lienzo vertical 2:3 que lourdes_base.png).
   Si una imagen todavía no existe, se dibuja una prenda de prueba de color. */
(() => {
  'use strict';

  const COLORS = { mostaza:'#DFAE26', ladrillo:'#B9382B', oliva:'#5F6D3C', naranja:'#D46424', azul:'#67858E', crema:'#F6F0E4', tinta:'#2B2118' };
  const ORDER = ['mostaza','ladrillo','oliva','naranja','azul','crema','tinta','mostaza'];
  const INK = COLORS.tinta;

  // categorías y prendas: [etiqueta del archivo, nombre que se ve]
  const CATS = [
    { id:'top',    label:'Top',     focus:{ x:.50, y:.33, z:2.4 }, items:[['garden','Garden'],['carnaval','Carnaval'],['mar','Mar'],['rooftop','Rooftop'],['playa','Playa'],['mostaza','Mostaza'],['oliva','Oliva'],['ladrillo','Ladrillo']] },
    { id:'bottom', label:'Abajo',   focus:{ x:.50, y:.62, z:1.7 }, items:[['garden','Garden'],['carnaval','Carnaval'],['mar','Mar'],['rooftop','Rooftop'],['playa','Playa'],['naranja','Naranja'],['oliva','Oliva'],['azul','Azul']] },
    { id:'shoes',  label:'Zapatos', focus:{ x:.50, y:.93, z:3.3 }, items:[['garden','Garden'],['carnaval','Carnaval'],['mar','Mar'],['rooftop','Rooftop'],['playa','Playa'],['ladrillo','Ladrillo'],['crema','Crema'],['marron','Marrón']] },
    { id:'bag',    label:'Cartera', focus:{ x:.73, y:.58, z:3.5 }, items:[['garden','Garden'],['carnaval','Carnaval'],['mar','Mar'],['rooftop','Rooftop'],['playa','Playa']] },
    { id:'obj',    label:'Objeto',  focus:{ x:.73, y:.62, z:3.5 }, items:[['sombrilla','Sombrilla'],['sombrero','Sombrero'],['llaves','Llaves'],['antiparras','Antiparras'],['zapato','Zapato dorado']] }
  ];
  const LAYER_ORDER = ['bottom','top','shoes','bag','obj']; // de abajo hacia arriba
  const PARTIES = [['garden','Garden party'],['carnaval','Carnaval'],['mar','Alta mar'],['rooftop','Rooftop'],['playa','Playa']];

  const state = { top:0, bottom:0, shoes:0, bag:0, obj:0, bg:'garden', cat:'top' };
  const real = {}; // clave -> url real (si la imagen existe)

  /* ---------- imágenes: reales o de prueba ---------- */
  const svgUrl = (svg) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">${inner}</svg>`;
  const st = `stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"`;
  const SKIN = '#E8B58F', HAIR = '#6B3E26';

  function baseSVG() {
    return wrap(`
      <rect x="106" y="22" width="88" height="80" rx="30" fill="${HAIR}"/>
      <rect x="122" y="255" width="22" height="160" fill="${SKIN}"/><rect x="156" y="255" width="22" height="160" fill="${SKIN}"/>
      <ellipse cx="132" cy="417" rx="20" ry="9" fill="${SKIN}"/><ellipse cx="168" cy="417" rx="20" ry="9" fill="${SKIN}"/>
      <rect x="92" y="104" width="16" height="130" rx="8" fill="${SKIN}"/><rect x="192" y="104" width="16" height="130" rx="8" fill="${SKIN}"/>
      <rect x="108" y="206" width="84" height="56" rx="6" fill="#FFFFFF" ${st}/>
      <rect x="108" y="98" width="84" height="116" rx="10" fill="${COLORS.crema}" ${st}/>
      <rect x="140" y="80" width="20" height="22" fill="${SKIN}"/>
      <ellipse cx="150" cy="55" rx="32" ry="33" fill="${SKIN}"/>
      <rect x="118" y="22" width="64" height="20" rx="10" fill="${HAIR}"/>
      <ellipse cx="150" cy="23" rx="42" ry="17" fill="${INK}"/>
      <circle cx="124" cy="20" r="2.6" fill="#fff"/><circle cx="144" cy="13" r="2.6" fill="#fff"/><circle cx="164" cy="16" r="2.6" fill="#fff"/><circle cx="182" cy="24" r="2.6" fill="#fff"/>
      <rect x="184" y="14" width="26" height="10" rx="4" fill="${INK}" transform="rotate(-25 184 14)"/>
      <rect x="186" y="24" width="26" height="10" rx="4" fill="${INK}" transform="rotate(12 186 24)"/>
      <circle cx="136" cy="58" r="2.8" fill="${INK}"/><circle cx="162" cy="58" r="2.8" fill="${INK}"/>
      <rect x="142" y="72" width="16" height="2.6" rx="1.3" fill="${INK}"/>`);
  }
  function placeholderSVG(cat, idx, tag) {
    const i = idx + 1;
    const col = (name) => COLORS[name];
    if (cat === 'top') { const c = col(ORDER[i-1]);
      return wrap(`<rect x="98" y="94" width="104" height="116" rx="12" fill="${c}" ${st}/><rect x="84" y="98" width="22" height="44" rx="8" fill="${c}" ${st}/><rect x="194" y="98" width="22" height="44" rx="8" fill="${c}" ${st}/>`); }
    if (cat === 'bottom') { const c = col(ORDER[(i+2)%8]);
      return wrap(i%2 === 1
        ? `<path d="M100 204 L200 204 L228 350 L72 350 Z" fill="${c}" ${st}/>`
        : `<path d="M104 204 L148 204 L152 410 L110 410 Z" fill="${c}" ${st}/><path d="M152 204 L196 204 L190 410 L148 410 Z" fill="${c}" ${st}/>`); }
    if (cat === 'shoes') { const c = col(ORDER[(i+4)%8]);
      return wrap(`<rect x="106" y="408" width="46" height="24" rx="11" fill="${c}" ${st}/><rect x="148" y="408" width="46" height="24" rx="11" fill="${c}" ${st}/>`); }
    if (cat === 'bag') { const c = col(ORDER[(i+1)%8]);
      return wrap(`<line x1="190" y1="102" x2="214" y2="240" stroke="${INK}" stroke-width="3"/><rect x="198" y="238" width="44" height="38" rx="8" fill="${c}" ${st}/>`); }
    // objetos
    const gold = '#DEAD4C';
    const shapes = {
      sombrilla:`<line x1="218" y1="250" x2="218" y2="334" stroke="${INK}" stroke-width="3"/><path d="M192 264 Q218 214 244 264 Z" fill="${COLORS.crema}" ${st}/>`,
      sombrero:`<ellipse cx="226" cy="262" rx="32" ry="11" fill="${gold}" ${st}/><rect x="212" y="236" width="28" height="26" rx="9" fill="${gold}" ${st}/>`,
      llaves:`<circle cx="214" cy="258" r="8" fill="none" stroke="${gold}" stroke-width="4"/><rect x="220" y="256" width="22" height="5" fill="${gold}" ${st}/><circle cx="206" cy="272" r="7" fill="${COLORS.ladrillo}" ${st}/>`,
      antiparras:`<circle cx="208" cy="264" r="11" fill="${COLORS.azul}" ${st}/><circle cx="234" cy="264" r="11" fill="${COLORS.azul}" ${st}/>`,
      zapato:`<path d="M202 280 L226 280 L230 266 L218 246 L208 266 Z" fill="${gold}" ${st}/>`
    };
    return wrap(shapes[tag] || '');
  }

  const fileFor = (cat, idx, tag) => `img/${cat}_${idx+1}_${tag}.png`;
  const keyOf = (cat, idx) => `${cat}:${idx}`;
  const srcFor = (cat, idx) => {
    const c = CATS.find(x => x.id === cat); const tag = c.items[idx][0];
    return real[keyOf(cat, idx)] || svgUrl(placeholderSVG(cat, idx, tag));
  };
  const baseSrc = () => real['base'] || svgUrl(baseSVG());

  /* ---------- imágenes reales: sacar el fondo y acomodarlas sobre el cuerpo ---------- */
  const W0 = 1024, H0 = 1536; // lienzo de la imagen base
  // dónde va cada categoría sobre el cuerpo (en píxeles del lienzo 1024 x 1536)
  const FIT = {
    top:    { by:'w',   size:285, ax:512, ay:272,  anchor:'top',    maxH:345 },
    bottom: { by:'h',   size:880, ax:512, ay:560,  anchor:'top' },
    shoes:  { by:'w',   size:350, ax:540, ay:1512, anchor:'bottom' },
    bag:    { by:'max', size:240, ax:650, ay:760,  anchor:'center' },
    obj:    { by:'max', size:260, ax:690, ay:830,  anchor:'center' }
  };
  // ajustes puntuales por prenda: 'categoria:numero' -> cambios sobre FIT
  const FIT_ITEM = {
    // largo de cada pollera o pantalón, desde la cintura (en píxeles del lienzo)
    'bottom:1':{ size:850 }, 'bottom:2':{ size:880 }, 'bottom:3':{ size:880 }, 'bottom:4':{ size:850 },
    'bottom:5':{ size:800 }, 'bottom:6':{ size:560 }, 'bottom:7':{ size:880 }, 'bottom:8':{ size:860 },
    // ancho de los tops con mangas
    'top:2':{ size:380 }, 'top:6':{ size:340 }, 'top:8':{ size:340 }, 'top:5':{ size:240, maxH:200 }
  };

  const loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
  const probe = (url) => loadImg(url).then(() => true, () => false);

  // saca el fondo claro que toca los bordes (si ya es transparente, no hace nada)
  function removeBackground(ctx, w, h) {
    const img = ctx.getImageData(0, 0, w, h), px = img.data;
    // color del fondo: promedio de las 4 esquinas (puede ser blanco o gris claro)
    const corners = [[0,0],[w-1,0],[0,h-1],[w-1,h-1]].map(([x,y]) => { const i = (y*w+x)*4; return [px[i],px[i+1],px[i+2]]; });
    const bg = [0,1,2].map(k => corners.reduce((a,v) => a + v[k], 0) / 4);
    const light = (i) => px[i+3] < 10 || (px[i] > 228 && px[i+1] > 228 && px[i+2] > 228) ||
      ((px[i]-bg[0])**2 + (px[i+1]-bg[1])**2 + (px[i+2]-bg[2])**2 < 45*45 && bg[0] > 170);
    const seen = new Uint8Array(w * h), stack = [];
    const push = (x, y) => { const p = y * w + x; if (!seen[p] && light(p * 4)) { seen[p] = 1; stack.push(p); } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (stack.length) {
      const p = stack.pop(), x = p % w, y = (p / w) | 0;
      if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
    }
    for (let p = 0; p < seen.length; p++) if (seen[p]) px[p * 4 + 3] = 0;
    // borde suave: saca el halo claro pegado al fondo
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const p = y * w + x, i = p * 4;
      if (px[i+3] && px[i] > 205 && px[i+1] > 205 && px[i+2] > 205 &&
          (px[(p-1)*4+3] === 0 || px[(p+1)*4+3] === 0 || px[(p-w)*4+3] === 0 || px[(p+w)*4+3] === 0)) px[i+3] = 0;
    }
    ctx.putImageData(img, 0, 0);
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }

  async function prepare(url, cat, num) {
    const im = await loadImg(url);
    const src = document.createElement('canvas'); src.width = im.naturalWidth; src.height = im.naturalHeight;
    const sctx = src.getContext('2d', { willReadFrequently: true }); sctx.drawImage(im, 0, 0);
    const bb = removeBackground(sctx, src.width, src.height);
    const out = document.createElement('canvas'); out.width = W0; out.height = H0; const octx = out.getContext('2d');
    if (!bb) return url;
    if (!cat) { // imagen base: solo fondo transparente, mismo lienzo
      octx.drawImage(src, 0, 0, W0, H0); return out.toDataURL('image/png');
    }
    const f = Object.assign({}, FIT[cat], FIT_ITEM[cat + ':' + num] || {});
    let sc = f.by === 'w' ? f.size / bb.w : f.by === 'h' ? f.size / bb.h : f.size / Math.max(bb.w, bb.h);
    if (f.maxH) sc = Math.min(sc, f.maxH / bb.h);
    const dw = bb.w * sc, dh = bb.h * sc, dx = f.ax - dw / 2;
    const dy = f.anchor === 'top' ? f.ay : f.anchor === 'bottom' ? f.ay - dh : f.ay - dh / 2;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(src, bb.x, bb.y, bb.w, bb.h, dx, dy, dw, dh);
    return out.toDataURL('image/png');
  }

  async function probeAll() {
    const base = 'img/lourdes_base.png';
    if (await probe(base)) real['base'] = await prepare(base, null, 0).catch(() => base);
    for (const c of CATS) for (let idx = 0; idx < c.items.length; idx++) {
      const url = fileFor(c.id, idx, c.items[idx][0]);
      if (await probe(url)) real[keyOf(c.id, idx)] = await prepare(url, c.id, idx + 1).catch(() => null) || undefined;
    }
  }

  /* ---------- dibujar ---------- */
  const $ = (s) => document.querySelector(s);
  function paintFigure(el) {
    el.innerHTML = '';
    const mk = (src, alt) => { const im = document.createElement('img'); im.src = src; im.alt = alt || ''; im.draggable = false; el.appendChild(im); };
    mk(baseSrc(), 'Lourdes');
    for (const cat of LAYER_ORDER) { if (state[cat] > 0) mk(srcFor(cat, state[cat] - 1), cat); }
  }
  function paintAllFigures() { paintFigure($('#figure')); }

  function thumbFor(cat, idx) {
    const c = CATS.find(x => x.id === cat); const f = c.focus;
    const box = document.createElement('div'); box.className = 'thumb';
    const im = document.createElement('img'); im.src = srcFor(cat, idx); im.alt = '';
    // el recorte muestra la zona del cuerpo donde va la prenda
    const W = 100 * f.z; // % del ancho del recuadro
    im.style.width = W + '%';
    im.style.left = (50 - W * f.x) + '%';
    im.style.top = (50 - W * 1.5 * f.y) + '%';
    box.appendChild(im); return box;
  }

  function paintTabs() {
    const nav = $('#tabs'); nav.innerHTML = '';
    for (const c of CATS) {
      const b = document.createElement('button'); b.className = 'tab' + (state.cat === c.id ? ' on' : ''); b.textContent = c.label; b.type = 'button';
      b.addEventListener('click', () => { state.cat = c.id; paintTabs(); paintGrid(); });
      nav.appendChild(b);
    }
  }
  function paintGrid() {
    const g = $('#grid'); g.innerHTML = '';
    const c = CATS.find(x => x.id === state.cat);
    c.items.forEach(([tag, name], idx) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'item' + (state[c.id] === idx + 1 ? ' on' : '');
      const box = document.createElement('div'); box.className = 'box'; box.appendChild(thumbFor(c.id, idx)); b.appendChild(box);
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = name; b.appendChild(nm);
      b.addEventListener('click', () => { state[c.id] = state[c.id] === idx + 1 ? 0 : idx + 1; refresh(); });
      g.appendChild(b);
    });
  }
  function paintSlots() {
    const s = $('#slots'); s.innerHTML = '';
    for (const c of CATS) {
      const d = document.createElement('div'); const on = state[c.id] > 0; d.className = 'slot' + (on ? ' full' : ''); d.title = c.label;
      if (on) {
        d.appendChild(thumbFor(c.id, state[c.id] - 1));
        const x = document.createElement('button'); x.type = 'button'; x.className = 'x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Sacar ' + c.label);
        x.addEventListener('click', () => { state[c.id] = 0; refresh(); }); d.appendChild(x);
      } else { d.textContent = c.label; }
      s.appendChild(d);
    }
  }
  function paintBgPick() {
    const p = $('#bgpick'); p.innerHTML = '';
    for (const [k, nm] of PARTIES) {
      const b = document.createElement('button'); b.type = 'button'; b.className = state.bg === k ? 'on' : ''; b.title = nm; b.setAttribute('aria-label', nm);
      const im = document.createElement('img'); im.src = `img/bg_${k}.jpg`; im.alt = nm; b.appendChild(im);
      b.addEventListener('click', () => { state.bg = k; refresh(); }); p.appendChild(b);
    }
  }
  function paintBg() { $('#bg').src = `img/bg_${state.bg}.jpg`; }
  function refresh() { paintBg(); paintBgPick(); paintAllFigures(); paintTabs(); paintGrid(); paintSlots(); }

  /* ---------- pantallas ---------- */
  const screens = { intro:$('#intro'), game:$('#game'), result:$('#result') };
  function show(name) { Object.entries(screens).forEach(([k, el]) => el.classList.toggle('active', k === name)); window.scrollTo(0, 0); }
  function resetAll() { state.top = state.bottom = state.shoes = state.bag = state.obj = 0; state.cat = 'top'; refresh(); }

  $('#btn-start').addEventListener('click', () => { show('game'); const m = $('#mision'); if (!sessionStorageSafe('visto')) { m.hidden = false; } });
  $('#btn-vamos').addEventListener('click', () => { $('#mision').hidden = true; sessionStorageSafe('visto', '1'); });
  $('#btn-home').addEventListener('click', () => show('intro'));
  $('#btn-home2').addEventListener('click', () => show('intro'));
  $('#btn-reset').addEventListener('click', resetAll);
  $('#btn-again').addEventListener('click', () => show('game'));
  $('#btn-listo').addEventListener('click', () => {
    $('#bg-result').src = `img/bg_${state.bg}.jpg`; paintFigure($('#figure-result')); show('result');
  });
  function sessionStorageSafe(k, v) { try { if (v !== undefined) sessionStorage.setItem(k, v); return sessionStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- guardar imagen ---------- */
  async function savePNG() {
    const W = 1000, H = 1250;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    const bg = await loadImg(`img/bg_${state.bg}.jpg`);
    const r = Math.max(W / bg.width, H / bg.height); const bw = bg.width * r, bh = bg.height * r;
    ctx.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh);
    const figH = H * 0.94, figW = figH * 2 / 3, fx = (W - figW) / 2, fy = H - figH - H * 0.02;
    const srcs = [baseSrc()]; for (const cat of LAYER_ORDER) if (state[cat] > 0) srcs.push(srcFor(cat, state[cat] - 1));
    for (const s of srcs) { const im = await loadImg(s); ctx.drawImage(im, fx, fy, figW, figH); }
    ctx.fillStyle = 'rgba(246,240,228,.92)'; ctx.fillRect(0, H - 86, W, 86);
    ctx.fillStyle = INK; ctx.font = '600 34px Fraunces, Georgia, serif'; ctx.textBaseline = 'middle'; ctx.fillText('Lourdes · A dónde vamos', 36, H - 43);
    const a = document.createElement('a'); a.download = 'look-de-lourdes.png';
    cv.toBlob((b) => { a.href = URL.createObjectURL(b); document.body.appendChild(a); a.click(); a.remove(); }, 'image/png');
  }
  $('#btn-save').addEventListener('click', () => { savePNG().catch(() => alert('No pude guardar la imagen. Probá sacar una captura de pantalla.')); });

  /* ---------- inicio ---------- */
  probeAll().then(() => { paintFigure($('#figure-intro')); refresh(); }).catch(() => {});
  paintFigure($('#figure-intro')); refresh();
})();

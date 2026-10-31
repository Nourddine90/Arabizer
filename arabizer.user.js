// ==UserScript==
// @name         معرّب — Arabizer
// @namespace    https://github.com/YOUR_USERNAME/arabizer
// @version      1.0.0
// @description  ترجمة أي موقع إلى العربية بضغطة زر — بدون إعلانات
// @author       You
// @match        *://*/*
// @grant        none
// @noframes
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // تجاهل الصفحات العربية أصلاً
  if (/^ar\b/i.test(document.documentElement.lang || '')) return;

  // ===== زر عائم =====
  const btn = document.createElement('button');
  btn.textContent = '🌐 عرّب';
  Object.assign(btn.style, {
    position: 'fixed', bottom: '20px', left: '20px',
    zIndex: '2147483647', padding: '12px 22px',
    background: 'linear-gradient(135deg,#0a7c4a,#064e30)',
    color: '#fff', border: 'none', borderRadius: '30px',
    fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,.35)',
    fontFamily: 'Tahoma,Arial,sans-serif',
    transition: 'transform .2s'
  });
  btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseleave = () => btn.style.transform = 'scale(1)';
  document.body.appendChild(btn);

  // ===== مخزن النصوص الأصلية للاسترجاع =====
  const originals = new WeakMap();
  const cache = new Map();
  let translated = false;

  // ===== محرك الترجمة (مجاني، بدون مفتاح) =====
  async function translate(text) {
    if (!text || !text.trim() || text.length > 4500) return text;
    if (cache.has(text)) return cache.get(text);
    try {
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=' + encodeURIComponent(text);
      const res = await fetch(url);
      if (!res.ok) throw 0;
      const data = await res.json();
      const out = data[0].map(x => x[0]).join('');
      cache.set(text, out);
      return out;
    } catch {
      return text; // فشل صامت — يترك النص الأصلي
    }
  }

  // ===== جمع كل النصوص القابلة للترجمة =====
  function collectNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA','INPUT','SVG','CANVAS'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const arr = []; let n;
    while ((n = walker.nextNode())) arr.push(n);
    return arr;
  }

  // ===== الترجمة على دفعات (لتجنب الحظر) =====
  async function runTranslation() {
    const nodes = collectNodes();
    const total = nodes.length;
    let done = 0;
    const BATCH = 15;

    for (let i = 0; i < nodes.length; i += BATCH) {
      const slice = nodes.slice(i, i + BATCH);
      await Promise.all(slice.map(async node => {
        if (!originals.has(node)) originals.set(node, node.nodeValue);
        node.nodeValue = await translate(node.nodeValue);
      }));
      done += slice.length;
      btn.textContent = `⏳ ${Math.round(done / total * 100)}%`;
    }

    // ترجمة عنوان التبويب أيضاً
    try {
      if (!originals.has(document)) originals.set(document, document.title);
      document.title = await translate(document.title);
    } catch {}
  }

  // ===== استرجاع النص الأصلي =====
  function restore() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (originals.has(n)) n.nodeValue = originals.get(n);
    }
    if (originals.has(document)) document.title = originals.get(document);
  }

  // ===== حدث الزر =====
  btn.addEventListener('click', async () => {
    if (translated) {
      restore();
      translated = false;
      btn.textContent = '🌐 عرّب';
      return;
    }
    btn.disabled = true;
    btn.textContent = '⏳ 0%';
    try {
      await runTranslation();
      translated = true;
      btn.textContent = '↩️ الأصل';
    } catch (e) {
      btn.textContent = '❌ خطأ';
    } finally {
      btn.disabled = false;
    }
  });
})();

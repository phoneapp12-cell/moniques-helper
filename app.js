/* Monique's Helper – Bills, Budget and Loans. Everything is saved on this phone only (localStorage). Nothing is sent anywhere. */
'use strict';
const { DAY, todayT, todayISO, parseD, isoT, daysLeft, addDays, addMonths, fmt, fmtY, fmtW, fmtLong, money, REPEATS, nextDue, billDates, repeatDates, status, centsMoney, parseCents } = MH;
const APP_VERSION = '1.2.0';
const STORE_KEY = 'moniquesHelper.data.v1';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = p => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const plural = (n, w, ws) => n + ' ' + (n === 1 ? w : (ws || w + 's'));
const jsArg = s => esc(JSON.stringify(s));
const P = {
  bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  coins: '<ellipse cx="9" cy="6.5" rx="6" ry="2.5"/><path d="M3 6.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"/><path d="M15 10.5c3.3 0 6 1.1 6 2.5s-2.7 2.5-6 2.5-6-1.1-6-2.5"/><path d="M9 13v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  drop: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  house: '<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5"/>',
  left: '<path d="M15 18l-6-6 6-6"/>',
  pen: '<path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 2l3 4 3-4"/>',
  umbrella: '<path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v7a2 2 0 0 0 4 0"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0M2 8.8a16 16 0 0 1 20 0M12 20h.01"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'
};

const I = (n, a = '') => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${a}>${P[n] || ''}</svg>`;

/* ---------- data (this phone only) ---------- */
let S = null;
const blank = () => ({ version: 1, bills: [], loans: [], budgets: [], appts: [], settings: {} });
function normalise(d) {
  d = d && typeof d === 'object' ? d : {};
  if (!Array.isArray(d.bills)) d.bills = [];
  d.bills = d.bills.filter(b => b && typeof b === 'object' && b.id);
  d.loans = normLoans(d.loans);
  d.budgets = normBudgets(d.budgets);
  d.appts = normAppts(d.appts);
  const st = d.settings && typeof d.settings === 'object' ? d.settings : {};
  d.settings = { payday: st.payday || '', notify: !!st.notify, seen: Array.isArray(st.seen) ? st.seen.map(String).slice(-200) : [] };
  d.version = 1;
  return d;
}
function load() {
  try { S = normalise(JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || blank()); } catch (e) { S = blank(); }
}
async function save() {
  S.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { toast('Sorry, that couldn’t be saved on this phone.'); throw e; }
}
const snap = () => JSON.stringify(S);
const undoTo = s => async () => { S = normalise(JSON.parse(s)); await save(); render(); };
function savedWhere() { return 'Saved on this phone only. Use Backup to keep a copy.'; }
function billIcon(name) {
  const n = String(name || '').toLowerCase();
  if (/power|electric|energy|gas|contact|mercury|genesis|meridian/.test(n)) return 'zap';
  if (/phone|mobile|spark|one nz|2degrees|vodafone/.test(n)) return 'phone';
  if (/internet|broadband|fibre|wifi/.test(n)) return 'wifi';
  if (/netflix|tv|sky|stream|disney|neon|spotify/.test(n)) return 'tv';
  if (/insur/.test(n)) return 'umbrella';
  if (/rates|rent|mortgage|council|house/.test(n)) return 'house';
  if (/water/.test(n)) return 'drop';
  return 'bill';
}

/* ---------- small UI helpers ---------- */
function dueTone(d) { return d <= 2 ? 'hot' : d <= 5 ? 'warm' : 'cool'; }
function duePill(d, prefix = '') {
  const w = d < 0 ? (-d) + (d === -1 ? ' day' : ' days') + ' overdue' : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d + ' days';
  return `<span class="pill duepill ${dueTone(d)}">${prefix}${w}</span>`;
}
function moneyBadge(amount, label) {
  const under = label ? `<small>${esc(label)}</small>` : '';
  return `<span class="moneybadge"><b>${money(amount)}</b>${under}</span>`;
}
function header(title, sub, extra = '') {
  return `<div class="top"><div style="min-width:0"><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
  <div class="iconrow">${extra}</div></div>`;
}
const addBtn = (label, fn) => `<button class="iconbtn add" aria-label="${label}" onclick="${fn}">${I('plus')}</button>`;
const empty = (t, s, btnLabel, fn) => `<div class="card empty"><div class="t">${t}</div><div class="s">${s}</div>${btnLabel ? `<button class="btn primary" style="flex:none;padding:12px 22px" onclick="${fn}">${I('plus')} ${btnLabel}</button>` : ''}</div>`;
function go(h) { if (location.hash === h) render(); else location.hash = h; }
let toastTimer;
function toast(msg, btn, fn) {
  const t = $('#toast'); $('#toastmsg').textContent = msg;
  const b = $('#toastbtn'); b.textContent = btn || ''; b.style.display = btn ? '' : 'none';
  b.onclick = () => { t.classList.remove('show'); fn && fn(); };
  t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), btn ? 6000 : 3500);
}
/* ---------- pop-up sheet (forms), closes with Android back ---------- */
let sheetOpen = false, sheetResolve = null, reloadPending = false, sheetSubmit = null;
function openSheet(title, inner, onSubmit, submitLabel = 'Save', extraBtns = '') {
  const el = $('#sheet');
  sheetSubmit = onSubmit;
  el.innerHTML = `<div class="scrim" onclick="closeSheet()"></div><div class="panel" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="grab"></div><h3>${title}</h3>
    <form id="sf" novalidate autocomplete="off">${inner}<div class="formerr" id="ferr"></div>
    <div class="btns">${extraBtns}<button type="button" class="btn" onclick="closeSheet()">${onSubmit ? 'Cancel' : 'Close'}</button>${onSubmit ? `<button type="submit" class="btn primary">${submitLabel}</button>` : ''}</div></form></div>`;
  el.classList.add('show');
  // Show the chosen date in words, whatever date format the phone uses
  el.querySelectorAll('input[type=date]').forEach(i => {
    const h = document.createElement('small'); h.className = 'datehint'; i.after(h);
    const upd = () => { h.textContent = parseD(i.value) ? fmtLong(i.value) : ''; };
    i.addEventListener('input', upd); i.addEventListener('change', upd); upd();
  });
  $('#sf').addEventListener('submit', async e => {
    e.preventDefault();
    if (!sheetSubmit) return;
    const f = e.target, v = {};
    new FormData(f).forEach((val, k) => { v[k] = typeof val === 'string' ? val.trim() : val; });
    const err = await sheetSubmit(v, f);
    if (typeof err === 'string') { const x = $('#ferr'); x.textContent = err; x.style.display = 'block'; return; }
    await closeSheet();
    if (typeof err === 'function') err();
  });
  if (!sheetOpen) { history.pushState({ sheet: true }, '', location.href); sheetOpen = true; }
}
function hideSheet() { const el = $('#sheet'); el.classList.remove('show'); el.innerHTML = ''; sheetOpen = false; sheetSubmit = null; }
function closeSheet() {
  return new Promise(res => {
    if (!sheetOpen) return res();
    hideSheet();
    if (history.state && history.state.sheet) { sheetResolve = res; history.back(); } else res();
  });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetOpen) closeSheet(); });
window.addEventListener('popstate', () => {
  if (sheetResolve) { const r = sheetResolve; sheetResolve = null; r(); return; }
  if (sheetOpen) hideSheet();
});
function confirmSheet(title, text, okLabel, fn) {
  openSheet(title, `<p class="muted" style="font-size:0.9375rem;margin:0 0 6px">${text}</p>`, async () => fn(), okLabel);
  const b = $('#sf button[type=submit]'); b.classList.remove('primary'); b.classList.add('danger');
}
const field = (label, input, hint = '') => `<label class="field"><span>${label}</span>${input}${hint ? `<small>${hint}</small>` : ''}</label>`;
const inp = (name, val, attrs = '') => `<input name="${name}" value="${esc(val)}" ${attrs}>`;
const sel = (name, opts, val) => `<select name="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
const area = (name, val, ph = '') => `<textarea name="${name}" placeholder="${esc(ph)}">${esc(val)}</textarea>`;


function segHtml(name, opts, val) {
  return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button type="button" class="${String(v) === String(val) ? 'on' : ''}" data-v="${v}">${l}</button>`).join('')}</div><input type="hidden" name="${name}" value="${val}">`;
}
function wireSeg(name, onPick) {
  const box = document.querySelector(`[data-seg="${name}"]`), hid = document.querySelector(`input[name="${name}"]`);
  box.querySelectorAll('button').forEach(b => b.onclick = () => {
    box.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); hid.value = b.dataset.v;
    if (onPick) onPick(b.dataset.v);
  });
}
/* ================= BILLS ================= */
// Bills are grouped by pay cycle: payday up to the day before the next payday (fortnightly).
// Payday comes from S.settings.payday (picked in Bills).
const BILL_PER_YEAR = { weekly: 52, fortnightly: 26, monthly: 12, quarterly: 4, yearly: 1 };
let payOff = 0;
const payEvent = () => null;
function paydays() {
  const T = todayT(), from = T - 420 * DAY, to = T + 420 * DAY;
  let ev = null;
  if (S.settings.payday && parseD(S.settings.payday) != null) { const a = parseD(S.settings.payday), k = Math.ceil((a - from) / (14 * DAY)); ev = { start: isoT(a - k * 14 * DAY), repeat: 'fortnightly' }; }
  else ev = payEvent();
  if (!ev) return null;
  const ds = repeatDates(ev, from, to).map(x => x.date);
  if (!ds.length) return null;
  if (ds[0] > todayISO()) ds.unshift(addDays(ds[0], -14));
  return ds;
}
function payPeriod(off) {
  const ds = paydays(); if (!ds) return null;
  const T = todayISO(); let i = 0; ds.forEach((d, j) => { if (d <= T) i = j; });
  const j = Math.max(0, Math.min(ds.length - 2, i + off));
  return { start: ds[j], next: ds[j + 1], end: addDays(ds[j + 1], -1), off: j - i, canBack: j > 0, canFwd: j < ds.length - 2 };
}
const payLabel = o => o === 0 ? 'This pay' : o === 1 ? 'Next pay' : o === -1 ? 'Last pay' : o > 1 ? `In ${o} pays` : `${-o} pays ago`;
async function payShift(n) { payOff += n; render(); }
function paydayForm() {
  const ds = paydays(), T = todayISO(), nxt = ds ? (ds.find(d => d > T) || T) : T;
  openSheet('Your payday',
    `<p class="muted" style="margin:0 0 12px">You’re paid every fortnight. Pick your next payday and Bills will show what’s due from each payday up to the next one.</p>` +
    field('Next payday', inp('payday', nxt, 'type="date" required')),
    async v => {
      if (!parseD(v.payday)) return 'Please choose your next payday.';
      S.settings.payday = v.payday; payOff = 0; await save(); render(); toast('Payday saved.');
    }, 'Save');
}
function Bills() {
  const unpaid = S.bills.filter(b => !b.paid);
  const over = unpaid.filter(b => daysLeft(b.due) < 0).length;
  const sorted = [...unpaid].sort((a, b) => parseD(a.due) - parseD(b.due));
  const paid = S.bills.filter(b => b.paid);
  const reg = unpaid.filter(b => BILL_PER_YEAR[b.repeat]);
  const avg = reg.reduce((t, b) => t + (Number(b.amount) || 0) * BILL_PER_YEAR[b.repeat] / 26, 0);
  const hasLoanPlans = (S.loans || []).some(l => !!loanPlan(l));
  const showPay = S.bills.length > 0 || hasLoanPlans;
  const row = b => {
    const d = daysLeft(b.due);
    return `<div class="row bill"><button class="tapzone" onclick="billForm('${b.id}')" aria-label="Edit ${esc(b.name)}"><div class="ic bill">${I(billIcon(b.name))}</div>
      <div class="tx"><div class="t">${esc(b.name)}</div><div class="s">${REPEATS[b.repeat] || 'One-off'} · ${b.paid ? 'paid ' + fmt(b.paidOn || b.due) : 'due ' + fmtW(b.due)}</div></div></button>
      <div class="right badgestack">${b.paid ? '<span class="pill paid">Paid ✓</span>' : duePill(d)}${moneyBadge(b.amount, b.name)}
      ${b.paid ? `<button class="paybtn" onclick="unpay('${b.id}')">Undo</button>` : `<button class="paybtn" onclick="markPaid('${b.id}')">Mark paid</button>`}</div></div>`;
  };
  let pay = '';
  const pp = showPay ? payPeriod(payOff) : null;
  if (showPay && !pp) {
    pay = `<div class="callout green" id="paysetup">${I('cal')}<div style="flex:1"><b>Line your bills up with your pay</b><br>Set your payday and we’ll show what’s due from each payday up to the next one, including loan repayments.
      <div style="margin-top:10px"><button class="btn small primary" onclick="paydayForm()">Set payday</button></div></div></div>`;
  } else if (pp) {
    payOff = pp.off;
    const sT = parseD(pp.start), eT = parseD(pp.end), items = [];
    unpaid.forEach(b => {
      billDates(b, sT, eT).forEach(d => items.push({ kind: 'bill', b, d }));
      if (pp.off === 0 && parseD(b.due) < sT) items.push({ kind: 'bill', b, d: b.due, late: 1 });
    });
    loanPlanInRange(sT, eT).forEach(x => items.push({ kind: 'loan', l: x.l, d: x.d, cents: x.cents }));
    // Bills already paid for a due date in this fortnight stay in the list with ✓ Paid and the date (not counted in the total).
    const done = [];
    S.bills.forEach(b => (Array.isArray(b.paidDues) ? b.paidDues : []).forEach(pd => {
      if (pd && parseD(pd.due) != null && parseD(pd.due) >= sT && parseD(pd.due) <= eT) done.push({ kind: 'paid', b, d: pd.due, on: pd.on, amount: pd.amount });
    }));
    items.sort((x, y) => x.d < y.d ? -1 : x.d > y.d ? 1 : 0);
    const tot = items.reduce((t, x) => t + (x.kind === 'loan' ? x.cents / 100 : (Number(x.b.amount) || 0)), 0);
    const late = items.filter(x => x.late).length;
    const loanN = items.filter(x => x.kind === 'loan').length;
    const billN = items.length - loanN;
    const countLabel = (() => {
      if (!items.length) return 'Nothing due';
      const parts = [];
      if (billN) parts.push(plural(billN, 'bill'));
      if (loanN) parts.push(plural(loanN, 'loan repayment'));
      return parts.join(' · ');
    })();
    const prow = x => {
      const dl = daysLeft(x.d);
      if (x.kind === 'loan') {
        const name = 'Loan · ' + x.l.from;
        return `<div class="row bill payrow"><button class="tapzone" onclick="go('#loan/${x.l.id}')" aria-label="Open loan from ${esc(x.l.from)}"><div class="ic bill">${I('coins')}</div>
          <div class="tx"><div class="t">${esc(name)}</div><div class="s">Repayment plan · due ${fmtW(x.d)}</div></div></button>
          <div class="right badgestack">${pp.off <= 0 || dl <= 7 ? duePill(dl) : ''}${moneyBadge(x.cents / 100, name)}<button class="paybtn" onclick="payForm('${x.l.id}')">Record</button></div></div>`;
      }
      if (x.kind === 'paid') {
        return `<div class="row bill payrow paidrow"><button class="tapzone" onclick="billForm('${x.b.id}')" aria-label="Edit ${esc(x.b.name)}"><div class="ic bill">${I(billIcon(x.b.name))}</div>
          <div class="tx"><div class="t">${esc(x.b.name)}</div><div class="s"><span class="ok">✓ Paid</span> ${fmtW(x.on || x.d)} · was due ${fmtW(x.d)}</div></div></button>
          <div class="right badgestack"><span class="pill paid">Paid ✓</span>${moneyBadge(x.amount != null ? x.amount : x.b.amount, x.b.name)}</div></div>`;
      }
      const cur = x.d === x.b.due;
      return `<div class="row bill payrow"><button class="tapzone" onclick="billForm('${x.b.id}')" aria-label="Edit ${esc(x.b.name)}"><div class="ic bill">${I(billIcon(x.b.name))}</div>
        <div class="tx"><div class="t">${esc(x.b.name)}</div><div class="s">${x.late ? 'Overdue, was due ' : 'Due '}${fmtW(x.d)}</div></div></button>
        <div class="right badgestack">${pp.off <= 0 || dl <= 7 ? duePill(dl) : ''}${moneyBadge(x.b.amount, x.b.name)}${cur ? `<button class="paybtn" onclick="markPaid('${x.b.id}')">Mark paid</button>` : ''}</div></div>`;
    };
    pay = `<div class="summary" id="paysum">
      <div class="paynav"><button class="paystep" id="payprev" aria-label="Previous pay" ${pp.canBack ? '' : 'disabled'} onclick="payShift(-1)">${I('left')}</button>
        <div class="paytitle"><b>${payLabel(pp.off)}</b><span>${fmtW(pp.start)} to ${fmtW(pp.end)}</span></div>
        <button class="paystep" id="paynext" aria-label="Next pay" ${pp.canFwd ? '' : 'disabled'} onclick="payShift(1)">${I('right')}</button></div>
      <div class="muted">${pp.off < 0 ? 'Bills that were due' : 'To pay before the next payday'}</div><div class="amt" id="paytotal">${money(tot)}</div>
      <div class="muted">${countLabel}${late ? ` · <b style="color:var(--onbrand)">${late} overdue</b>` : ''} · next payday ${fmtW(pp.next)}</div>
      <div class="muted billsub">${reg.length ? `Your regular bills average ${money(avg)} a fortnight. ` : ''}${hasLoanPlans ? 'Loan repayment plans are included. ' : ''}<button class="linkbtn" id="paychange" onclick="paydayForm()">Change payday</button></div></div>
      <div class="sec">Due ${pp.off === 0 ? 'this pay' : pp.off === 1 ? 'next pay' : pp.off === -1 ? 'last pay' : fmtW(pp.start) + ' to ' + fmtW(pp.end)}</div>
      ${items.length ? `<div class="list" id="paylist">${items.map(prow).join('')}</div>` : `<div class="card muted" id="paylist">No bills due ${pp.off < 0 ? 'in that pay' : 'in this pay'}.</div>`}
      ${done.length ? `<div class="sec">Paid this pay</div><div class="list" id="paidlist">${done.sort((x, y) => x.d < y.d ? -1 : 1).map(prow).join('')}</div>` : ''}`;
  }
  const body = showPay
    ? `${pay}
      <div class="sec">All bills${over && !pp ? ` · ${over} overdue` : ''}</div>
      ${sorted.length ? `<div class="list">${sorted.map(row).join('')}</div>` : (hasLoanPlans && !S.bills.length ? '<div class="card muted">No other bills yet. Loan repayments are in the pay list above.</div>' : '<div class="card muted">All paid up. Good as gold!</div>')}
      ${paid.length ? `<div class="sec">Paid</div><div class="list">${paid.map(row).join('')}</div>` : ''}`
    : empty('No bills yet', 'Add your regular bills, like power, phone or insurance, and see what’s due each pay fortnight. A mortgage can go in as a repeating bill. Loan repayment plans also show here once you’ve set a payday.', 'Add a bill', 'billForm()');
  return header('Bills', 'Regular bills, loan plans, and due dates', addBtn('Add a bill', 'billForm()')) + body;
}
async function markPaid(id) {
  const b = S.bills.find(x => x.id === id), s = snap();
  // 2.22.67: remember which due date was paid so Budget keeps showing it as paid
  try {
    b.paidDues = (Array.isArray(b.paidDues) ? b.paidDues : []).filter(x => x && x.due !== b.due);
    b.paidDues.push({ due: b.due || todayISO(), on: todayISO(), amount: budgetAmt(b.amount) });
    b.paidDues = b.paidDues.slice(-30);
  } catch (e) {}
  b.lastPaid = todayISO();
  const n = nextDue(b);
  if (n) b.due = n; else { b.paid = true; b.paidOn = todayISO(); }
  await save(); render();
  toast(n ? `${b.name} paid. Next due ${fmt(n)}.` : `${b.name} marked paid.`, 'Undo', undoTo(s));
}
async function unpay(id) { const b = S.bills.find(x => x.id === id); b.paid = false; if (Array.isArray(b.paidDues)) b.paidDues = b.paidDues.filter(x => x && x.due !== b.due); delete b.paidOn; await save(); render(); }
function billForm(id) {
  const b = id ? S.bills.find(x => x.id === id) : { name: '', amount: '', due: '', repeat: 'monthly', notes: '' };
  openSheet(id ? 'Edit bill' : 'Add a bill',
    field('What’s the bill?', inp('name', b.name, 'placeholder="e.g. Power, phone, insurance" required maxlength="50"')) +
    `<div class="two">${field('Amount ($)', inp('amount', b.amount === '' ? '' : Number(b.amount).toFixed(2), 'inputmode="decimal" placeholder="0.00"'))}${field('Next due', inp('due', b.due, 'type="date" required'))}</div>` +
    field('Repeats', sel('repeat', Object.entries(REPEATS).map(([k, v]) => [k, k === 'none' ? 'Doesn’t repeat' : v]), b.repeat || 'none')) +
    field('Notes', area('notes', b.notes, 'e.g. account number, paid by direct debit')) +
    '',
    async v => {
      if (!v.name) return 'Please give the bill a name.';
      if (!parseD(v.due)) return 'Please choose when it’s next due.';
      const amt = v.amount === '' ? 0 : Number(String(v.amount).replace(/[$,\s]/g, ''));
      if (isNaN(amt) || amt < 0) return 'Please type the amount as a number, like 65.50.';
      const dueChanged = !id || v.due !== b.due;
      const upd = { name: v.name, amount: Math.round(amt * 100) / 100, due: v.due, repeat: v.repeat, notes: v.notes };
      if (dueChanged) upd.anchor = new Date(parseD(v.due)).getUTCDate();
      if (id) { if (dueChanged) upd.paid = false; Object.assign(b, upd); }
      else S.bills.push(Object.assign({ id: uid('bill'), paid: false }, upd));
      await save(); render(); toast(id ? 'Bill updated.' : 'Bill added.');
    }, id ? 'Save' : 'Add bill',
    id ? `<button type="button" class="btn danger" style="flex:0 0 auto" aria-label="Delete bill" onclick="deleteBill('${id}')">${I('trash')}</button>` : '');
}
function deleteBill(id) {
  const b = S.bills.find(x => x.id === id);
  confirmSheet(`Delete ${esc(b.name)}?`, 'This bill will be removed from this phone.', 'Delete bill', async () => {
    const s = snap(); S.bills = S.bills.filter(x => x.id !== id); await save(); render(); toast('Bill deleted.', 'Undo', undoTo(s));
  });
}


/* ================= LOANS ================= */
// Money borrowed, e.g. an interest-free loan from Mum. S.loans = [{ id, from, note, cents, startPaid, date, planCents, planFreq, payments: [{ id, date, cents, note, at }] }]
// All amounts are whole cents. Owed = borrowed − already paid back (before tracking) − payments, never below $0. No interest.
// A loan is paid off when nothing is owed; the paid-off date is the date of the latest payment.
const LOAN_FREQ = [['week', 'Weekly', 'a week', 'weekly'], ['fortnight', 'Fortnightly', 'a fortnight', 'fortnightly'], ['month', 'Monthly', 'a month', 'monthly']];
const MAX_CENTS = 100000000;
let loanDoneOpen = false;
function normLoans(list) {
  const c = v => Number.isFinite(+v) && +v > 0 ? Math.min(Math.round(+v), MAX_CENTS) : 0;
  return (Array.isArray(list) ? list : []).filter(l => l && typeof l === 'object' && l.id && c(l.cents) > 0).map(l => ({
    id: String(l.id), from: String(l.from || 'Loan').slice(0, 40), note: String(l.note || '').slice(0, 80), cents: c(l.cents),
    startPaid: Math.min(c(l.startPaid), c(l.cents)), date: parseD(l.date) != null ? l.date : todayISO(),
    planCents: c(l.planCents), planFreq: LOAN_FREQ.some(f => f[0] === l.planFreq) ? l.planFreq : 'fortnight',
    payments: (Array.isArray(l.payments) ? l.payments : []).filter(p => p && parseD(p.date) != null && c(p.cents) > 0)
      .map(p => ({ id: String(p.id || uid('lp')), date: p.date, cents: c(p.cents), note: String(p.note || '').slice(0, 80), at: +p.at || 0 }))
  }));
}
const getLoan = id => S.loans.find(l => l.id === id);
const loanPaysSorted = l => l.payments.map((p, i) => [p, i]).sort(([a, i], [b, j]) => b.date.localeCompare(a.date) || (b.at || 0) - (a.at || 0) || j - i).map(x => x[0]); // newest first; same day: the one entered last first
function loanCalc(l) {
  const paid = l.startPaid + l.payments.reduce((n, p) => n + p.cents, 0), owed = Math.max(0, l.cents - paid);
  const pct = owed === 0 ? 100 : Math.min(99, Math.floor(Math.min(paid, l.cents) / l.cents * 100));
  const last = l.payments.reduce((m, p) => p.date > m ? p.date : m, '');
  return { paid, owed, pct, done: owed === 0, doneDate: owed === 0 ? (last || l.date) : '', last };
}
const loanStep = (iso, f, k) => f === 'week' ? addDays(iso, 7 * k) : f === 'fortnight' ? addDays(iso, 14 * k) : addMonths(iso, k);
// Repayment plan: how many payments are left and roughly when the last one lands (the next one is one step after the latest
// payment, or today if that's already gone by)
function loanPlan(l) {
  const k = loanCalc(l); if (!l.planCents || k.done) return null;
  const n = Math.ceil(k.owed / l.planCents), lastAmt = k.owed - (n - 1) * l.planCents;
  let next = loanStep(k.last || l.date, l.planFreq, 1); if (next < todayISO()) next = todayISO();
  return { n, lastAmt, next, end: loanStep(next, l.planFreq, n - 1), per: LOAN_FREQ.find(f => f[0] === l.planFreq)[2] };
}
const loanPlanText = (l, p) => `At ${centsMoney(l.planCents)} ${p.per}, paid off around ${fmtW(p.end)}`;
// Planned repayments that land in [fromT, toT] (same maths as the loan plan card).
function loanPlanInRange(fromT, toT) {
  const out = [];
  (S.loans || []).forEach(l => {
    const p = loanPlan(l); if (!p) return;
    for (let i = 0; i < p.n; i++) {
      const d = loanStep(p.next, l.planFreq, i);
      const t = parseD(d);
      if (t == null || t < fromT || t > toT) continue;
      const cents = i === p.n - 1 ? p.lastAmt : l.planCents;
      out.push({ l, d, cents, amount: cents / 100 });
    }
  });
  return out;
}
const loanBar = (pct, label) => `<div class="lbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${esc(label)}"><i style="width:${pct}%"></i></div>`;
const loanActive = () => S.loans.filter(l => !loanCalc(l).done);
function loanCard(l) {
  const k = loanCalc(l), p = loanPlan(l);
  return `<div class="carcard loancard" role="button" tabindex="0" data-loan="${l.id}" onclick="go('#loan/${l.id}')">
    <div class="carhead"><div class="carpic loanpic">${I('coins')}</div>
      <div style="flex:1;min-width:0"><div class="carname">${esc(l.from)}</div><div class="carmodel">${[l.note ? esc(l.note) : '', 'Borrowed ' + fmt(l.date)].filter(Boolean).join(' · ')}</div></div>${I('right')}</div>
    <div class="lowed"><small>Still owed</small><b class="lamt">${centsMoney(k.owed)}</b></div>
    ${loanBar(k.pct, `${k.pct}% paid back`)}
    <div class="lstats"><span>Borrowed <b>${centsMoney(l.cents)}</b></span><span>Paid <b>${centsMoney(k.paid)}</b></span><span class="lpct">${k.pct}% paid</span></div>
    ${p ? `<div class="lplan">${I('repeat')} ${loanPlanText(l, p)}</div>` : ''}
    <div class="btns"><button class="btn primary lpaybtn" onclick="event.stopPropagation();payForm('${l.id}')">${I('plus')} Record payment</button></div></div>`;
}
function Loans() {
  const back = '';
  const act = loanActive(), done = S.loans.filter(l => loanCalc(l).done).sort((a, b) => loanCalc(b).doneDate.localeCompare(loanCalc(a).doneDate));
  const total = act.reduce((n, l) => n + loanCalc(l).owed, 0);
  const sub = act.length ? `${plural(act.length, 'loan')} being paid back` : S.loans.length ? 'All paid off' : 'Money you’ve borrowed';
  if (!S.loans.length) return back + header('Loans', sub, addBtn('Add a loan', 'loanForm()')) +
    empty('No loans yet', 'Keep track of money you’ve borrowed, like an interest-free loan from family. Add how much you borrowed, record each payment as you make it, and you’ll always know how much you still owe.', 'Add a loan', 'loanForm()') +
    `<div class="foot">${savedWhere()}</div>`;
  return back + header('Loans', sub, addBtn('Add a loan', 'loanForm()')) +
    (act.length > 1 ? `<div class="summary loansum"><div class="muted">Total owed</div><div class="amt" id="loantotal">${centsMoney(total)}</div><div class="muted">Across ${plural(act.length, 'loan')}</div></div>` : '') +
    (act.length ? `<div id="loanlist">${act.map(loanCard).join('')}</div>` : `<div class="card muted" style="margin-bottom:12px">${I('check')} Nothing owed. Every loan is paid off.</div>`) +
    (done.length ? `<details class="list pastf loansdone" id="loansdone" ${loanDoneOpen ? 'open' : ''} ontoggle="loanDoneOpen=this.open">
      <summary><span class="pr">Paid off<small>${plural(done.length, 'loan')}</small></span></summary>
      ${done.map(l => { const k = loanCalc(l); return `<button class="row" data-loan="${l.id}" onclick="go('#loan/${l.id}')"><div class="ic loan">${I('check')}</div>
        <div class="tx"><div class="t">${esc(l.from)}${l.note ? ` <span class="muted">· ${esc(l.note)}</span>` : ''}</div><div class="s">Paid off ${fmtW(k.doneDate)} · ${centsMoney(l.cents)} borrowed</div></div>${I('right')}</button>`; }).join('')}</details>` : '') +
    `<div class="btns" style="margin-top:12px"><button class="btn" onclick="loanForm()">${I('plus')} Add a loan</button></div>
    <div class="foot">Interest free: what you owe only goes down when you record a payment.<br>${savedWhere()}</div>`;
}
const centsIn = c => c ? (c / 100).toFixed(2) : '';
const moneyField = (label, name, cents, ph = '0.00', hint = '') => field(label, `<div class="moneyin"><span>$</span><input name="${name}" inputmode="decimal" placeholder="${ph}" autocomplete="off" value="${centsIn(cents)}" aria-label="${esc(label.replace(/<[^>]+>/g, ''))}"></div>`, hint);
function loanForm(id) {
  const l = id ? getLoan(id) : { from: '', note: '', cents: 0, startPaid: 0, date: todayISO(), planCents: 0, planFreq: 'fortnight', payments: [] };
  if (!l) return;
  const T = todayISO();
  openSheet(id ? 'Edit loan' : 'Add a loan',
    field('Who it’s from', inp('from', l.from, 'placeholder="e.g. Mum" required maxlength="40" autocapitalize="words"')) +
    field('Note (optional)', inp('note', l.note, 'maxlength="80" placeholder="e.g. Car deposit"')) +
    moneyField('Amount borrowed (NZD)', 'amount', l.cents) +
    field('Date borrowed', inp('date', l.date, `type="date" max="${T}" required`)) +
    moneyField('Already paid back (optional)', 'startpaid', l.startPaid, '0.00', 'Only if you’d paid some back before you started tracking it here.') +
    `<div class="subhead" style="margin-top:4px">Repayment plan (optional)</div>
    <div>${moneyField('Regular amount (NZD)', 'plan', l.planCents, 'e.g. 50')}</div><div class="field"><span>How often</span>${segHtml('freq', LOAN_FREQ.map(f => [f[0], f[1]]), l.planFreq)}</div>
    <p class="muted" style="margin:-4px 2px 6px;font-size:0.8125rem">Interest free, so there’s no interest to add. Leave the plan blank if there isn’t one.</p>`,
    async v => {
      if (!v.from) return 'Please say who the loan is from, e.g. Mum.';
      const cents = parseCents(v.amount);
      if (cents == null) return 'Please type the amount borrowed in dollars and cents, like 2000 or 1250.50.';
      if (cents === 0) return 'The amount borrowed can’t be $0.00.';
      if (cents > MAX_CENTS) return 'That amount looks too big. Please check it.';
      if (!parseD(v.date)) return 'Please choose the date you borrowed it.';
      if (v.date > todayISO()) return 'The date borrowed can’t be in the future.';
      const startPaid = v.startpaid ? parseCents(v.startpaid) : 0;
      if (startPaid == null) return 'Please type the amount already paid back in dollars and cents, or leave it blank.';
      if (startPaid > cents) return 'Already paid back can’t be more than the amount borrowed.';
      const pays = l.payments.reduce((n, p) => n + p.cents, 0);
      if (startPaid + pays > cents) return `The amount borrowed can’t be less than what’s been paid back so far (${centsMoney(startPaid + pays)}).`;
      const planCents = v.plan ? parseCents(v.plan) : 0;
      if (planCents == null || (v.plan && planCents === 0)) return 'Please type the regular amount in dollars and cents, like 50, or leave it blank.';
      if (v.date > (l.payments.reduce((m, p) => p.date < m ? p.date : m, '9999'))) return 'There’s a payment before that date. Please check the date borrowed.';
      const s = snap(), upd = { from: v.from.slice(0, 40), note: v.note.slice(0, 80), cents, startPaid, date: v.date, planCents, planFreq: v.freq };
      if (id) { Object.assign(l, upd); await save(); render(); toast('Loan updated.', 'Undo', undoTo(s)); return; }
      const nl = Object.assign({ id: uid('loan'), payments: [] }, upd); S.loans.push(nl); await save();
      toast(`Loan from ${nl.from} added. You owe ${centsMoney(loanCalc(nl).owed)}.`, 'Undo', undoTo(s));
      return () => go('#loan/' + nl.id);
    }, id ? 'Save' : 'Add loan',
    id ? `<button type="button" class="btn danger" style="flex:0 0 auto" aria-label="Delete loan" onclick="deleteLoan('${id}')">${I('trash')}</button>` : '');
  wireSeg('freq');
}
function deleteLoan(id) {
  const l = getLoan(id); if (!l) return;
  confirmSheet(`Delete the loan from ${esc(l.from)}?`, `The loan and ${plural(l.payments.length, 'payment')} will be removed from this phone.`, 'Delete loan', async () => {
    const s = snap(); S.loans = S.loans.filter(x => x.id !== id); await save();
    return () => { go('#loans'); toast(`Loan from ${l.from} deleted.`, 'Undo', undoTo(s)); };
  });
}
function loansMoreSub() {
  if (!S.loans.length) return 'Money you’ve borrowed, and what’s left to pay';
  const act = loanActive();
  if (!act.length) return 'All paid off';
  return `You owe <b>${centsMoney(act.reduce((n, l) => n + loanCalc(l).owed, 0))}</b>${act.length > 1 ? ' · ' + plural(act.length, 'loan') : ' to ' + esc(act[0].from)}`;
}

/* ================= BUDGET ================= */
// Fortnight budget: this fortnight's pay (varies), Bills and loan repayments due in that payday range, and extra spending.
// No made-up amounts: pay stays blank until typed; bills come from Bills already saved.
const BUDGET_MORTGAGE_DEFAULTS = []; // no built-in mortgages: add a mortgage as a bill or a loan with a plan
const budgetAmt = v => Number.isFinite(+v) && +v > 0 ? Math.min(Math.round(+v * 100) / 100, 1000000) : 0;
const budgetAmtOr0 = v => Number.isFinite(+v) && +v >= 0 ? Math.min(Math.round(+v * 100) / 100, 1000000) : 0;
function budgetMortgagesOf(b) {
  const raw = Array.isArray(b && b.mortgages) ? b.mortgages : [];
  // Labels stay Mortgage 1 / 2 / 3. Only the amount changes each fortnight.
  return BUDGET_MORTGAGE_DEFAULTS.map((label, n) => {
    const x = raw[n] && typeof raw[n] === 'object' ? raw[n] : {};
    return { id: String(x.id || ('bm' + (n + 1))), name: label, amount: budgetAmtOr0(x.amount) };
  });
}
function normBudgets(list) {
  // Do not call payPeriod here: normalise runs before S is set, and paydays() reads S.
  return (Array.isArray(list) ? list : []).filter(b => b && typeof b === 'object' && b.id).map(b => {
    // Older 2.22.4 budgets used amount as the pot. Treat that as this fortnight's pay.
    const pay = budgetAmt(b.pay != null ? b.pay : b.amount);
    const start = b.start && parseD(b.start) != null ? b.start : '';
    const end = b.end && parseD(b.end) != null ? b.end : '';
    const next = b.next && parseD(b.next) != null ? b.next : '';
    const range = start && end ? budgetRangeLabel(start, end) : '';
    return {
      id: String(b.id),
      name: range || String(b.name || 'This fortnight').slice(0, 40) || 'This fortnight',
      start, end, next,
      period: 'fortnight',
      pay,
      mortgages: budgetMortgagesOf(b),
      lines: (Array.isArray(b.lines) ? b.lines : []).filter(x => x && typeof x === 'object' && budgetAmt(x.amount) > 0)
        .map(x => ({ id: String(x.id || uid('bl')), name: String(x.name || 'Spending').slice(0, 60), amount: budgetAmt(x.amount) }))
    };
  }).filter(b => b.pay > 0 || b.mortgages.some(m => m.amount > 0) || b.lines.length);
}
const getBudget = id => (S.budgets || []).find(b => b.id === id);
// Bills due in this budget's payday fortnight, using the same dates and amounts as Bills.
// Mortgages stay on the budget (typed each fortnight), so bill names with "mortgage" are skipped here.
function budgetRangeLabel(start, end) {
  if (!start || !end || parseD(start) == null || parseD(end) == null) return '';
  return fmtW(start) + ' to ' + fmtW(end);
}
function budgetPeriodFor(b) {
  if (b && b.start && b.end && parseD(b.start) != null && parseD(b.end) != null) return { start: b.start, end: b.end, next: b.next || '' };
  return payPeriod(0);
}
function budgetBillRows(b) {
  const pp = budgetPeriodFor(b);
  if (!pp) return [];
  const sT = parseD(pp.start), eT = parseD(pp.end);
  if (sT == null || eT == null) return [];
  const items = [];
  (S.bills || []).filter(x => x && !x.paid && budgetAmt(x.amount) > 0 && true).forEach(bill => {
    billDates(bill, sT, eT).forEach(d => items.push({ id: bill.id, name: String(bill.name || 'Bill').slice(0, 60), amount: budgetAmt(bill.amount), due: d, late: 0 }));
  });
  // Same as Bills for the current pay: include overdue still unpaid when this is the current fortnight.
  const cur = payPeriod(0);
  if (cur && cur.start === pp.start) {
    (S.bills || []).filter(x => x && !x.paid && budgetAmt(x.amount) > 0 && true && parseD(x.due) != null && parseD(x.due) < sT)
      .forEach(bill => {
        if (items.some(it => it.id === bill.id && it.due === bill.due)) return;
        items.push({ id: bill.id, name: String(bill.name || 'Bill').slice(0, 60), amount: budgetAmt(bill.amount), due: bill.due, late: 1 });
      });
  }
  // 2.22.67: bills already paid for this fortnight stay on the budget, shown as paid
  (S.bills || []).filter(x => x && true).forEach(bill => {
    let hits = (Array.isArray(bill.paidDues) ? bill.paidDues : []).filter(p => p && parseD(p.due) != null && parseD(p.due) >= sT && parseD(p.due) <= eT);
    if (!hits.length && !Array.isArray(bill.paidDues) && bill.lastPaid && parseD(bill.lastPaid) != null && parseD(bill.lastPaid) >= sT && parseD(bill.lastPaid) <= eT)
      hits = [{ due: bill.lastPaid, on: bill.lastPaid, amount: budgetAmt(bill.amount) }];
    hits.forEach(p => {
      const amt = budgetAmt(p.amount != null ? p.amount : bill.amount);
      if (!(amt > 0)) return;
      const i = items.findIndex(it => it.id === bill.id && it.due === p.due);
      if (i >= 0) items.splice(i, 1);
      items.push({ id: bill.id, name: String(bill.name || 'Bill').slice(0, 60), amount: amt, due: p.due, late: 0, paid: 1, paidOn: p.on || p.due });
    });
  });
  loanPlanInRange(sT, eT).forEach(x => {
    items.push({ id: 'loan-' + x.l.id + '-' + x.d, name: 'Loan · ' + x.l.from, amount: x.amount, due: x.d, late: 0, loanId: x.l.id });
  });
  items.sort((a, b) => a.due < b.due ? -1 : a.due > b.due ? 1 : a.name.localeCompare(b.name));
  return items;
}
function budgetCalc(b) {
  const mortgages = budgetMortgagesOf(b);
  const mort = Math.round(mortgages.reduce((n, x) => n + x.amount, 0) * 100) / 100;
  const bills = budgetBillRows(b);
  const billTot = Math.round(bills.reduce((n, x) => n + x.amount, 0) * 100) / 100;
  const spend = Math.round((b.lines || []).reduce((n, x) => n + x.amount, 0) * 100) / 100;
  const out = Math.round((mort + billTot + spend) * 100) / 100;
  const pay = budgetAmtOr0(b.pay);
  return { pay, mort, billTot, spend, out, left: Math.round((pay - out) * 100) / 100, mortgages, bills };
}
function budgetCard(b) {
  const k = budgetCalc(b);
  const billRows = k.bills.length
    ? k.bills.map(x => `<div class="row"><button class="tapzone" onclick="${x.loanId ? `go('#loan/${x.loanId}')` : `go('#bills')`}"><div class="ic bill">${I(x.loanId ? 'coins' : billIcon(x.name))}</div><div class="tx"><div class="t">${esc(x.name)}</div><div class="s">${x.paid ? '<span class="ok">✓ Paid</span> ' + fmtW(x.paidOn || x.due) : (x.late ? 'Overdue, was due ' : 'Due ') + fmtW(x.due)}</div></div></button><b>${money(x.amount)}</b></div>`).join('')
    : `<div class="card muted" style="margin:0">${payPeriod(0) ? 'No bills due in this fortnight.' : 'Set your payday in Bills so this fortnight’s bills can show here.'}</div>`;
  const lines = (b.lines || []).map(x => `<div class="row" data-bline="${esc(x.id)}"><div class="tx"><div class="t">${esc(x.name)}</div></div><b>${money(x.amount)}</b>
      <button type="button" class="iconbtn" aria-label="Delete ${esc(x.name)}" onclick="budgetLineDelete(${jsArg(b.id)},${jsArg(x.id)})">${I('trash')}</button></div>`).join('');
  return `<div class="carcard loancard budgetcard" data-budget="${esc(b.id)}">
    <div class="carhead"><div class="carpic loanpic">${I('cash')}</div>
      <div style="flex:1;min-width:0"><div class="carname">${esc(b.name)}</div><div class="carmodel">Pay fortnight</div></div>
      <button type="button" class="iconbtn" aria-label="Edit ${esc(b.name)}" onclick="budgetForm(${jsArg(b.id)})">${I('pen')}</button></div>
    <div class="lowed"><small>${k.left < 0 ? 'Over budget' : 'Left after bills'}</small><b class="lamt">${k.left < 0 ? 'Over by ' + money(-k.left) : money(k.left)}</b></div>
    <div class="lstats"><span>Pay <b>${k.pay ? money(k.pay) : '—'}</b></span><span>Bills <b>${k.billTot ? money(k.billTot) : '—'}</b></span><span>Other <b>${k.spend ? money(k.spend) : '—'}</b></span></div>
    <div class="sec" style="margin-top:12px">This fortnight's pay</div>
    <div class="list"><div class="row"><div class="ic comm">${I('cash')}</div><div class="tx"><div class="t">Wages</div><div class="s">Changes each pay · tap edit to update</div></div><b>${k.pay ? money(k.pay) : '—'}</b></div></div>
    <div class="sec">Bills this fortnight <a href="#bills" style="font-weight:650">Open Bills</a></div>
    <div class="list">${billRows}</div>
    <div class="sec">Other spending</div>
    ${lines ? `<div class="list">${lines}</div>` : `<p class="muted" style="margin:0 2px 8px">Nothing else added yet.</p>`}
    <form class="addbar" style="margin-top:4px" onsubmit="budgetLineAdd(event,${jsArg(b.id)})">
      <input name="bname" placeholder="What you spent on" autocomplete="off" maxlength="60" aria-label="Spending name">
      <input name="bamt" inputmode="decimal" placeholder="$0.00" autocomplete="off" style="max-width:110px" aria-label="Spending amount">
      <button aria-label="Add spending">${I('plus')}</button></form></div>`;
}
function Budget() {
  const list = [...(S.budgets || [])].sort((a, b) => (parseD(b.start) || 0) - (parseD(a.start) || 0));
  const sub = list.length ? 'One budget for each pay fortnight' : 'What’s left after pay day';
  const needPay = !payPeriod(0);
  if (!list.length) return header('Budget', sub, addBtn('Add a budget', 'budgetForm()')) +
    (needPay ? `<div class="callout green">${I('cal')}<div style="flex:1"><b>Set your payday first</b><br>Budget uses the same fortnight as Bills.<div style="margin-top:10px"><button class="btn small primary" onclick="paydayForm()">Set payday</button></div></div></div>` : '') +
    empty('No budget yet', 'Add this fortnight’s pay. Bills and loan repayments due in that date range show at their real amounts.', 'Add', 'budgetForm()') +
    `<div class="foot">${savedWhere()}</div>`;
  return header('Budget', sub, addBtn('Add a budget', 'budgetForm()')) +
    `<div id="budgetlist">${list.map(budgetCard).join('')}</div>
    <div class="btns" style="margin-top:12px"><button class="btn" onclick="budgetForm()">${I('plus')} Add a budget</button></div>
    <div class="foot">${savedWhere()}</div>`;
}
function budgetForm(id) {
  const cur = payPeriod(0);
  const b = id ? getBudget(id) : { name: '', pay: 0, mortgages: [], lines: [], start: cur && cur.start, end: cur && cur.end, next: cur && cur.next };
  if (!b) return;
  if (!id && !cur) { toast('Set your payday in Bills first.'); paydayForm(); return; }
  const morts = budgetMortgagesOf(b);
  const range = budgetRangeLabel(b.start, b.end) || (cur ? budgetRangeLabel(cur.start, cur.end) : '');
  // Pick which fortnight this budget is for (same payday list as Bills).
  const ds = paydays();
  let periodField = `<p class="muted" style="margin:0 0 12px">This budget is for <b>${esc(range || 'this fortnight')}</b>. Bills and loan repayments due in that range use the amounts already saved.</p>`;
  if (!id && ds && ds.length >= 2) {
    const opts = [];
    for (let i = 0; i < ds.length - 1; i++) {
      const start = ds[i], end = addDays(ds[i + 1], -1), label = budgetRangeLabel(start, end);
      opts.push([start + '|' + end + '|' + ds[i + 1], label]);
    }
    const curKey = (cur.start + '|' + cur.end + '|' + (cur.next || ''));
    periodField = field('Fortnight', sel('range', opts, curKey), 'Named the same as the Bills pay range.') + periodField;
  }
  openSheet(id ? 'Edit budget' : 'Add a budget',
    periodField +
    moneyField('This fortnight’s pay', 'pay', Math.round((b.pay || 0) * 100), '0.00', 'Wages change each pay, so type this fortnight’s amount.') +
    morts.map((m, n) => moneyField(m.name, 'mamt' + n, Math.round((m.amount || 0) * 100), '0.00', n === 0 ? 'Type each mortgage for this fortnight. Leave blank if you don’t know it yet.' : '')).join(''),
    async v => {
      const cents = parseCents(v.pay);
      if (cents == null || !String(v.pay || '').trim()) return 'Please type this fortnight’s pay, like 1800 or 1750.50.';
      if (cents <= 0) return 'Pay has to be more than $0.00.';
      if (cents > MAX_CENTS) return 'That amount looks too big. Please check it.';
      const mortgages = BUDGET_MORTGAGE_DEFAULTS.map((label, n) => {
        const mc = parseCents(v['mamt' + n]);
        const amount = mc == null || !String(v['mamt' + n] || '').trim() ? 0 : Math.min(Math.max(mc, 0), MAX_CENTS) / 100;
        return { id: morts[n].id, name: label, amount };
      });
      let start = b.start, end = b.end, next = b.next || '';
      if (!id && v.range) {
        const parts = String(v.range).split('|');
        if (parts.length >= 2 && parseD(parts[0]) != null && parseD(parts[1]) != null) {
          start = parts[0]; end = parts[1]; next = parts[2] || '';
        }
      }
      if (!start || !end) {
        const pp = payPeriod(0);
        if (!pp) return 'Set your payday in Bills first.';
        start = pp.start; end = pp.end; next = pp.next || '';
      }
      const name = budgetRangeLabel(start, end) || 'This fortnight';
      if (!id && (S.budgets || []).some(x => x.start === start)) return 'There’s already a budget for ' + name + '. Open that one to edit it.';
      const s = snap(), upd = {
        name, start, end, next,
        pay: cents / 100,
        period: 'fortnight',
        mortgages
      };
      if (id) { Object.assign(b, upd); delete b.amount; await save(); render(); toast('Budget updated.', 'Undo', undoTo(s)); return; }
      if (!Array.isArray(S.budgets)) S.budgets = [];
      S.budgets.push(Object.assign({ id: uid('budget'), lines: [] }, upd)); await save(); render();
      toast('Budget added.', 'Undo', undoTo(s));
    }, id ? 'Save' : 'Add',
    id ? `<button type="button" class="btn danger" style="flex:0 0 auto" aria-label="Delete budget" onclick="deleteBudget(${jsArg(id)})">${I('trash')}</button>` : '');
}
function deleteBudget(id) {
  const b = getBudget(id); if (!b) return;
  confirmSheet(`Delete the ${esc(b.name)} budget?`, `The budget and ${plural((b.lines || []).length, 'spending line')} will be removed from this phone.`, 'Delete budget', async () => {
    const s = snap(); S.budgets = S.budgets.filter(x => x.id !== id); await save();
    return () => { render(); toast('Budget deleted.', 'Undo', undoTo(s)); };
  });
}
async function budgetLineAdd(e, id) {
  e.preventDefault();
  const b = getBudget(id); if (!b) return;
  const f = e.target, name = (f.bname.value || '').trim(), cents = parseCents((f.bamt.value || '').trim());
  if (!name) { toast('Please type what you spent it on.'); f.bname.focus(); return; }
  if (cents == null || cents <= 0) { toast('Please type the amount, like 25 or 12.50.'); f.bamt.focus(); return; }
  if (!Array.isArray(b.lines)) b.lines = [];
  b.lines.push({ id: uid('bl'), name: name.slice(0, 60), amount: Math.min(cents, MAX_CENTS) / 100 });
  await save(); render();
}
async function budgetLineDelete(id, lineId) {
  const b = getBudget(id); if (!b) return;
  const x = (b.lines || []).find(l => l.id === lineId); if (!x) return;
  const s = snap(); b.lines = b.lines.filter(l => l.id !== lineId); await save(); render();
  toast(`${x.name} removed.`, 'Undo', undoTo(s));
}
function budgetMoreSub() {
  const list = [...(S.budgets || [])].sort((a, b) => (parseD(b.start) || 0) - (parseD(a.start) || 0));
  if (!list.length) return 'One budget for each pay fortnight';
  const b = list[0], k = budgetCalc(b);
  if (!k.pay) return esc(b.name || 'This fortnight');
  return `${esc(b.name)}: ${k.left < 0 ? 'Over by <b>' + money(-k.left) + '</b>' : '<b>' + money(k.left) + '</b> left'}`;
}

function LoanDetail(id) {
  const l = getLoan(id);
  if (!l) return `<button class="back" onclick="go('#loans')">${I('left')} Loans</button>` + empty('That loan isn’t here any more', 'It may have been deleted.', '', '');
  const k = loanCalc(l), p = loanPlan(l), pays = loanPaysSorted(l);
  const planCard = k.done ? '' : p
    ? `<div class="dcard" id="loanplan"><div class="h">${I('repeat')} Repayment plan</div>
        <div class="big" style="font-size:1.125rem">${loanPlanText(l, p)}</div>
        <div class="muted">${plural(p.n, 'payment')} left${p.n > 1 && p.lastAmt !== l.planCents ? `, the last one ${centsMoney(p.lastAmt)}` : ''}. Next one around ${fmtW(p.next)}.</div>
        <div class="btns"><button class="btn small" onclick="planForm('${l.id}')">${I('edit')} Change plan</button></div></div>`
    : `<div class="dcard" id="loanplan"><div class="h">${I('repeat')} Repayment plan <span class="pill none">Not set</span></div>
        <div class="muted" style="margin-top:6px">Paying back a set amount regularly? Add it to see roughly when the loan will be paid off.</div>
        <div class="btns"><button class="btn" onclick="planForm('${l.id}')">${I('plus')} Set a plan</button></div></div>`;
  return `<div style="display:flex;justify-content:space-between;align-items:center"><button class="back" onclick="go('#loans')">${I('left')} Loans</button>
    <button class="btn small" onclick="loanForm('${l.id}')">${I('edit')} Edit</button></div>
  <div class="hero"><div class="carpic loanpic">${I('coins')}</div><div style="min-width:0"><h2>${esc(l.from)}</h2><div class="muted">${[l.note ? esc(l.note) : '', 'Borrowed ' + fmtY(l.date), 'Interest free'].filter(Boolean).join(' · ')}</div></div></div>
  <div class="summary loandet" id="loansummary">${k.done
      ? `<div class="muted">${I('check')} Paid off</div><div class="amt">${centsMoney(0)}</div><div class="muted" id="paidoffon">Paid off ${fmtLong(k.doneDate)}</div>`
      : `<div class="muted">Still owed</div><div class="amt" id="loanowed">${centsMoney(k.owed)}</div><div class="muted">of ${centsMoney(l.cents)} borrowed</div>`}
    ${loanBar(k.pct, `${k.pct}% paid back`)}
    <div class="lsumrow"><span>Paid <b id="loanpaid">${centsMoney(k.paid)}</b></span><span><b>${k.pct}%</b> paid</span></div></div>
  ${k.done ? `<div class="callout green">${I('check')}<div><b>All paid back.</b> Nice work. It’s been moved to Paid off on the Loans list.</div></div>`
      : `<div class="btns" style="margin:0 0 12px"><button class="btn primary xl" id="recordpay" onclick="payForm('${l.id}')">${I('plus')} Record payment</button></div>`}
  ${planCard}
  <div class="sec">Payments ${pays.length ? `<span class="wk">${plural(pays.length, 'payment')}</span>` : ''}</div>
  ${pays.length || l.startPaid ? `<div class="list" id="loanpays">${pays.map(x => `<button class="row lpay" data-pay="${x.id}" onclick="payForm('${l.id}','${x.id}')" aria-label="Edit payment of ${esc(centsMoney(x.cents))} on ${fmtW(x.date)}">
      <div class="tx"><div class="t">${fmtW(x.date)}</div>${x.note ? `<div class="s">${esc(x.note)}</div>` : ''}</div><b class="lpa">${centsMoney(x.cents)}</b></button>`).join('')}
      ${l.startPaid ? `<button class="row lpay start" onclick="loanForm('${l.id}')"><div class="tx"><div class="t">Paid back before tracking</div><div class="s">Set when the loan was added. Tap to change.</div></div><b class="lpa">${centsMoney(l.startPaid)}</b></button>` : ''}</div>`
    : `<div class="card muted" style="font-size:0.875rem">No payments yet. Tap “Record payment” each time you pay some back.</div>`}
  <div class="btns" style="margin-top:16px"><button class="btn danger" onclick="deleteLoan('${l.id}')">${I('trash')} Delete loan</button></div>
  <div class="foot">${savedWhere()}</div>`;
}
function payForm(loanId, pid) {
  const l = getLoan(loanId); if (!l) return;
  const x = pid ? l.payments.find(p => p.id === pid) : { date: todayISO(), cents: 0, note: '' };
  if (!x) return;
  const k = loanCalc(l), room = k.owed + (pid ? x.cents : 0), T = todayISO();
  const quick = pid ? '' : [l.planCents && l.planCents < room ? [l.planCents, `${centsMoney(l.planCents)} (plan)`] : null, [room, `All of it (${centsMoney(room)})`]].filter(Boolean);
  openSheet(pid ? 'Edit payment' : 'Record payment',
    `<p class="muted" style="margin:-4px 2px 12px">To ${esc(l.from)} · ${centsMoney(k.owed)} still owed</p>` +
    moneyField('Amount paid (NZD)', 'amount', x.cents) +
    (quick ? `<div class="chips lquick">${quick.map(([c, t]) => `<button type="button" class="chip" data-cents="${c}">${t}</button>`).join('')}</div>` : '') +
    field('Date paid', inp('date', x.date, `type="date" min="${l.date}" max="${T}" required`)) +
    field('Note (optional)', inp('note', x.note, 'maxlength="80" placeholder="e.g. Bank transfer"')),
    async v => {
      const c = parseCents(v.amount);
      if (c == null) return 'Please type the amount in dollars and cents, like 200 or 85.50.';
      if (c === 0) return 'The amount can’t be $0.00.';
      if (c > room) return `That’s more than the ${centsMoney(room)} still owed. Please check the amount.`;
      if (!parseD(v.date)) return 'Please choose the date you paid it.';
      if (v.date > todayISO()) return 'The date paid can’t be in the future.';
      if (v.date < l.date) return `That’s before the loan was borrowed (${fmtY(l.date)}). Please check the date.`;
      const s = snap(), upd = { date: v.date, cents: c, note: v.note.slice(0, 80) };
      if (pid) Object.assign(x, upd); else l.payments.push(Object.assign({ id: uid('lp'), at: Date.now() }, upd));
      await save(); render();
      const nk = loanCalc(l);
      toast(nk.done ? `That’s the loan from ${l.from} paid off. Well done!` : pid ? `Payment updated. You owe ${centsMoney(nk.owed)}.` : `Payment of ${centsMoney(c)} recorded. You owe ${centsMoney(nk.owed)}.`, 'Undo', undoTo(s));
    }, pid ? 'Save' : 'Save payment',
    pid ? `<button type="button" class="btn danger" style="flex:0 0 auto" aria-label="Delete this payment" onclick="deletePayment('${loanId}','${pid}')">${I('trash')}</button>` : '');
  document.querySelectorAll('#sf .lquick .chip').forEach(b => b.onclick = () => { $('#sf input[name=amount]').value = (+b.dataset.cents / 100).toFixed(2); });
}
async function deletePayment(loanId, pid) {
  const l = getLoan(loanId), x = l && l.payments.find(p => p.id === pid); if (!x) return;
  const s = snap(); l.payments = l.payments.filter(p => p.id !== pid);
  await save(); await closeSheet(); render();
  toast(`Deleted the payment of ${centsMoney(x.cents)}. You owe ${centsMoney(loanCalc(l).owed)}.`, 'Undo', undoTo(s));
}
function planForm(loanId) {
  const l = getLoan(loanId); if (!l) return;
  openSheet('Repayment plan',
    `<p class="muted" style="margin:-4px 2px 12px">How much you plan to pay back, and how often. Those amounts show in Bills for each payday fortnight.</p>` +
    moneyField('Regular amount (NZD)', 'plan', l.planCents, 'e.g. 50') +
    `<div class="field"><span>How often</span>${segHtml('freq', LOAN_FREQ.map(f => [f[0], f[1]]), l.planFreq)}</div>
    <p class="muted" id="planhint" style="margin:0 2px 4px;font-size:0.875rem;min-height:20px"></p>`,
    async v => {
      const c = parseCents(v.plan);
      if (c == null || c === 0) return 'Please type the regular amount in dollars and cents, like 50.';
      const s = snap(); l.planCents = c; l.planFreq = v.freq; await save(); render();
      toast('Repayment plan saved.', 'Undo', undoTo(s));
    }, 'Save plan',
    l.planCents ? `<button type="button" class="btn danger" style="flex:0 0 auto" onclick="removePlan('${loanId}')">Remove</button>` : '');
  const hint = () => {
    const c = parseCents($('#sf input[name=plan]').value), f = $('#sf input[name=freq]').value;
    const p = c ? loanPlan(Object.assign({}, l, { planCents: c, planFreq: f })) : null;
    $('#planhint').textContent = p ? `${loanPlanText({ planCents: c }, p)} (${plural(p.n, 'payment')} left).` : '';
  };
  wireSeg('freq'); document.querySelectorAll('#sf [data-seg=freq] button').forEach(b => b.addEventListener('click', hint)); $('#sf input[name=plan]').addEventListener('input', hint); hint();
}
async function removePlan(loanId) {
  const l = getLoan(loanId), s = snap(); l.planCents = 0; await save(); await closeSheet(); render(); toast('Repayment plan removed.', 'Undo', undoTo(s));
}



/* ================= INSTALL AS AN APP ================= */
// Install help is always shown until the app is opened from the home screen.
// Android Chrome/Edge: real Install button when the browser offers it, otherwise menu steps.
// In-app browsers (Messenger, Facebook, Instagram, WhatsApp, Gmail etc.) can't install apps, so offer Open in Chrome + Copy link.
let installEvt = null, justInstalled = false;
const UA = navigator.userAgent || '';
const isStandalone = () => (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: minimal-ui)').matches)) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = () => /android/i.test(UA);
function browserKind() {
  if (/FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|MessengerLite|WhatsApp|Snapchat|TikTok|musical_ly|BytedanceWebview|Line\/|Twitter|LinkedInApp|Pinterest|GSA\/|KAKAOTALK|Viber/i.test(UA)) return 'inapp';
  if (isAndroid() && /; wv\)|\bwv\b|Version\/[\d.]+ Chrome\/[\d.]+ Mobile/i.test(UA)) return 'inapp';
  if (isIOS()) return /CriOS|FxiOS|EdgiOS/i.test(UA) ? 'iosother' : 'ios';
  if (/SamsungBrowser/i.test(UA)) return 'samsung';
  if (/Firefox|FxiOS/i.test(UA)) return 'firefox';
  if (/EdgA|Edg\//i.test(UA)) return 'edge';
  if (/OPR\/|Opera/i.test(UA)) return 'opera';
  if (/Chrome\//i.test(UA)) return 'chrome';
  return 'other';
}
const appUrl = () => location.origin + location.pathname;
const chromeIntent = () => 'intent://' + location.host + location.pathname + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(appUrl()) + ';end';
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; render(); });
window.addEventListener('appinstalled', () => { installEvt = null; justInstalled = true; render(); toast('Monique’s Helper is on your home screen. Open it from there.'); });
function installSteps(k) {
  const menu = '<b>⋮</b>';
  switch (k) {
    case 'chrome': return `Tap the ${menu} menu (top right), then <b>Install app</b> or <b>Add to Home screen</b>, then <b>Install</b>.`;
    case 'samsung': return `Tap the <b>≡</b> menu (bottom right), then <b>Add page to</b> › <b>Home screen</b>. (Or open this link in Chrome and tap Install app.)`;
    case 'firefox': return `Tap the ${menu} menu, then <b>Install</b> or <b>Add to Home screen</b>.`;
    case 'edge': return `Tap the <b>…</b> menu (bottom), then <b>Add to phone</b> or <b>Install app</b>.`;
    case 'opera': return `Tap the ${menu} menu, then <b>Add to</b> › <b>Home screen</b>.`;
    case 'ios': return `Tap the Share button ${I('share')} at the bottom, then <b>Add to Home Screen</b>, then <b>Add</b>.`;
    case 'iosother': return `Tap the Share button ${I('share')}, then <b>Add to Home Screen</b>. If you can’t see it, open this link in Safari.`;
    default: return isAndroid() ? `Open this link in <b>Chrome</b>, then tap the ${menu} menu › <b>Install app</b>.` : `Open this link on your phone in Chrome (Android) or Safari (iPhone), then add it to your home screen.`;
  }
}
function installCard() {
  if (isStandalone()) return '';
  if (justInstalled) return `<div class="card installcard" id="installcard"><div><b>Installed ✓</b><div class="muted">Open Monique’s Helper from your home screen.</div></div></div>`;
  const k = browserKind();
  if (k === 'inapp') {
    return `<div class="card installcard inapp" id="installcard"><div><b>To install, open this in Chrome</b>
      <div class="muted">This page is open inside another app (like Messenger, Facebook or Gmail), which can’t install apps.${isIOS() ? ' Tap the ⋯ menu and choose <b>Open in Safari</b>, then Share › Add to Home Screen.' : ''}</div>
      <div class="btns" style="margin-top:10px">${isAndroid() ? `<a class="btn primary" id="openchrome" href="${esc(chromeIntent())}">Open in Chrome</a>` : ''}
      <button class="btn" id="copylink" onclick="copyAppLink()">Copy link</button></div>
      <div class="muted" style="margin-top:6px;font-size:0.8125rem">Or tap the app’s ⋮ menu and choose <b>Open in browser</b> / <b>Open in Chrome</b>.</div></div></div>`;
  }
  if (installEvt) return `<div class="card installcard" id="installcard"><div><b>Install Monique’s Helper</b><div class="muted">Put it on your home screen so it opens like a normal app, even offline.</div></div><button class="btn primary" id="installbtn" style="flex:none" onclick="installApp()">${I('download')} Install app</button></div>`;
  return `<div class="card installcard" id="installcard"><div><b>Install Monique’s Helper</b><div class="muted" id="installsteps">${installSteps(k)}</div>
    <div class="muted" style="margin-top:6px;font-size:0.8125rem">Already installed? Open it from your home screen.</div></div></div>`;
}
async function copyAppLink() {
  const u = appUrl();
  let ok = false;
  try { await navigator.clipboard.writeText(u); ok = true; } catch (e) { }
  if (!ok) { try { const t = document.createElement('textarea'); t.value = u; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); t.remove(); } catch (e) { } }
  toast(ok ? 'Link copied. Open Chrome and paste it in the address bar.' : 'Copy this link: ' + u);
}
async function installApp() {
  if (!installEvt) { toast('Use the browser menu, then Install app.'); return; }
  const e = installEvt; installEvt = null;
  try { e.prompt(); const c = await e.userChoice; if (c && c.outcome === 'accepted') justInstalled = true; } catch (x) { }
  render();
}

/* ================= THEMES (1.2.0) =================
   Her colour choice, saved on this phone only (and in the backup file). The page <head> applies it before drawing. */
const THEMES = [['purple', 'Purple', '#6D3FC4'], ['pink', 'Pink', '#C2185B'], ['ocean', 'Ocean blue', '#1565C0'], ['teal', 'Sea green', '#0F766E'],
  ['coral', 'Sunset coral', '#C2410C'], ['forest', 'Forest green', '#2E7D32'], ['lavender', 'Lavender', '#8A4FA8'], ['dark', 'Dark', '#121019']];
const THEME_KEY = 'moniquesHelper.theme';
const themeOk = t => THEMES.some(x => x[0] === t);
function curTheme() { try { const t = localStorage.getItem(THEME_KEY); return themeOk(t) ? t : 'purple'; } catch (e) { return 'purple'; } }
function applyTheme(t) {
  if (!themeOk(t)) t = 'purple';
  document.documentElement.setAttribute('data-theme', t);
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', THEMES.find(x => x[0] === t)[2]);
}
function themeGrid() {
  const c = curTheme();
  return `<div class="themegrid">${THEMES.map(([k, n, col]) => `<button type="button" class="tswatch ${k === c ? 'on' : ''}" data-theme-pick="${k}" aria-pressed="${k === c}" onclick="setTheme('${k}')"><i style="background:${k === 'dark' ? 'linear-gradient(135deg,#121019 50%,#B79CFF 50%)' : col}"></i>${esc(n)}</button>`).join('')}</div>`;
}
function setTheme(t) {
  if (!themeOk(t)) return;
  try { localStorage.setItem(THEME_KEY, t); } catch (e) { }
  applyTheme(t);
  document.querySelectorAll('.tswatch').forEach(b => { const on = b.dataset.themePick === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
}
function themeSheet() { openSheet('Choose a theme', themeGrid() + '<p class="muted" style="margin:14px 2px 0">Tap a colour to try it. It’s saved on this phone.</p>', null); }
const themeCard = () => `<div class="sec">Theme</div><div class="card" id="themecard">${themeGrid()}</div>`;

/* ================= BACKUP ================= */
function Backup() {
  const n = S.bills.length + S.loans.length + S.budgets.length + S.appts.length;
  return header('Backup', 'Your information, and how the app looks') + installCard() + themeCard() + remindersCard() +
    `<div class="card"><p style="margin:0 0 10px">Everything you add is saved on this phone only. Save a backup file now and then, so you can get it back on a new phone.</p>
      <div class="btns"><button class="btn primary" id="exportbtn" onclick="exportData()">${I('download')} Save a backup file</button>
      <button class="btn" onclick="$('#importfile').click()">${I('share')} Restore from a file</button></div>
      <input type="file" id="importfile" accept="application/json,.json" hidden onchange="importData(this)"></div>
    <div class="foot">${plural(S.bills.length, 'bill')}, ${plural(S.loans.length, 'loan')}, ${plural(S.budgets.length, 'budget')} and ${plural(S.appts.length, 'appointment')} on this phone.${n ? '' : ' Nothing added yet.'}<br>Monique’s Helper ${APP_VERSION}</div>`;
}
function exportData() {
  const blob = new Blob([JSON.stringify({ app: 'moniques-helper', exportedAt: new Date().toISOString(), theme: curTheme(), data: S }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'moniques-helper-backup-' + todayISO() + '.json';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('Backup file saved to your downloads.');
}
function importData(inp) {
  const f = inp.files && inp.files[0]; inp.value = '';
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    let o; try { o = JSON.parse(r.result); } catch (e) { toast('That file isn’t a Monique’s Helper backup.'); return; }
    const d = o && o.app === 'moniques-helper' && o.data ? o.data : null;
    if (!d) { toast('That file isn’t a Monique’s Helper backup.'); return; }
    confirmSheet('Restore this backup?', 'What’s on this phone now will be replaced with the backup from ' + esc(String(o.exportedAt || '').slice(0, 10)) + '.', 'Restore', async () => {
      const s = snap(); S = normalise(d); if (themeOk(o.theme)) setTheme(o.theme); await save(); render(); toast('Backup restored.', 'Undo', undoTo(s));
    });
  };
  r.readAsText(f);
}

/* ================= CALENDAR & APPOINTMENTS (1.1.0) =================
   Appointments live on this phone only, with the rest of her information. "Add to phone calendar" makes a
   small .ics file on the phone; nothing is sent anywhere. Reminders are shown inside the app. */
const APPT_REPEATS = [['none', 'Doesn’t repeat'], ['weekly', 'Weekly'], ['fortnightly', 'Fortnightly'], ['monthly', 'Monthly'], ['yearly', 'Yearly']];
const APPT_REMIND = [['', 'No reminder'], ['0', 'At the time'], ['15', '15 minutes before'], ['30', '30 minutes before'], ['60', '1 hour before'], ['120', '2 hours before'], ['1440', '1 day before'], ['2880', '2 days before'], ['10080', '1 week before']];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const timeOk = t => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ''));
function normAppts(list) {
  return (Array.isArray(list) ? list : []).filter(a => a && typeof a === 'object' && a.id && parseD(a.date)).map(a => ({
    id: String(a.id), title: String(a.title || 'Appointment').slice(0, 80), date: a.date, start: timeOk(a.start) ? a.start : '', end: timeOk(a.end) ? a.end : '',
    location: String(a.location || '').slice(0, 120), notes: String(a.notes || '').slice(0, 1000),
    repeat: APPT_REPEATS.some(r => r[0] === a.repeat) ? a.repeat : 'none', remind: APPT_REMIND.some(r => r[0] === String(a.remind == null ? '' : a.remind)) ? String(a.remind == null ? '' : a.remind) : '',
    skips: Array.isArray(a.skips) ? a.skips.filter(d => parseD(d)) : []
  }));
}
const getAppt = id => S.appts.find(a => a.id === id);
const seriesOf = a => ({ start: a.date, repeat: a.repeat, skips: a.skips });
// Every appointment (repeats expanded) between two ISO dates, inclusive, sorted by date and time
function apptsIn(fromIso, toIso) {
  const out = [];
  S.appts.forEach(a => MH.repeatDates(seriesOf(a), parseD(fromIso), parseD(toIso)).forEach(o => out.push({ a, date: o.date })));
  return out.sort((x, y) => x.date.localeCompare(y.date) || (x.a.start || '').localeCompare(y.a.start || '') || x.a.title.localeCompare(y.a.title));
}
function nextOcc(a, fromIso) { // the first date of this appointment on or after fromIso
  const r = MH.repeatDates(seriesOf(a), parseD(fromIso), parseD(addDays(fromIso, 400)));
  return r.length ? r[0].date : null;
}
function lastOcc(a, beforeIso) {
  if (a.repeat === 'none') return a.date < beforeIso && !a.skips.includes(a.date) ? a.date : null;
  const r = MH.repeatDates(seriesOf(a), parseD(addDays(beforeIso, -400)), parseD(addDays(beforeIso, -1)));
  return r.length ? r[r.length - 1].date : null;
}
function time12(t) { if (!timeOk(t)) return ''; let [h, m] = t.split(':').map(Number); const ap = h < 12 ? 'am' : 'pm'; h = h % 12 || 12; return h + (m ? ':' + String(m).padStart(2, '0') : '') + ap; }
const apptTimes = a => a.start ? time12(a.start) + (a.end ? '–' + time12(a.end) : '') : 'All day';
const repeatWord = r => (APPT_REPEATS.find(x => x[0] === r) || [, ''])[1];
const occStart = (a, date) => { const [y, mo, d] = date.split('-').map(Number); const [h, m] = (a.start || '09:00').split(':').map(Number); return new Date(y, mo - 1, d, a.start ? h : 9, a.start ? m : 0); };
function dayWord(date) { const d = daysLeft(date); return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d === -1 ? 'Yesterday' : fmtW(date); }
function apptRow(o, showDate = true) {
  const a = o.a;
  const sub = [showDate ? dayWord(o.date) : '', apptTimes(a), a.location, a.repeat !== 'none' ? repeatWord(a.repeat) : ''].filter(Boolean).map(esc).join(' · ');
  return `<button class="row" onclick="apptForm('${a.id}','${o.date}')"><div class="ic appt">${I('cal')}</div><div class="tx"><div class="t">${esc(a.title)}</div><div class="s">${sub}</div></div>${I('right')}</button>`;
}
// ---- month view ----
let calMonth = null, calDay = null, pastOpen = false;
function calMonthStart() { if (!calMonth) calMonth = todayISO().slice(0, 7) + '-01'; return calMonth; }
async function calShift(n) { calMonth = addMonths(calMonthStart(), n, 1); calDay = null; render(); }
async function calToday() { calMonth = null; calDay = todayISO(); render(); }
async function calPick(iso) { calDay = calDay === iso ? null : iso; render(); }
function calGrid() {
  const m0 = calMonthStart(), y = +m0.slice(0, 4), m = +m0.slice(5, 7) - 1;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7; // weeks start on Monday
  const last = m0.slice(0, 8) + String(days).padStart(2, '0');
  const ap = {}; apptsIn(m0, last).forEach(o => { ap[o.date] = (ap[o.date] || 0) + 1; });
  const bl = {}; S.bills.forEach(b => MH.billDates(b, parseD(m0), parseD(last)).forEach(d => { bl[d] = true; }));
  const today = todayISO();
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<div class="cday blank"></div>';
  for (let d = 1; d <= days; d++) {
    const iso = m0.slice(0, 8) + String(d).padStart(2, '0');
    const cls = ['cday', iso === today ? 'today' : '', iso === calDay ? 'sel' : '', iso < today ? 'past' : ''].filter(Boolean).join(' ');
    const dots = (ap[iso] ? '<i class="dot a"></i>' : '') + (bl[iso] ? '<i class="dot b"></i>' : '');
    const lab = fmtLong(iso) + (ap[iso] ? ', ' + plural(ap[iso], 'appointment') : '') + (bl[iso] ? ', bill due' : '');
    cells += `<button type="button" class="${cls}" data-d="${iso}" aria-label="${esc(lab)}" onclick="calPick('${iso}')"><span>${d}</span><b>${dots}</b></button>`;
  }
  return `<div class="card calcard"><div class="calhead"><button class="iconbtn" aria-label="Previous month" onclick="calShift(-1)">${I('left')}</button>
    <div class="calttl" id="calttl">${MONTHS[m]} ${y}</div><button class="iconbtn" aria-label="Next month" onclick="calShift(1)">${I('right')}</button></div>
    <div class="cgrid cwd">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => `<div>${w}</div>`).join('')}</div>
    <div class="cgrid" id="calgrid">${cells}</div>
    <div class="calkey"><span><i class="dot a"></i> Appointment</span><span><i class="dot b"></i> Bill due</span>${m0 !== today.slice(0, 8) + '01' ? `<button class="btn small" onclick="calToday()">Today</button>` : ''}</div></div>`;
}
function calDayPanel() {
  if (!calDay) return '';
  const list = apptsIn(calDay, calDay);
  const bills = S.bills.filter(b => MH.billDates(b, parseD(calDay), parseD(calDay)).length);
  return `<div class="sec">${esc(fmtLong(calDay))}<button onclick="apptForm(null,'${calDay}')">+ Add</button></div>
    <div class="list" id="calday">${list.map(o => apptRow(o, false)).join('')}${bills.map(b => `<button class="row" onclick="billForm('${b.id}')"><div class="ic bill">${I(billIcon(b.name))}</div><div class="tx"><div class="t">${esc(b.name)}</div><div class="s">Bill due${b.amount ? ' · ' + money(b.amount) : ''}</div></div>${I('right')}</button>`).join('')}
    ${!list.length && !bills.length ? `<div class="row"><div class="tx"><div class="s">Nothing on this day.</div></div><button class="btn small primary" onclick="apptForm(null,'${calDay}')">Add appointment</button></div>` : ''}</div>`;
}
function Calendar() {
  const today = todayISO();
  const up = apptsIn(today, addDays(today, 365));
  const seen = new Set(), upcoming = up.filter(o => { if (o.a.repeat === 'none') return true; const n = seen.has(o.a.id) ? false : (seen.add(o.a.id), true); return n; });
  const past = S.appts.filter(a => a.repeat === 'none' && a.date < today).map(a => ({ a, date: a.date })).sort((x, y) => y.date.localeCompare(x.date) || (y.a.start || '').localeCompare(x.a.start || ''));
  return header('Calendar', 'Your appointments', addBtn('Add appointment', `apptForm(null,'${calDay || today}')`)) + calGrid() + calDayPanel() +
    `<div class="sec">Coming up</div>` +
    (upcoming.length ? `<div class="list" id="apptlist">${upcoming.slice(0, 40).map(o => apptRow(o)).join('')}</div>` + (upcoming.length > 40 ? `<p class="muted">And ${upcoming.length - 40} more.</p>` : '')
      : empty('No appointments yet', 'Add doctor, dentist, school or anything else. Repeats are fine too.', 'Add appointment', `apptForm(null,'${today}')`)) +
    (past.length ? `<details class="pastbox" ${pastOpen ? 'open' : ''} ontoggle="pastOpen=this.open"><summary>Past appointments (${past.length})</summary><div class="list" id="pastlist">${past.slice(0, 60).map(o => apptRow(o)).join('')}</div></details>` : '') +
    `<div class="foot">Repeating appointments show their next date here. ${savedWhere()}</div>`;
}
function apptForm(id, date) {
  const a = id ? getAppt(id) : { title: '', date: date || todayISO(), start: '', end: '', location: '', notes: '', repeat: 'none', remind: '' };
  if (!a) return;
  const occ = id ? (date || a.date) : null;
  const extra = id ? `<button type="button" class="btn danger" style="flex:0 0 auto" aria-label="Delete appointment" onclick="deleteAppt('${id}','${occ}')">${I('trash')}</button>
    <button type="button" class="btn" style="flex:0 0 auto" aria-label="Add to phone calendar" title="Add to phone calendar" onclick="icsDownload('${id}','${occ}')">${I('download')}</button>` : '';
  openSheet(id ? 'Edit appointment' : 'Add an appointment',
    field('What is it?', inp('title', a.title, 'placeholder="e.g. Doctor, dentist, haircut" required maxlength="80"')) +
    field(id && a.repeat !== 'none' ? 'First date' : 'Date', inp('date', a.date, 'type="date" required'), id && a.repeat !== 'none' ? 'Changing this moves the whole series.' : '') +
    `<div class="two">${field('Start time', inp('start', a.start, 'type="time"'), 'Leave empty for all day')}${field('End time', inp('end', a.end, 'type="time"'), 'Optional')}</div>` +
    field('Where', inp('location', a.location, 'placeholder="Optional" maxlength="120"')) +
    `<div class="two">${field('Repeats', sel('repeat', APPT_REPEATS, a.repeat))}${field('Reminder', sel('remind', APPT_REMIND, a.remind))}</div>` +
    field('Notes', area('notes', a.notes, 'Optional')) +
    (id ? `<p class="muted" style="font-size:0.8125rem;margin:4px 2px 0">${I('download')} adds it to your phone’s own calendar app.</p>` : ''),
    async v => {
      if (!v.title) return 'Please say what the appointment is.';
      if (!parseD(v.date)) return 'Please choose a date.';
      if (v.end && !v.start) return 'Please add a start time, or clear the end time.';
      if (v.start && v.end && v.end <= v.start) return 'The end time needs to be after the start time.';
      const upd = { title: v.title, date: v.date, start: timeOk(v.start) ? v.start : '', end: timeOk(v.end) ? v.end : '', location: v.location || '', notes: v.notes || '', repeat: v.repeat, remind: v.remind || '' };
      const s = snap();
      if (id) { if (upd.date !== a.date || upd.repeat !== a.repeat) upd.skips = []; Object.assign(a, upd); }
      else S.appts.push(Object.assign({ id: uid('appt'), skips: [] }, upd));
      await save(); render(); toast(id ? 'Appointment updated.' : 'Appointment added.', 'Undo', undoTo(s));
    }, id ? 'Save' : 'Add', extra);
  if (!id && date) { const t = document.querySelector('#sf input[name=title]'); if (t) setTimeout(() => t.focus(), 50); }
}
function deleteAppt(id, occ) {
  const a = getAppt(id); if (!a) return;
  const doIt = async all => {
    const s = snap();
    if (all || a.repeat === 'none') S.appts = S.appts.filter(x => x.id !== id); else a.skips = [...new Set(a.skips.concat(occ))];
    await save(); render(); toast(all || a.repeat === 'none' ? 'Appointment deleted.' : 'Removed ' + fmtW(occ) + ' only.', 'Undo', undoTo(s));
  };
  if (a.repeat === 'none') { confirmSheet('Delete this appointment?', esc(a.title) + ', ' + esc(fmtLong(a.date)), 'Delete', () => doIt(true)); return; }
  openSheet('Delete a repeating appointment', `<p class="muted" style="margin:0 0 6px">${esc(a.title)} repeats ${esc(repeatWord(a.repeat).toLowerCase())}.</p>`, null, '',
    `<button type="button" class="btn danger" id="delone" onclick="closeSheet().then(()=>deleteApptGo('${id}','${occ}',false))">Only ${esc(fmtW(occ))}</button><button type="button" class="btn danger" id="delall" onclick="closeSheet().then(()=>deleteApptGo('${id}','${occ}',true))">All of them</button>`);
}
async function deleteApptGo(id, occ, all) {
  const a = getAppt(id); if (!a) return;
  const s = snap();
  if (all) S.appts = S.appts.filter(x => x.id !== id); else a.skips = [...new Set(a.skips.concat(occ))];
  await save(); render(); toast(all ? 'Appointment deleted.' : 'Removed ' + fmtW(occ) + ' only.', 'Undo', undoTo(s));
}
// ---- .ics file for the phone's own calendar ----
const icsEsc = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const icsFold = line => { const out = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); };
function icsText(a, occ) {
  const d = (occ || a.date).replace(/-/g, ''), t = x => x.replace(':', '') + '00';
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Moniques Helper//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:' + a.id + (a.repeat === 'none' ? '' : '-' + d) + '@moniques-helper', 'DTSTAMP:' + stamp];
  if (a.start) {
    L.push('DTSTART:' + d + 'T' + t(a.start)); // no time zone: the phone treats it as its own local time
    L.push(a.end ? 'DTEND:' + d + 'T' + t(a.end) : 'DURATION:PT1H');
  } else { L.push('DTSTART;VALUE=DATE:' + d); L.push('DTEND;VALUE=DATE:' + addDays(occ || a.date, 1).replace(/-/g, '')); }
  const rr = { weekly: 'FREQ=WEEKLY', fortnightly: 'FREQ=WEEKLY;INTERVAL=2', monthly: 'FREQ=MONTHLY', yearly: 'FREQ=YEARLY' }[a.repeat];
  if (rr) L.push('RRULE:' + rr);
  L.push('SUMMARY:' + icsEsc(a.title));
  if (a.location) L.push('LOCATION:' + icsEsc(a.location));
  if (a.notes) L.push('DESCRIPTION:' + icsEsc(a.notes));
  if (a.remind !== '') L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(a.title), 'TRIGGER:-PT' + (+a.remind) + 'M', 'END:VALARM');
  L.push('END:VEVENT', 'END:VCALENDAR');
  return L.map(icsFold).join('\r\n') + '\r\n';
}
function icsDownload(id, occ) {
  const a = getAppt(id); if (!a) return;
  const blob = new Blob([icsText(a, a.repeat === 'none' ? a.date : occ)], { type: 'text/calendar;charset=utf-8' });
  const el = document.createElement('a');
  el.href = URL.createObjectURL(blob); el.download = (a.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'appointment') + '.ics';
  document.body.appendChild(el); el.click(); setTimeout(() => { URL.revokeObjectURL(el.href); el.remove(); }, 1500);
  toast('Calendar file saved. Open it to add to your phone’s calendar.');
}
// ---- reminders: shown inside the app only ----
function reminderKey(o) { return o.a.id + '|' + o.date; }
function dueReminders(now = new Date()) {
  const today = todayISO(now);
  return apptsIn(addDays(today, -1), addDays(today, 8)).filter(o => {
    if (o.a.remind === '') return false;
    const st = occStart(o.a, o.date), from = new Date(st.getTime() - (+o.a.remind) * 60000);
    const endT = o.a.start ? new Date(st.getTime() + 60 * 60000) : new Date(st.getFullYear(), st.getMonth(), st.getDate(), 23, 59);
    return now >= from && now <= endT && !(S.settings.seen || []).includes(reminderKey(o));
  });
}
function remindBanner() {
  const rem = dueReminders(new Date());
  return `<div id="remindbox" data-k="${esc(rem.map(reminderKey).join())}">` + rem.map(o => `<div class="callout remind" data-k="${esc(reminderKey(o))}">${I('bell')}<div style="flex:1"><b>Reminder: ${esc(o.a.title)}</b><br>${esc(dayWord(o.date))} · ${esc(apptTimes(o.a))}${o.a.location ? ' · ' + esc(o.a.location) : ''}</div><button class="iconbtn" aria-label="Dismiss reminder" onclick="dismissReminder('${esc(reminderKey(o))}')">${I('x')}</button></div>`).join('') + '</div>';
}
function todayCard() {
  const today = todayISO(), now = new Date();
  const soon = apptsIn(today, addDays(today, 6)).filter(o => !(o.date === today && o.a.start && occStart(o.a, o.date) < new Date(now.getTime() - 60 * 60000)));
  if (!soon.length) return '';
  return `<div class="sec">Today and coming up<button onclick="go('#calendar')">Calendar</button></div><div class="list" id="todaylist">${soon.slice(0, 6).map(o => apptRow(o)).join('')}</div>${soon.length > 6 ? `<p class="muted" style="margin:6px 4px 0">And ${soon.length - 6} more this week.</p>` : ''}`;
}
async function dismissReminder(k) {
  S.settings.seen = (S.settings.seen || []).concat(k).slice(-200);
  await save(); render();
}
// Optional phone notifications: only if she turns them on, and only while the app is open.
let notifiedKeys = new Set();
function notifyOn() { return !!S.settings.notify && 'Notification' in window && Notification.permission === 'granted'; }
async function toggleNotify() {
  if (!('Notification' in window)) { toast('This browser can’t show notifications. Reminders will still show in the app.'); return; }
  if (S.settings.notify) { S.settings.notify = false; await save(); render(); toast('Notifications off. Reminders still show in the app.'); return; }
  const p = await Notification.requestPermission();
  if (p !== 'granted') { toast('Notifications weren’t allowed. Reminders will still show in the app.'); return; }
  S.settings.notify = true; await save(); render(); toast('Notifications on, while the app is open.');
}
async function reminderTick() {
  const due = dueReminders();
  const box = document.getElementById('remindbox');
  if (box && !sheetOpen && box.dataset.k !== due.map(reminderKey).join()) render();
  if (!notifyOn()) return;
  for (const o of due) {
    const k = reminderKey(o); if (notifiedKeys.has(k)) continue; notifiedKeys.add(k);
    const body = dayWord(o.date) + ' · ' + apptTimes(o.a) + (o.a.location ? ' · ' + o.a.location : '');
    try { const reg = await navigator.serviceWorker.getRegistration(); if (reg) await reg.showNotification(o.a.title, { body, tag: k, icon: 'icons/icon-192.png' }); else new Notification(o.a.title, { body, tag: k }); } catch (e) {}
  }
}
setInterval(reminderTick, 30000);
function remindersCard() {
  const supported = 'Notification' in window;
  return `<div class="card"><div style="font-weight:700;margin-bottom:4px">Appointment reminders</div>
    <p class="muted" style="margin:0 0 10px;font-size:0.875rem">Reminders show at the top of the app when you open it. You can also let the phone pop up a notification, but only while the app is open. It can’t remind you when the app is closed, so use “Add to phone calendar” for those.</p>
    ${supported ? `<button class="btn small" id="notifybtn" onclick="toggleNotify()">${notifyOn() ? 'Turn off notifications' : 'Turn on notifications'}</button>` : '<p class="muted" style="margin:0">This browser can’t show notifications.</p>'}</div>`;
}

/* ================= GREETING (1.1.1) =================
   "Good morning/afternoon/evening, Monique" by the phone's own clock, and a calming phrase underneath.
   A new phrase each time the app is opened or come back to: all of them go round once before any repeat,
   and never the same one twice in a row. Kept on this phone only. */
const CALM = [ "Take a slow breath. You’re doing just fine.", "One thing at a time is plenty.", "Let your shoulders drop a little.", "There’s no rush today.", "Be gentle with yourself.", "Small steps still count.", "You’ve handled a lot, and you’re still here.", "Breathe in slowly, breathe out slower.", "It’s okay to take a moment.", "Today can be simple.", "Rest is part of the plan.", "You don’t have to do it all at once.", "Notice one good thing around you.", "Let this moment be enough.", "A calm mind makes everything lighter.", "You are allowed to go at your own pace.", "Unclench your jaw and soften your hands.", "Whatever today brings, you can meet it gently.", "Pause, breathe, carry on.", "Kindness to yourself is never wasted.", "Let the little things stay little.", "This moment is yours.", "A cup of tea and a quiet minute can work wonders.", "You’ve got this, one step at a time.", "Slow down; the day will wait.", "Peace can start with a single breath.", "Let go of what you can’t control.", "You are more than your to-do list.", "Calm is always just a breath away.", "It’s okay not to have every answer today.", "Sunlight, fresh air and a deep breath.", "Be proud of how far you’ve come.", "Go easy. You’re doing better than you think.", "Let your thoughts settle like leaves on water.", "Quiet moments are good for the heart.", "Take care of you today.", "You can begin again at any moment.", "Gentle progress is still progress.", "Let today unfold softly.", "Rest when you need to; it’s not a race.", "Look up for a moment and notice the sky.", "Breathe in calm, breathe out worry.", "You deserve a little peace today.", "Things don’t have to be perfect to be good.", "Your best is enough.", "Soft and steady wins the day.", "Listen to what your body needs.", "Every day is a fresh page.", "It’s okay to say no and rest.", "A slow morning is a gift.", "Find one small thing to smile about.", "You’re right where you need to be.", "Let your breath be slow and easy.", "A little calm goes a long way.", "Give yourself the patience you give others.", "Put your feet up when you can.", "You’re stronger than you feel today.", "Take it easy and keep it simple.", "Breathe deeply. Let it all slow down.", "Quiet the noise and listen to yourself.", "There’s always time for a deep breath.", "Not everything needs doing today.", "You’re allowed to feel how you feel.", "Let your mind wander somewhere peaceful.", "Tiny moments of rest add up.", "Gentle days are good days too.", "Focus on what’s in front of you.", "Smile softly; it helps more than you think.", "Trust yourself. You know more than you think.", "Settle in, breathe out, relax your face.", "Make room for a little joy today.", "Let yesterday go and greet today kindly.", "You don’t need to carry everything alone.", "Some fresh air might be just the thing.", "Calm thoughts, kind words, easy steps.", "Your pace is the right pace.", "Pause and feel your feet on the ground.", "Let the day be lighter than you expected.", "You are doing enough.", "Close your eyes for three slow breaths.", "A tidy mind starts with a quiet moment.", "Water, rest, and a little kindness.", "Hold onto the good bits of today.", "You can only do today once, so enjoy a bit of it.", "It’s fine to take the long way round.", "Let the busy fade into the background.", "Everything feels easier after a good breath.", "Treat yourself like you’d treat a good friend.", "Soft music and a slow minute can reset the day.", "You’re making it work, and that’s worth noticing.", "Let worry wait outside for a while.", "Steady breathing, steady heart.", "It’s a good day to be kind to yourself.", "Peaceful thoughts make for a peaceful day.", "Give yourself credit for the little wins.", "Let the quiet in.", "One calm minute can change the whole hour.", "Stretch, breathe, and start again.", "You are loved and you are enough.", "Nothing needs to be rushed right now.", "Take a moment to just be.", "Good things can come slowly.", "Breathe like the waves: in, and out.", "Let your heart rest easy.", "Be still for a moment. It’s allowed.", "Whatever you get done today is enough.", "The world can wait while you breathe.", "A gentle day is a good day.", "Feel the calm settle in, little by little." ];
const CALM_KEY = 'moniquesHelper.calm.v1';
function greetWord(now = new Date()) { const h = now.getHours(); return h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 17 ? 'afternoon' : 'evening'; }
const isBirthday = (now = new Date()) => now.getMonth() === 9 && now.getDate() === 3; // 3 October, every year
const BDAY_LINES = [
  'Wishing you a lovely, relaxing day. You deserve it.',
  'Hope today is full of smiles, treats and people who love you.',
  'Have a wonderful day. Enjoy every little bit of it.',
  'Sending you warm wishes and a big happy birthday hug.',
  'May your day be as kind to you as you are to everyone else.',
  'Put your feet up, have some cake, and enjoy your day.'
];
let bdayNow = '';
const greetText = now => isBirthday(now) ? 'Happy birthday, Monique! 🎂' : 'Good ' + greetWord(now) + ', Monique';
function lineNow() {
  if (!isBirthday()) return calmNow || calmNext();
  if (!bdayNow) bdayNow = BDAY_LINES[Math.floor(Math.random() * BDAY_LINES.length)];
  return bdayNow;
}
const greetKey = (now = new Date()) => (isBirthday(now) ? 'bday' : '') + greetWord(now);
let calmNow = '';
function calmShuffle(avoid) {
  const idx = CALM.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  if (idx.length > 1 && idx[0] === avoid) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}
function calmNext() {
  let st = null;
  try { st = JSON.parse(localStorage.getItem(CALM_KEY) || 'null'); } catch (e) { st = null; }
  if (!st || !Array.isArray(st.order) || st.order.length !== CALM.length || typeof st.pos !== 'number') st = { order: calmShuffle(-1), pos: 0, last: -1 };
  if (st.pos >= st.order.length) { st.order = calmShuffle(st.last); st.pos = 0; }
  let i = st.order[st.pos++];
  if (i === st.last && st.pos < st.order.length) i = st.order[st.pos++];
  st.last = i;
  try { localStorage.setItem(CALM_KEY, JSON.stringify(st)); } catch (e) { }
  calmNow = CALM[i];
  return calmNow;
}
function greetCard() {
  return `<div class="greet" id="greet"><div class="gtx"><div class="greethi" id="greethi">${esc(greetText())}</div><div class="greetcalm" id="greetcalm">${esc(lineNow())}</div></div>
    <button type="button" class="palbtn" id="palbtn" aria-label="Choose a theme" onclick="themeSheet()">${I('palette')}</button></div>`;
}
let greetBand = greetKey();
function greetPaint() {
  const a = document.getElementById('greethi'), c = document.getElementById('greetcalm');
  if (a) a.textContent = greetText(); if (c) c.textContent = lineNow();
}
setInterval(() => { // the app left open across 5am, 12pm, 5pm or midnight into/out of her birthday
  const b = greetKey(); if (b === greetBand) return; greetBand = b; greetPaint();
}, 30000);
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
  if (hiddenAt && Date.now() - hiddenAt > 2000) { // came back to the app: a new phrase
    if (isBirthday()) bdayNow = ''; else calmNext();
    greetBand = greetKey(); greetPaint();
  }
});

/* ================= ROUTER ================= */
const TABS = [['bills', 'Bills', 'bill'], ['calendar', 'Calendar', 'cal'], ['budget', 'Budget', 'cash'], ['loans', 'Loans', 'coins'], ['backup', 'Backup', 'gear']];
function render() {
  if (!S) return;
  const h = (location.hash || '#bills').slice(1), [r, arg] = h.split('/');
  let page = '';
  try {
    page = r === 'loan' ? LoanDetail(arg) : r === 'budget' ? Budget() : r === 'loans' ? Loans() : r === 'backup' ? Backup() : r === 'calendar' ? Calendar() : Bills();
  } catch (e) { console.error(e); page = `<div class="card">Sorry, this page couldn’t load. <button class="btn small" onclick="location.reload()">Reload</button></div>`; }
  $('#view').innerHTML = greetCard() + remindBanner() + (r === 'bills' || r === '' ? installCard() + todayCard() : '') + page;
  const active = r === 'loan' ? 'loans' : TABS.some(t => t[0] === r) ? r : 'bills';
  $('#mhtabs').innerHTML = TABS.map(([k, l, ic]) => `<button class="${k === active ? 'on' : ''}" ${k === active ? 'aria-current="page"' : ''} onclick="go('#${k}')">${I(ic)}<span>${l}</span></button>`).join('');
}
window.addEventListener('hashchange', () => { if (!sheetOpen) { render(); $('#view').scrollTop = 0; window.scrollTo(0, 0); } });
let renderedDay = todayISO();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && todayISO() !== renderedDay && !sheetOpen) { renderedDay = todayISO(); render(); } });
load();
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }

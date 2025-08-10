async function loadParts() {
  const res = await fetch('assets/avatar_parts.svg?v=11');
  const svgText = await res.text();
  document.getElementById('parts-lib').innerHTML = svgText;
}

const state = { hair:1, eyes:1, mouth:1, top:1, bottom:1, dress:0, shoes:1, skin:3, acc:0 };
const limits = { hair:6, eyes:6, mouth:3, top:6, bottom:6, dress:6, shoes:6, skin:6, acc:3 };

/* ...שאר הפונקציות (setUse, render, מאזיני הכפתורים וכו') נשאר אותו דבר... */

/* במקום לקרוא ל-render() מיד, נאתחל כך: */
(async function init(){
  await loadParts();
  render();
})();
/* --- Load parts library (SVG symbols) --- */
async function loadParts() {
  const res = await fetch('assets/avatar_parts.svg?v=10');
  const svgText = await res.text();
  document.getElementById('parts-lib').innerHTML = svgText;
}
loadParts();

/* --- State --- */
const state = {
  hair:   1,
  eyes:   1,
  mouth:  1,
  top:    1,
  bottom: 1,
  dress:  0,    // 0 = none (כשבוחרים שמלה, נעלים top/bottom)
  shoes:  1,
  skin:   3,
  acc:    0
};

/* כמה אופציות קיימות לכל קטגוריה */
const limits = {
  hair: 6, eyes: 6, mouth: 3,
  top: 6, bottom: 6, dress: 6, shoes: 6,
  skin: 6, acc: 3
};

/* --- Helpers --- */
function clampRound(v, max) {
  if (v < 1) v = max;
  if (v > max) v = 1;
  return v;
}
function setUse(id, ref) {
  document.getElementById(id).setAttribute('href', ref);
}
function render() {
  setUse('hairUse',   `#hair-${state.hair}`);
  setUse('eyesUse',   `#eyes-${state.eyes}`);
  setUse('mouthUse',  `#mouth-${state.mouth}`);
  setUse('topUse',    state.dress ? '#top-0' : `#top-${state.top}`);
  setUse('bottomUse', state.dress ? '#bottom-0' : `#bottom-${state.bottom}`);
  setUse('dressUse',  `#dress-${state.dress}`);
  setUse('shoesUse',  `#shoes-${state.shoes}`);
  setUse('skinUse',   `#skin-${state.skin}`);
  setUse('accUse',    `#acc-${state.acc}`);

  // עדכון תוויות קטנות
  const setTxt = (id, txt) => document.getElementById(id).textContent = txt;
  setTxt('hairLabel',   `#${state.hair}`);
  setTxt('eyesLabel',   `#${state.eyes}`);
  setTxt('topLabel',    state.dress ? '—' : `#${state.top}`);
  setTxt('bottomLabel', state.dress ? '—' : `#${state.bottom}`);
  setTxt('dressLabel',  state.dress ? `#${state.dress}` : 'None');
  setTxt('shoesLabel',  `#${state.shoes}`);
}
render();

/* --- Controls: next/prev --- */
document.querySelectorAll('.ctrls button[data-c]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const cat = btn.getAttribute('data-c');
    const dir = +btn.getAttribute('data-dir');
    if (cat === 'dress') {
      state.dress = clampRound(state.dress + dir, limits.dress);
      // אם יש שמלה, מכבים top/bottom
      if (state.dress) { /* keep as is */ }
    } else {
      state[cat] = clampRound(state[cat] + dir, limits[cat]);
    }
    render();
  });
});

/* --- Skin palette --- */
const skinRow = document.getElementById('skinRow');
for (let i=1;i<=limits.skin;i++){
  const b = document.createElement('button');
  b.title = `Skin ${i}`;
  // הצבעים נקבעים מתוך ה-SVG variables; נשים צבע הדמיה כאן:
  const previews = ['#f8e2d6','#f3cfb9','#e7bfa7','#d7a98f','#c59277','#a8715a'];
  b.style.background = previews[i-1] || '#f3cfb9';
  b.addEventListener('click', ()=>{ state.skin = i; render(); });
  skinRow.appendChild(b);
}

/* --- Randomize / Save --- */
document.getElementById('randomize').addEventListener('click', ()=>{
  for (const k of ['hair','eyes','mouth','top','bottom','dress','shoes','skin','acc']) {
    state[k] = Math.floor(Math.random()*limits[k]) + 1;
  }
  // כ-50% לא לבחור שמלה
  if (Math.random()<.5) state.dress = 0;
  render();
});

document.getElementById('savePng').addEventListener('click', ()=>{
  // הופך את ה-SVG לקנבס ול-PNG להורדה
  const svg = document.getElementById('avatar');
  const s = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([s], {type:'image/svg+xml'});
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    // רקע ורדרד קל
    ctx.fillStyle = '#ffeef7';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const scale = 3.2;
    ctx.drawImage(img, 80, 80, svg.viewBox.baseVal.width*scale, svg.viewBox.baseVal.height*scale);

    canvas.toBlob((png)=>{
      const a = document.createElement('a');
      a.href = URL.createObjectURL(png);
      a.download = 'getcute-avatar.png';
      a.click();
    });
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

/* --- Tabs --- */
const pages = {
  home:     document.getElementById('tab-home'),
  avatar:   document.getElementById('tab-avatar'),
  food:     document.getElementById('tab-food'),
  workouts: document.getElementById('tab-workouts'),
  calendar: document.getElementById('tab-calendar'),
};
document.querySelectorAll('.tabs button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const id = b.getAttribute('data-tab');
    Object.values(pages).forEach(p=>p.classList.remove('active'));
    pages[id].classList.add('active');
    window.scrollTo({top:0, behavior:'instant'});
  });
});
// קיצורי ניווט
document.getElementById('gotoAvatar')?.addEventListener('click', ()=>{
  document.querySelector('.tabs button[data-tab="avatar"]').click();
});

/* --- Gamification mini --- */
const coinsEl = document.getElementById('coins');
let coins = +(localStorage.getItem('coins')||0);
coinsEl.textContent = coins;

document.getElementById('markWorkout')?.addEventListener('click', ()=>{
  coins += 5;
  localStorage.setItem('coins', coins);
  coinsEl.textContent = coins;
  document.getElementById('mood').textContent = 'proud 😊';
});

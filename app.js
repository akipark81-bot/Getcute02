/* GetCute v7 */
const VERSION = 7;
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

const state = {
  coins: parseInt(localStorage.getItem('coins')||'0',10),
  // selected indices start from 1..6
  skin:1, hair:1, eyes:1, top:1, bottom:1, dress:1, shoes:1
};

function save(){
  localStorage.setItem('coins', state.coins);
  $('#coins').textContent = state.coins;
}

function setUse(part, i){
  state[part] = i;
  // main avatar
  $(`#use-${part}`).setAttribute('href', `#${part}_${i}`);
  // mini avatar
  $(`#mini-${part}`).setAttribute('href', `#${part}_${i}`);
  // toggle chip UI
  for (const btn of $$(`.chips[data-part="${part}"] button`)) {
    btn.classList.toggle('is-on', parseInt(btn.dataset.idx,10)===i);
  }
}

function buildChips(){
  const parts = ['skin','hair','eyes','top','bottom','dress','shoes'];
  for (const part of parts){
    const wrap = $(`.chips[data-part="${part}"]`);
    wrap.innerHTML = '';
    for (let i=1;i<=6;i++){
      const b = document.createElement('button');
      b.textContent = i;
      b.dataset.idx = i;
      b.addEventListener('click', ()=> setUse(part, i));
      wrap.appendChild(b);
    }
    setUse(part, state[part]);
  }
}

function wireTabs(){
  $$('.tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (btn.disabled) return;
      const tab = btn.dataset.tab;
      // buttons
      $$('.tabs button').forEach(b=>b.classList.toggle('is-active', b===btn));
      // screens
      $$('.screen').forEach(sc=> sc.classList.toggle('is-active', sc.id === `screen-${tab}`));
      // special: jump to avatar when using “Change outfit” on home
    });
  });
  // shortcut from Home card
  $$('[data-tab="avatar"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $('.tabs button[data-tab="avatar"]').click();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });
}

function workoutReward(){
  $('#btnWorkout').addEventListener('click', ()=>{
    state.coins += 10;
    save();
    $('#mood').textContent = 'happy ✨';
  });
}

async function inlineSprite(){
  // fetch the sprite from assets and inline it (so <use> works reliably on GH Pages)
  const res = await fetch(`assets/avatar_parts.svg?v=${VERSION}`);
  const svgText = await res.text();
  $('#parts-sprite').innerHTML = svgText;
}

async function init(){
  // header coins
  save();
  // inline symbols and build chips
  await inlineSprite();
  buildChips();
  wireTabs();
  workoutReward();
}

window.addEventListener('DOMContentLoaded', init);

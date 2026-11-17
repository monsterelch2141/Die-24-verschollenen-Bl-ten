(()=>{'use strict';
const DAY=15,KEY='advent-tag15-website-secret-v1',ANSWER='uncover';
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=localStorage.getItem(KEY)==='yes';
const bar=document.createElement('section');bar.className='website15';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Geheimnis der Website</h3><p>Gib das gesuchte Schlüsselwort ein, um die Sternenroute freizuschalten.</p><form><input aria-label="Schlüsselwort" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" required><button type="submit">✧ Schlüssel bestätigen ✧</button></form><p class="website15-status" role="status"></p>';
instruction.before(bar);
function selected(){return Number(day.value)===DAY}
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('form').hidden=solved;bar.querySelector('.website15-status').textContent=solved?'✦ Richtig! Die Sternenroute ist freigeschaltet.':'';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Gib das gesuchte Schlüsselwort ein.'}
bar.querySelector('form').onsubmit=e=>{e.preventDefault();if(bar.querySelector('input').value.trim().toLowerCase()===ANSWER){solved=true;localStorage.setItem(KEY,'yes');sync()}else bar.querySelector('.website15-status').textContent='Das Schlüsselwort stimmt noch nicht.'};
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse zuerst das Website-Geheimnis. ✧'},true);
day.addEventListener('change',sync);day.addEventListener('input',sync);document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
const style=document.createElement('style');style.textContent='.website15{max-width:580px;margin:16px auto;padding:20px;text-align:center;border:1px solid #bca276;border-radius:12px;background:#f6efdf;color:#503b26}.website15[hidden],.website15 form[hidden]{display:none!important}.website15 form{display:flex;justify-content:center;flex-wrap:wrap;gap:10px}.website15 input{width:190px;max-width:100%;padding:11px;border:1px solid #9c805a;border-radius:7px;font:18px Georgia,serif}.website15 button{background:#a58350;color:#fff8e9;border:1px solid #785b35;border-radius:7px;padding:11px 15px;cursor:pointer}.website15-status{min-height:1.5em}';document.head.append(style);sync();
})();
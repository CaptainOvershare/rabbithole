'use strict';
(()=>{
function calculate(raw){
 const s=raw.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\s/g,'');
 if(!s||s.length>160)throw Error('Enter a calculation');
 let i=0;
 function primary(){if(s[i]==='+'||s[i]==='-'){const sign=s[i++];return sign==='-'?-primary():primary()}if(s[i]==='('){i++;const n=expression();if(s[i++]!==')')throw Error('Missing closing parenthesis');return n}const m=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);if(!m)throw Error('Check the calculation');i+=m[0].length;return Number(m[0])}
 function term(){let n=primary();while(s[i]==='*'||s[i]==='/'){const op=s[i++],b=primary();n=op==='*'?n*b:n/b}return n}
 function expression(){let n=term();while(s[i]==='+'||s[i]==='-'){const op=s[i++],b=term();n=op==='+'?n+b:n-b}return n}
 const n=expression();if(i!==s.length)throw Error('Check the calculation');if(!Number.isFinite(n))throw Error('Undefined');return String(Number(n.toPrecision(16)));
}
const lessons=[
{title:'I · The Prophecy',name:'1089',html:`<h3>Different beginnings. One answer.</h3><p>Choose a three-digit number whose first and last digits differ by at least two. Reverse it. Subtract the smaller from the larger, reverse the difference, then add.</p><div class="chalk-equations"><div>742 − 247 = 495</div><div>495 + 594 = <em>1089</em></div></div><h4>Why does it work?</h4><p>The middle digits cancel. The difference is 99 times the difference between the outside digits. That gives one of these eight numbers:</p><div class="chalk-equations small">198 · 297 · 396 · 495<br>594 · 693 · 792 · 891</div><p>Each has 9 in the middle and outside digits that add to 9. Reverse any one and add: the hundreds and ones each add to 9, and the tens add to 18. Carry the digits and the result is always 1089.</p><p class="chalk-note">Ten ate nine. You're welcome.</p>`},
{title:'II · The Convergence',name:'19,998',html:`<h3>Two choices. Two missing pieces.</h3><p>For each digit you choose, the Oracle chooses the digit that completes a pair of nine.</p><div class="chalk-pairs"><div><b>4</b><b>8</b><b>2</b><b>7</b></div><div><b>5</b><b>1</b><b>7</b><b>2</b></div><div><b>9</b><b>9</b><b>9</b><b>9</b></div></div><div class="chalk-equations"><div>4827 + 5172 = 9999</div><div>7261 + 2738 = 9999</div><div>9999 + 9999 = <em>19,998</em></div></div><p>Whatever four-digit numbers the volunteers choose, the Oracle fills in the missing amounts to 9999. Two pairs always total 19,998. Leading zeros in the Oracle's contribution are allowed.</p><p class="chalk-note">Try your own numbers on the Chalkulator!</p>`},
{title:'III · The Singularity',name:'6174',html:`<h3>A mathematical black hole.</h3><p>Choose four digits with at least two different digits. Sort them biggest to smallest and smallest to biggest, then subtract. Keep all four places, including leading zeros. Repeat.</p><div class="chalk-equations small"><div>6220 − 0226 = 5994</div><div>9954 − 4599 = 5355</div><div>5553 − 3555 = 1998</div><div>9981 − 1899 = 8082</div><div>8820 − 0288 = 8532</div><div>8532 − 2358 = <em>6174</em></div><div>7641 − 1467 = <em>6174</em></div></div><p>6174 is Kaprekar's constant, a fixed point: once you arrive, repeating the operation gives the same result. Every eligible four-digit string reaches it in at most seven rounds. Four identical digits instead produce zero, which is why we exclude them.</p><p class="chalk-note">Try a starting number with a zero!</p>`},
{title:'IV · The Forbidden Experiment',name:'142857',html:`<h3>The mathematical bracelet.</h3><p>These six digits stay in the same circular order. Multiplying by one through six only changes where you begin reading. Tap a bead or choose a multiplier.</p><div class="chalk-wheel" id="chalk-wheel"></div><div class="chalk-multipliers" id="chalk-multipliers"></div><div class="chalk-equations" id="chalk-product" aria-live="polite"></div><p id="chalk-observation"></p><h4>Where does it come from?</h4><div class="chalk-equations">1 ÷ 7 = 0.<span class="chalk-repeat">142857</span>142857…</div><p>Because 7 × 142857 = 999999, dividing 142857 by 999999 gives exactly 1/7. The six-digit block repeats forever in its decimal form. The fractions 2/7 through 6/7 repeat the same block from different starting points.</p><p>At ×7, all six original digits disappear and become six nines. That breaks the <em>rotation</em> pattern, not mathematics.</p><p class="chalk-note">Same beads. Same order. Different starting point.</p>`}
];
let board=null,opener=null,selected=0;
function openBoard(trigger){
 if(document.querySelector('#descent,#show-finale')||board?.open)return;
 opener=trigger;
 if(!board){board=document.createElement('dialog');board.id='oracle-blackboard';board.setAttribute('aria-labelledby','chalk-title');board.innerHTML=`<div class="chalk-frame"><div class="chalk-top"><div><p class="chalk-kicker">Ω · CLASSIFIED OFFICE HOURS</p><h2 id="chalk-title">The Blackboard</h2><p class="chalk-note">For the incurably curious.</p></div><button id="chalk-close" type="button">Return ↩</button></div><div class="chalk-tabs" role="group" aria-label="Choose experiment"></div><div class="chalk-layout"><article id="chalk-lesson"></article><aside class="chalk-calculator"><h3>Chalkulator™</h3><p>Check the Oracle's arithmetic.</p><label for="chalk-input">Your calculation</label><input id="chalk-input" type="text" inputmode="none" autocomplete="off" spellcheck="false" maxlength="160" placeholder="1 ÷ 7"><output id="chalk-answer" aria-live="polite">0</output><div id="chalk-keys"></div><button class="chalk-try" type="button">Try 1 ÷ 7</button><p class="chalk-note">Decimals are rounded; the repeating pattern goes on forever.</p></aside></div><footer>Curiosity has consequences. One of them is homework.</footer></div>`;
 document.body.append(board);
 board.querySelector('#chalk-close').onclick=()=>board.close();
 board.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true})});
 board.addEventListener('keydown',e=>{e.stopPropagation()});
 board.addEventListener('click',e=>e.stopPropagation());
 const tabs=board.querySelector('.chalk-tabs');lessons.forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.textContent=l.name;b.onclick=()=>render(i);tabs.append(b)});
 const input=board.querySelector('#chalk-input'),answer=board.querySelector('#chalk-answer');
 function solve(){try{answer.textContent=calculate(input.value)}catch(e){answer.textContent=e.message}}
 input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();solve()}});
 function key(k){if(k==='C'){input.value='';answer.textContent='0'}else if(k==='⌫'){input.value=input.value.slice(0,-1)}else if(k==='=')solve();else if(input.value.length<160)input.value+=k}
 for(const k of ['C','⌫','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+']){const b=document.createElement('button');b.type='button';b.textContent=k;b.onclick=()=>key(k);board.querySelector('#chalk-keys').append(b)}
 board.querySelector('.chalk-try').onclick=()=>{input.value='1 ÷ 7';solve()};
 }
 const act=document.body.dataset.act;render(act==='prophecy'?0:act==='convergence'?1:act==='singularity'?2:document.querySelector('#cycle-stage')?3:selected);
 board.showModal();board.querySelector('#chalk-close').focus();
}
function render(i){selected=i;const l=lessons[i];const article=board.querySelector('#chalk-lesson');article.innerHTML='<h2>'+l.title+'</h2>'+l.html;[...board.querySelector('.chalk-tabs').children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));if(i===3)wheel(1)}
function wheel(n){const d='142857',prod=String(142857*n),offset=d.indexOf(prod[0]),w=board.querySelector('#chalk-wheel');let svg='<svg viewBox="0 0 300 220" role="img" aria-label="Circular digits in the order 1, 4, 2, 8, 5, 7"><circle cx="150" cy="110" r="77" fill="none" stroke="#dce7d5" stroke-width="1.5" stroke-dasharray="6 4"/><text x="150" y="107" text-anchor="middle" fill="#e6e2cd" font-size="14">Same order</text><text x="150" y="125" text-anchor="middle" fill="#e6e2cd" font-size="14">Different start</text>';for(let i=0;i<6;i++){const x=150+77*Math.sin(i*Math.PI/3),y=110-77*Math.cos(i*Math.PI/3);svg+='<g data-bead="'+i+'" tabindex="0" role="button" aria-label="Start at '+d[i]+'"><circle cx="'+x+'" cy="'+y+'" r="20" fill="'+(i===offset?'#6e6540':'#1c342b')+'" stroke="'+(i===offset?'#ffe0a0':'#dce7d5')+'"/><text x="'+x+'" y="'+(y+7)+'" text-anchor="middle" font-size="22" fill="#f2eee0">'+d[i]+'</text></g>'}w.innerHTML=svg+'</svg>';for(const g of w.querySelectorAll('[data-bead]')){const go=()=>wheel([1,3,2,6,4,5][Number(g.dataset.bead)]);g.onclick=go;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}}
 const m=board.querySelector('#chalk-multipliers');m.innerHTML='';for(let j=1;j<=7;j++){const b=document.createElement('button');b.type='button';b.textContent='×'+j;b.setAttribute('aria-pressed',String(j===n));b.onclick=()=>wheel(j);m.append(b)}
 board.querySelector('#chalk-product').textContent='142857 × '+n+' = '+prod;board.querySelector('#chalk-observation').textContent=n===7?'No original digits remain. The rotation pattern is broken.':'Start at '+prod[0]+' and read clockwise. Now find 1 and read around: 142857, every time.';
}
// A long press opens on release, and consumes the following click instead of counting as a secret tap.
const targets='main > .sigil, main .cycle-wheel, main .seal, main > h2';
let hold=null,suppressUntil=0;
document.addEventListener('pointerdown',e=>{const t=e.target.closest(targets);if(!t||e.button!==0||!e.isPrimary||board?.open)return;hold={t,id:e.pointerId,x:e.clientX,y:e.clientY,at:performance.now()}},true);
document.addEventListener('pointermove',e=>{if(hold&&e.pointerId===hold.id&&Math.hypot(e.clientX-hold.x,e.clientY-hold.y)>18)hold=null},true);
document.addEventListener('pointercancel',()=>{hold=null},true);
document.addEventListener('contextmenu',e=>{if(e.target.closest(targets))e.preventDefault()},true);
document.addEventListener('pointerup',e=>{if(!hold||e.pointerId!==hold.id)return;const h=hold;hold=null;if(performance.now()-h.at>=850&&Math.hypot(e.clientX-h.x,e.clientY-h.y)<=18){suppressUntil=performance.now()+650;e.preventDefault();openBoard(h.t)}},true);
document.addEventListener('click',e=>{if(performance.now()<suppressUntil){suppressUntil=0;e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('keydown',e=>{if(e.shiftKey&&e.key.toLowerCase()==='b'&&!e.target.closest('input,textarea,[contenteditable]')){e.preventDefault();e.stopImmediatePropagation();openBoard(document.activeElement)}},true);
})();
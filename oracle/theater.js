'use strict';
(()=>{
const W=window.ORACLE_WORDS||{}, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let muted=false, spoken=false, context;
try{muted=localStorage.getItem('oracleMuted')==='1';spoken=localStorage.getItem('oracleVoice')==='1'}catch(e){}
const header=document.querySelector('header');
function toggle(label,on,fn){const b=document.createElement('button');b.type='button';b.id=label.toLowerCase();b.setAttribute('aria-pressed',String(on));b.textContent=label+': '+(on?'ON':'OFF');b.onclick=()=>{on=!on;b.textContent=label+': '+(on?'ON':'OFF');b.setAttribute('aria-pressed',String(on));fn(on)};header.insertBefore(b,document.querySelector('#full'))}
function audio(){try{context ||= new (window.AudioContext||window.webkitAudioContext)();context.resume().catch(()=>{});return context}catch(e){return null}}
function tone(freq,end,seconds,delay=0,gain=.08,type='sine'){if(muted)return;const c=audio();if(!c)return;const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(end,t+seconds);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+seconds);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+seconds+.02)}
function drop(){tone(65,750,1.3,0,.045,'triangle');tone(120,36,1.35,1.35,.22,'sine');tone(120,52,.9,1.35,.065,'sawtooth');tone(190,48,.45,1.35,.07,'triangle');for(let i=0;i<3;i++)tone(95,38,.35,1.7+i*.28,.10)}
function say(line){if(!spoken||!line||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(line);u.rate=.82;u.pitch=.55;u.volume=.85;speechSynthesis.speak(u)}catch(e){}}
toggle('Sound',!muted,on=>{muted=!on;try{localStorage.setItem('oracleMuted',muted?'1':'0')}catch(e){}if(on)tone(220,440,.2)});
toggle('Voice',spoken,on=>{spoken=on;try{localStorage.setItem('oracleVoice',on?'1':'0')}catch(e){}if(on)say('Oracle voice interface online.');else if('speechSynthesis'in window)speechSynthesis.cancel()});
window.OracleTheater={tone,say,drop};
const symbols={
prophecy:'<path d="M14 50Q50 4 86 50Q50 96 14 50Z" fill="none" stroke="currentColor"/><circle cx="50" cy="50" r="20" fill="none" stroke="#83dec9"/><circle class="pulse" cx="50" cy="50" r="7" fill="#83dec9"/>',
convergence:'<g class="spin">'+[0,90,180,270].map(a=>'<g transform="rotate('+a+' 50 50)"><path d="M31 14H69L50 47Z" fill="none" stroke="currentColor"/><path d="M50 21V39M45 34L50 39L55 34" fill="none" stroke="#83dec9"/></g>').join('')+'</g><circle cx="50" cy="50" r="5" fill="#83dec9"/>',
singularity:'<g class="counter">'+Array.from({length:10},(_,i)=>'<rect x="'+(13+i*3.5)+'" y="'+(13+i*3.5)+'" width="'+(74-i*7)+'" height="'+(74-i*7)+'" transform="rotate('+(i*14)+' 50 50)" fill="none" stroke="'+(i%2?'#83dec9':'currentColor')+'" stroke-width=".7"/>').join('')+'</g><circle cx="50" cy="50" r="5" fill="#03070d"/>'};
function icon(act){return '<div class="act-icon" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" stroke="currentColor" fill="none" stroke-width=".7"/><circle cx="50" cy="50" r="42" stroke="currentColor" fill="none" stroke-dasharray="1 5"/>'+symbols[act]+'</svg></div>'}
document.querySelectorAll('nav a').forEach(a=>{const key=a.getAttribute('href').split('/')[0];if(symbols[key])a.insertAdjacentHTML('afterbegin',icon(key))});
const act=document.body.dataset.act,stage=document.querySelector('#stage');
if(stage&&act){let last='',first=true;const enhance=()=>{const seal=stage.querySelector('.seal');if(seal&&!seal.querySelector('.act-icon'))seal.innerHTML=icon(act);const status=stage.querySelector('.status')?.textContent||'';if(status===last&&!first)return;last=status;first=false;const final=/FULFILLED|SEALED PREDICTION/.test(status);stage.classList.toggle('finale',final);if(final){tone(160,40,.85,0,.12);say(W.finaleVoice)}else if(status.startsWith('ITERATION'))tone(440,220,.16,0,.04);};
new MutationObserver(enhance).observe(stage,{childList:true,subtree:false});enhance();
document.querySelector('#next')?.addEventListener('click',()=>{if(stage.querySelector('.seal'))return;const input=stage.querySelector('#digits');if(input&&W.eggs?.[input.value])say(W.eggs[input.value])});
document.querySelector('#next')?.addEventListener('pointerdown',()=>{audio();if(stage.querySelector('.seal'))say(W[act+'Voice'])},{passive:true});
}
const sigil=document.querySelector('main>.sigil');if(sigil){let count=0;sigil.addEventListener('click',()=>{if(++count===7){const s=document.createElement('section');s.className='classified';const title=document.createElement('p');title.className='eyebrow';title.textContent=W.classifiedTitle;const msg=document.createElement('p');msg.textContent=W.classifiedMessage;s.append(title,msg);document.querySelector('main').append(s);s.scrollIntoView({behavior:reduced?'auto':'smooth'});tone(160,330,.45);say(W.classifiedMessage)}})}
const foot=document.querySelector('.foot');if(foot&&W.statuses?.length){let i=0;setInterval(()=>{foot.textContent=W.statuses[++i%W.statuses.length]},8500)}

// Shared descent engine. Each portal has its own depth and pacing.
function descend(link,key){
 const cfg=W.depths[key],destination=link.href;if(document.querySelector('#descent'))return;
 if(reduced){location.href=destination;return}
 const panel=document.createElement('div');panel.id='descent';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Descent in progress');
 panel.innerHTML='<canvas aria-hidden="true"></canvas><div class="descent-message"><div class="depth-label"></div><div class="depth-symbol"></div><div class="depth-message"></div><div class="depth-meter"><i></i></div></div><button id="skip">Skip descent</button>';
 document.body.append(panel);const c=panel.querySelector('canvas'),ctx=c.getContext('2d'),msg=panel.querySelector('.depth-message'),meter=panel.querySelector('.depth-meter i');
 panel.querySelector('.depth-label').textContent=cfg.label;
 panel.querySelector('.depth-symbol').innerHTML=key==='surface'?'<span>Ω</span>':icon(key);
 const started=performance.now(),duration=cfg.seconds;let stopped=false,lastBeat=-10,hasDrop=false;
 const ac=muted?null:audio();let riser=null;
 if(ac){const o=ac.createOscillator(),g=ac.createGain(),filter=ac.createBiquadFilter(),t=ac.currentTime;o.type='sawtooth';o.frequency.setValueAtTime(42,t);o.frequency.exponentialRampToValueAtTime(520,t+duration*.78);filter.type='lowpass';filter.frequency.setValueAtTime(100,t);filter.frequency.exponentialRampToValueAtTime(2300,t+duration*.78);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.045,t+duration*.72);g.gain.exponentialRampToValueAtTime(.0001,t+duration*.8);o.connect(filter);filter.connect(g);g.connect(ac.destination);o.start();o.stop(t+duration*.81);riser=o}
 function go(){if(stopped)return;stopped=true;try{riser?.stop()}catch(e){}location.href=destination}
 panel.querySelector('#skip').onclick=go;panel.querySelector('#skip').focus({preventScroll:true});
 panel.addEventListener('keydown',e=>{if(e.key==='Escape')go()});
 function frame(now){if(stopped)return;const t=(now-started)/1000,p=Math.min(1,t/duration),phase=Math.min(cfg.lines.length-1,Math.floor(p*cfg.lines.length));msg.textContent=cfg.lines[phase];meter.style.width=(p*100)+'%';
 const interval=1.25-.82*p;if(t-lastBeat>interval&&p<.79){lastBeat=t;tone(82,43,.18,0,.14);tone(72,39,.15,.19,.09)}
 if(p>=.80&&!hasDrop){hasDrop=true;tone(110,35,1.5,0,.21);tone(82,39,1.2,0,.055,'triangle');tone(150,48,.4,0,.065,'triangle');for(let i=0;i<3;i++)tone(92,38,.32,.27+i*.24,.09)}
 if(ctx){const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#03070d';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);
 const speed=t*.14+t*t*(.018+cfg.depth*.012)+Math.max(0,p-.79)*3;
 for(let i=0;i<30;i++){const z=(i/30+speed)%1,r=12*Math.pow(Math.max(w,h)/8,z);ctx.save();ctx.rotate(z*(2.6+cfg.depth*.45)+t*(.13+cfg.depth*.05));ctx.strokeStyle=i%3?'rgba(220,192,138,'+(.15+z*.6)+')':'rgba(131,222,201,'+(.15+z*.6)+')';ctx.lineWidth=1+z*2;ctx.strokeRect(-r,-r,2*r,2*r);if(i%3===0){ctx.font=(10+z*15)+'px Georgia';ctx.fillStyle=ctx.strokeStyle;ctx.fillText(['Ω','π','∞','∑','0','φ'][i%6],r,0)}ctx.restore()}ctx.restore()}
 if(p<1)requestAnimationFrame(frame);else go()}
 requestAnimationFrame(frame)
}
const enter=document.querySelector('#enter');if(enter)enter.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();descend(enter,'surface')});
document.querySelectorAll('nav a').forEach(link=>{const key=link.getAttribute('href').split('/')[0];if(W.depths?.[key])link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();descend(link,key)})});
})();

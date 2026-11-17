(()=>{
if(!matchMedia('(pointer:coarse)').matches||!window.G)return;
G.touch=1;
const css=document.createElement('style');
css.textContent=`html,body{touch-action:none;-webkit-touch-callout:none}
#touch{display:none;position:fixed;inset:0;z-index:4;touch-action:none}
.tb{position:absolute;border-radius:50%;background:rgba(18,26,48,.5);border:2.5px solid rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.4),inset 0 0 14px rgba(255,255,255,.1);transition:transform .07s,background .07s}
.tb.on{transform:scale(.92);background:rgba(43,181,207,.75)}.tb.sel{box-shadow:0 0 0 3px #ffd24a,0 4px 14px rgba(0,0,0,.4)}
.tb svg{width:50%;height:50%;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));pointer-events:none}
#fire{background:rgba(205,55,45,.5);border-width:3.5px}#fire.on{background:rgba(255,85,65,.85)}#fire2{background:rgba(205,55,45,.38)}#fire2.on{background:rgba(255,85,65,.8)}
#jb{position:absolute;width:clamp(110px,30vmin,150px);height:clamp(110px,30vmin,150px);border-radius:50%;background:rgba(18,26,48,.38);border:2.5px solid rgba(255,255,255,.5);display:none}
#jt{position:absolute;left:50%;top:50%;width:44%;height:44%;margin:-22% 0 0 -22%;border-radius:50%;background:rgba(255,255,255,.7);box-shadow:0 2px 10px rgba(0,0,0,.4)}
#ammo{right:auto!important;left:50%;bottom:6px!important;transform:translateX(-50%);text-align:center!important}#am{font-size:28px!important}
#slots,#board{display:none!important}#hpw{bottom:auto!important;top:12px;left:14px!important;width:160px!important;font-size:18px!important}#feed{top:70px!important}#top{transform:translateX(-50%) scale(.8);top:2px!important}
#hep{display:none;position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:9;background:rgba(10,16,34,.94);border:1px solid #35d4ee;padding:8px 12px;text-align:center;color:#fff;font:700 13px "Trebuchet MS",sans-serif;border-radius:8px}
#hep span{display:block;color:#9fb0e0;font-weight:400;font-size:11px;margin:3px 0 6px}
#hep button{width:auto;padding:8px 16px;margin:0 3px;font-size:16px;clip-path:none;border-radius:6px}
#hudm{background:#0b0e14;font-size:16px;margin-bottom:8px;clip-path:polygon(14px 0,100% 0,100% 100%,0 100%)}`;
document.head.appendChild(css);
const ic={fire:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',jump:'<path d="M5 14l7-7 7 7M5 20l7-7 7 7"/>',crouch:'<path d="M5 8l7 7 7-7M6 20h12"/>',reload:'<path d="M20 12a8 8 0 1 1-3-6.2M20 3.5V9h-5.5"/>',swap:'<path d="M4 8h14l-4-4M20 16H6l4 4"/>',scope:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',pause:'<path d="M9 5v14M15 5v14"/>'};
const root=document.createElement('div');root.id='touch';
const jb=document.createElement('div');jb.id='jb';jb.innerHTML='<div id="jt"></div>';root.appendChild(jb);
const jt=jb.firstChild,JS=window.JS,vib=()=>{try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}};
let editing=false,sel=null,LAY={};try{LAY=JSON.parse(localStorage.getItem('vs-hud')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('vs-hud',JSON.stringify(LAY))}catch(e){}};
const bpx=e=>Math.max(48,Math.min(130,e._sz*Math.min(innerWidth,innerHeight)/100));
const apply=e=>{const L=LAY[e.id];if(!L){e.style.cssText=e._def;return}const w=bpx(e)*L.s;e.style.cssText='width:'+w+'px;height:'+w+'px;left:'+(L.cx*innerWidth-w/2)+'px;top:'+(L.cy*innerHeight-w/2)+'px'};
const mark=()=>root.querySelectorAll('.tb').forEach(b=>b.classList.toggle('sel',b===sel));
const bind=(el,dn,up)=>{
el.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(editing){sel=el;mark();return}el.classList.add('on');vib();dn&&dn()},{passive:false});
el.addEventListener('touchmove',e=>{if(!editing)return;e.preventDefault();e.stopPropagation();const t=e.changedTouches[0];LAY[el.id]=Object.assign(LAY[el.id]||{s:1},{cx:Math.min(.96,Math.max(.04,t.clientX/innerWidth)),cy:Math.min(.96,Math.max(.06,t.clientY/innerHeight))});apply(el)},{passive:false});
['touchend','touchcancel'].forEach(t=>el.addEventListener(t,e=>{e.preventDefault();e.stopPropagation();if(editing)return;el.classList.remove('on');up&&up()},{passive:false}))};
// size/r/b in vmin; negative r = from left, negative b = from top
const mk=(id,size,r,b,dn,up,icon)=>{const e=document.createElement('div');e.className='tb';e.id=id;e._sz=size;const s='clamp(48px,'+size+'vmin,130px)';
e.style.cssText='width:'+s+';height:'+s+';'+(r<0?'left:calc('+-r+'vmin + env(safe-area-inset-left,0px));':'right:calc('+r+'vmin + env(safe-area-inset-right,0px));')+(b<0?'top:calc('+-b+'vmin + env(safe-area-inset-top,0px))':'bottom:calc('+b+'vmin + env(safe-area-inset-bottom,0px))');
e._def=e.style.cssText;e.innerHTML='<svg viewBox="0 0 24 24">'+ic[icon||id]+'</svg>';bind(e,dn,up);root.appendChild(e);apply(e);return e};
const aim=e=>{let p=[0,0];e.addEventListener('touchstart',t=>{const c=t.changedTouches[0];p=[c.clientX,c.clientY]},{passive:false});
e.addEventListener('touchmove',t=>{if(editing)return;t.preventDefault();for(const c of t.changedTouches){G.look(c.clientX-p[0],c.clientY-p[1]);p=[c.clientX,c.clientY]}},{passive:false})};
aim(mk('fire',24,6,22,()=>G.fire(true),()=>G.fire(false)));
aim(mk('fire2',18,-9,52,()=>G.fire(true),()=>G.fire(false),'fire'));
mk('scope',15,10,50,()=>G.zoom());
mk('jump',16,8,4,()=>G.K.Space=true,()=>G.K.Space=false);
mk('crouch',13,27,6,()=>G.K.KeyC=!G.K.KeyC);
mk('reload',13,34,26,()=>G.reload());
mk('swap',12,28,48,()=>G.cyc());
mk('pause',8,3,-3,()=>G.pause());
let jid=null,lid=null,jo,lp,R=50;
root.addEventListener('touchstart',e=>{e.preventDefault();if(editing)return;for(const t of e.changedTouches){
if(t.clientX<innerWidth*.4&&jid===null){jid=t.identifier;jo=[t.clientX,t.clientY];jb.style.display='block';R=jb.offsetWidth*.4;jb.style.left=t.clientX-jb.offsetWidth/2+'px';jb.style.top=t.clientY-jb.offsetHeight/2+'px'}
else if(lid===null){lid=t.identifier;lp=[t.clientX,t.clientY]}}},{passive:false});
root.addEventListener('touchmove',e=>{e.preventDefault();if(editing)return;for(const t of e.changedTouches){
if(t.identifier===jid){let dx=(t.clientX-jo[0])/R,dy=(t.clientY-jo[1])/R;const m=Math.hypot(dx,dy);G.K.ShiftLeft=m>1.35;if(m>1){dx/=m;dy/=m}JS.x=dx;JS.y=-dy;jt.style.transform='translate('+dx*R+'px,'+dy*R+'px)'}
else if(t.identifier===lid){G.look(t.clientX-lp[0],t.clientY-lp[1]);lp=[t.clientX,t.clientY]}}},{passive:false});
const end=e=>{for(const t of e.changedTouches){
if(t.identifier===jid){jid=null;JS.x=JS.y=0;G.K.ShiftLeft=false;jb.style.display='none';jt.style.transform=''}
else if(t.identifier===lid)lid=null}};
root.addEventListener('touchend',end);root.addEventListener('touchcancel',end);
document.body.appendChild(root);
// ---- HUD layout editor ----
const hep=document.createElement('div');hep.id='hep';hep.innerHTML='<b>HUD LAYOUT</b><span>Drag a button to move it. Tap to select, then resize.</span><div><button id="hsm">−</button><button id="hbg">+</button><button id="hrs">Reset</button><button id="hdn">Done</button></div>';document.body.appendChild(hep);
const OV=['#menu','#pause','#lo','#hud'].map(s=>document.querySelector(s));let sv=[];
const openEd=()=>{editing=true;sel=root.querySelector('#fire');mark();sv=OV.map(o=>o.style.display);OV[0].style.display=OV[1].style.display=OV[2].style.display='none';OV[3].style.display='block';hep.style.display='block'};
const closeEd=()=>{editing=false;sel=null;mark();save();hep.style.display='none';OV.forEach((o,i)=>o.style.display=sv[i])};
const size=d=>{if(!sel)return;if(!LAY[sel.id]){const r=sel.getBoundingClientRect();LAY[sel.id]={cx:(r.left+r.width/2)/innerWidth,cy:(r.top+r.height/2)/innerHeight,s:1}}const L=LAY[sel.id];L.s=Math.min(1.8,Math.max(.6,L.s+d));apply(sel)};
hep.querySelector('#hsm').onclick=()=>size(-.1);hep.querySelector('#hbg').onclick=()=>size(.1);
hep.querySelector('#hrs').onclick=()=>{LAY={};root.querySelectorAll('.tb').forEach(apply);save()};
hep.querySelector('#hdn').onclick=closeEd;
const eb=(par,before,id,cls)=>{const b=document.createElement('button');b.textContent='HUD LAYOUT';if(id)b.id=id;if(cls)b.className=cls;b.onclick=openEd;par.insertBefore(b,before)};
eb(document.querySelector('#pause .card'),document.querySelector('#leave'),'','alt');
eb(document.querySelector('#side'),document.querySelector('#lbtn'),'hudm','');
addEventListener('resize',()=>root.querySelectorAll('.tb').forEach(apply));
setInterval(()=>root.style.display=(editing||G.locked())?'block':'none',150);
})();

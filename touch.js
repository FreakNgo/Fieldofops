(()=>{
if(!matchMedia('(pointer:coarse)').matches||!window.G)return;
G.touch=1;
const css=document.createElement('style');
css.textContent=`html,body{touch-action:none;-webkit-touch-callout:none}
#touch{display:none;position:fixed;inset:0;z-index:4;touch-action:none}
.tb{position:absolute;border-radius:50%;background:rgba(18,26,48,.5);border:2.5px solid rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.4),inset 0 0 14px rgba(255,255,255,.1);transition:transform .07s,background .07s}
.tb.on{transform:scale(.92);background:rgba(43,181,207,.75)}
.tb svg{width:50%;height:50%;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
#fire{background:rgba(205,55,45,.5);border-width:3.5px}#fire.on{background:rgba(255,85,65,.85)}#fire2{background:rgba(205,55,45,.38)}#fire2.on{background:rgba(255,85,65,.8)}
#jb{position:absolute;width:clamp(110px,30vmin,150px);height:clamp(110px,30vmin,150px);border-radius:50%;background:rgba(18,26,48,.38);border:2.5px solid rgba(255,255,255,.5);display:none}
#jt{position:absolute;left:50%;top:50%;width:44%;height:44%;margin:-22% 0 0 -22%;border-radius:50%;background:rgba(255,255,255,.7);box-shadow:0 2px 10px rgba(0,0,0,.4)}
#ammo{right:auto!important;left:50%;bottom:6px!important;transform:translateX(-50%);text-align:center!important}#am{font-size:28px!important}
#slots,#board{display:none!important}#hpw{bottom:auto!important;top:12px;left:14px!important;width:160px!important;font-size:18px!important}#feed{top:70px!important}#top{transform:translateX(-50%) scale(.8);top:2px!important}`;
document.head.appendChild(css);
const ic={fire:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',jump:'<path d="M5 14l7-7 7 7M5 20l7-7 7 7"/>',crouch:'<path d="M5 8l7 7 7-7M6 20h12"/>',reload:'<path d="M20 12a8 8 0 1 1-3-6.2M20 3.5V9h-5.5"/>',swap:'<path d="M4 8h14l-4-4M20 16H6l4 4"/>',scope:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',pause:'<path d="M9 5v14M15 5v14"/>'};
const root=document.createElement('div');root.id='touch';
const jb=document.createElement('div');jb.id='jb';jb.innerHTML='<div id="jt"></div>';root.appendChild(jb);
const jt=jb.firstChild,JS=window.JS,vib=()=>{try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}};
const bind=(el,dn,up)=>{el.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();el.classList.add('on');vib();dn&&dn()},{passive:false});['touchend','touchcancel'].forEach(t=>el.addEventListener(t,e=>{e.preventDefault();e.stopPropagation();el.classList.remove('on');up&&up()},{passive:false}))};
// size/r/b in vmin; negative r = from left, negative b = from top
const mk=(id,size,r,b,dn,up,icon)=>{const e=document.createElement('div');e.className='tb';e.id=id;const s='clamp(48px,'+size+'vmin,130px)';
e.style.cssText='width:'+s+';height:'+s+';'+(r<0?'left:calc('+-r+'vmin + env(safe-area-inset-left,0px));':'right:calc('+r+'vmin + env(safe-area-inset-right,0px));')+(b<0?'top:calc('+-b+'vmin + env(safe-area-inset-top,0px))':'bottom:calc('+b+'vmin + env(safe-area-inset-bottom,0px))');
e.innerHTML='<svg viewBox="0 0 24 24">'+ic[icon||id]+'</svg>';bind(e,dn,up);root.appendChild(e);return e};
const aim=e=>{let p=[0,0];e.addEventListener('touchstart',t=>{const c=t.changedTouches[0];p=[c.clientX,c.clientY]},{passive:false});
e.addEventListener('touchmove',t=>{t.preventDefault();for(const c of t.changedTouches){G.look(c.clientX-p[0],c.clientY-p[1]);p=[c.clientX,c.clientY]}},{passive:false})};
// Call of Duty Mobile style layout
aim(mk('fire',24,6,22,()=>G.fire(true),()=>G.fire(false)));
aim(mk('fire2',18,-9,52,()=>G.fire(true),()=>G.fire(false),'fire'));
mk('scope',15,10,50,()=>G.zoom());
mk('jump',16,8,4,()=>G.K.Space=true,()=>G.K.Space=false);
mk('crouch',13,27,6,()=>G.K.KeyC=!G.K.KeyC);
mk('reload',13,34,26,()=>G.reload());
mk('swap',12,28,48,()=>G.cyc());
mk('pause',8,3,-3,()=>G.pause());
let jid=null,lid=null,jo,lp,R=50;
root.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches){
if(t.clientX<innerWidth*.4&&jid===null){jid=t.identifier;jo=[t.clientX,t.clientY];jb.style.display='block';R=jb.offsetWidth*.4;jb.style.left=t.clientX-jb.offsetWidth/2+'px';jb.style.top=t.clientY-jb.offsetHeight/2+'px'}
else if(lid===null){lid=t.identifier;lp=[t.clientX,t.clientY]}}},{passive:false});
root.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){
if(t.identifier===jid){let dx=(t.clientX-jo[0])/R,dy=(t.clientY-jo[1])/R;const m=Math.hypot(dx,dy);G.K.ShiftLeft=m>1.35;if(m>1){dx/=m;dy/=m}JS.x=dx;JS.y=-dy;jt.style.transform='translate('+dx*R+'px,'+dy*R+'px)'}
else if(t.identifier===lid){G.look(t.clientX-lp[0],t.clientY-lp[1]);lp=[t.clientX,t.clientY]}}},{passive:false});
const end=e=>{for(const t of e.changedTouches){
if(t.identifier===jid){jid=null;JS.x=JS.y=0;G.K.ShiftLeft=false;jb.style.display='none';jt.style.transform=''}
else if(t.identifier===lid)lid=null}};
root.addEventListener('touchend',end);root.addEventListener('touchcancel',end);
document.body.appendChild(root);
setInterval(()=>root.style.display=G.locked()?'block':'none',150);
})();

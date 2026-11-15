(()=>{
if(!matchMedia('(pointer:coarse)').matches||!window.G)return;
G.touch=1;
const css=document.createElement('style');
css.textContent=`html,body{touch-action:none;-webkit-touch-callout:none}
#touch{display:none;position:fixed;inset:0;z-index:4;touch-action:none}
.tb{position:absolute;border-radius:50%;background:rgba(18,26,48,.55);border:3px solid rgba(255,255,255,.78);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.45),inset 0 0 14px rgba(255,255,255,.12);transition:transform .08s,background .08s}
.tb.on{transform:scale(.9);background:rgba(43,181,207,.8)}
.tb svg{width:52%;height:52%;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
#fire{background:rgba(200,50,40,.5)}#fire.on{background:rgba(255,80,60,.85)}
#jb{position:absolute;width:132px;height:132px;border-radius:50%;background:rgba(18,26,48,.4);border:3px solid rgba(255,255,255,.55);display:none}
#jt{position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px;border-radius:50%;background:rgba(255,255,255,.72);box-shadow:0 2px 10px rgba(0,0,0,.4)}
#ammo{right:auto!important;left:50%;bottom:8px!important;transform:translateX(-50%);text-align:center!important}#am{font-size:30px!important}
#slots,#board{display:none!important}#hpw{bottom:auto!important;top:14px;left:70px!important;width:170px!important;font-size:18px!important}#feed{top:84px!important}#top{transform:translateX(-50%) scale(.8);top:2px!important}`;
document.head.appendChild(css);
const ic={fire:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',jump:'<path d="M5 14l7-7 7 7M5 20l7-7 7 7"/>',crouch:'<path d="M5 8l7 7 7-7M6 20h12"/>',reload:'<path d="M20 12a8 8 0 1 1-3-6.2M20 3.5V9h-5.5"/>',swap:'<path d="M4 8h14l-4-4M20 16H6l4 4"/>',scope:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',pause:'<path d="M9 5v14M15 5v14"/>'};
const root=document.createElement('div');root.id='touch';
const jb=document.createElement('div');jb.id='jb';jb.innerHTML='<div id="jt"></div>';root.appendChild(jb);
const jt=jb.firstChild,JS=window.JS;
const bind=(el,dn,up)=>{el.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();el.classList.add('on');dn&&dn()},{passive:false});['touchend','touchcancel'].forEach(t=>el.addEventListener(t,e=>{e.preventDefault();e.stopPropagation();el.classList.remove('on');up&&up()},{passive:false}))};
const mk=(id,size,r,b,dn,up)=>{const e=document.createElement('div');e.className='tb';e.id=id;e.style.cssText='width:'+size+'px;height:'+size+'px;'+(r<0?'left:'+(-r)+'px;':'right:'+r+'px;')+(b<0?'top:'+(-b)+'px':'bottom:'+b+'px');e.innerHTML='<svg viewBox="0 0 24 24">'+ic[id]+'</svg>';bind(e,dn,up);root.appendChild(e)};
mk('fire',104,28,64,()=>G.fire(true),()=>G.fire(false));
{const fe=root.querySelector('#fire');let fp=[0,0];
fe.addEventListener('touchstart',e=>{const t=e.changedTouches[0];fp=[t.clientX,t.clientY]},{passive:false});
fe.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){G.look(t.clientX-fp[0],t.clientY-fp[1]);fp=[t.clientX,t.clientY]}},{passive:false})}
mk('jump',72,150,34,()=>G.K.Space=true,()=>G.K.Space=false);
mk('reload',60,166,122,()=>G.reload());
mk('crouch',62,34,184,()=>G.K.KeyC=!G.K.KeyC);
mk('swap',56,108,214,()=>G.cyc());
mk('scope',56,246,66,()=>G.zoom());
mk('pause',46,-12,-12,()=>G.pause());
let jid=null,lid=null,jo,lp;
root.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches){
if(t.clientX<innerWidth*.45&&jid===null){jid=t.identifier;jo=[t.clientX,t.clientY];jb.style.display='block';jb.style.left=t.clientX-66+'px';jb.style.top=t.clientY-66+'px'}
else if(lid===null){lid=t.identifier;lp=[t.clientX,t.clientY]}}},{passive:false});
root.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){
if(t.identifier===jid){let dx=(t.clientX-jo[0])/50,dy=(t.clientY-jo[1])/50;const m=Math.hypot(dx,dy);G.K.ShiftLeft=m>1.35;if(m>1){dx/=m;dy/=m}JS.x=dx;JS.y=-dy;jt.style.transform='translate('+dx*50+'px,'+dy*50+'px)'}
else if(t.identifier===lid){G.look(t.clientX-lp[0],t.clientY-lp[1]);lp=[t.clientX,t.clientY]}}},{passive:false});
const end=e=>{for(const t of e.changedTouches){
if(t.identifier===jid){jid=null;JS.x=JS.y=0;G.K.ShiftLeft=false;jb.style.display='none';jt.style.transform=''}
else if(t.identifier===lid)lid=null}};
root.addEventListener('touchend',end);root.addEventListener('touchcancel',end);
document.body.appendChild(root);
setInterval(()=>root.style.display=G.locked()?'block':'none',150);
})();

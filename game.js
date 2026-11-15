(()=>{
const $=s=>document.querySelector(s),Q=Math.PI/2,P=window.PokiSDK;
const pk=async f=>{try{if(P)await P[f]()}catch(e){}};
try{P&&P.init().then(()=>P.gameLoadingFinished()).catch(()=>{})}catch(e){}
const PFX='vortexstrike-v1-room-',MAX=6,clean=s=>String(s||'Player').replace(/[^\w \-]/g,'').slice(0,14)||'Player';
const st=t=>$('#status').textContent=t;

// ---------- scene ----------
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0xbfa58f);S.fog=new THREE.Fog(0xc4ab98,40,150);
const C=new THREE.PerspectiveCamera(80,innerWidth/innerHeight,.1,200);S.add(C);
S.add(new THREE.HemisphereLight(0xbcd0ff,0x6b5a4a,.9));
const sun=new THREE.DirectionalLight(0xffd9a8,.9);sun.position.set(-40,45,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,far:160});sun.shadow.bias=-.0004;S.add(sun);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(104,104),new THREE.MeshLambertMaterial({color:0x4b4e54}));fl.rotation.x=-Q;fl.receiveShadow=true;S.add(fl);
const gr=new THREE.GridHelper(104,52,0x000000,0x000000);gr.material.transparent=true;gr.material.opacity=.14;gr.position.y=.01;S.add(gr);
const rng=(a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(7);
const B=[],bm=[];
const addB=(x,z,w,h,d,c)=>{B.push({x,z,w,h,d});const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),(typeof c==='object'?c:new THREE.MeshLambertMaterial({color:c})));m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;S.add(m);bm.push(m)};
[[0,-51,104,8,2],[0,51,104,8,2],[-51,0,2,8,104],[51,0,2,8,104]].forEach(a=>addB(a[0],a[1],a[2],a[3],a[4],0xcfc6b0));
buildMap(addB,S,rng);
const fl2=new THREE.Mesh(new THREE.PlaneGeometry(.35,.35),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.9,depthTest:false}));fl2.visible=false;C.add(fl2);const gun=new THREE.Group();gun.position.set(.34,-.3,-.65);gun.rotation.y=.12;C.add(gun);

// ---------- state ----------
const me={ch:1.6,x:0,y:0,z:0,vy:0,w:0,p:0,hp:100,k:0,d:0,g:true,dead:false,n:'Player'};
const K={},pl={};let lock=false,down=false,last=0,net=null,myId='',tick=0,bt=0;
let AC;const ac=()=>AC=AC||new(window.AudioContext||window.webkitAudioContext)();
const beep=(f,d)=>{if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d)};

function spawn(){for(let i=0;i<40;i++){me.x=(Math.random()-.5)*80;me.z=(Math.random()-.5)*80;if(B.every(b=>Math.abs(me.x-b.x)>b.w/2+1.2&&Math.abs(me.z-b.z)>b.d/2+1.2))break}
me.y=0;me.vy=0;me.hp=100;me.dead=false;me.w=Math.random()*6.28;me.p=0;refill()}
function collide(py){const r=.4;me.g=false;
if(me.y<=0){me.y=0;me.vy=0;me.g=true}
for(const b of B){const dx=me.x-b.x,dz=me.z-b.z,ox=b.w/2+r-Math.abs(dx),oz=b.d/2+r-Math.abs(dz);
if(ox<=0||oz<=0||me.y>=b.h)continue;
if(py>=b.h-.05){me.y=b.h;me.vy=0;me.g=true}
else if(ox<oz)me.x+=dx>0?ox:-ox;else me.z+=dz>0?oz:-oz}}

// ---------- remote players ----------
function mk(id,name){const h=[...id].reduce((a,c)=>(a*31+c.charCodeAt(0))%360,0),g=makeSoldier(new THREE.Color().setHSL(h/360,.45,.42).getHex()),n=clean(name),sp=labelSprite(n);
sp.position.y=2.15;g.add(sp);g.userData.pid=id;g.position.set(0,-99,0);S.add(g);
return{m:g,n,x:0,y:0,z:0,w:0,hp:100,k:0,d:0,g:'akm',seen:performance.now(),init:false}}
function rm(id){const o=pl[id];if(o){S.remove(o.m);delete pl[id]}}

// ---------- networking ----------
function send(d){if(!net)return;d.i=myId;if(net.host)net.conns.forEach(c=>c.open&&c.send(d));else if(net.hc.open)net.hc.send(d)}
function recv(d,from){if(!net||!d)return;if(net.host&&from){d.i=from.peer;net.conns.forEach(c=>c!==from&&c.open&&c.send(d))}handle(d)}
const nm=id=>id===myId?'You':(pl[id]?pl[id].n:'?');
function feed(t){const f=$('#feed'),e=document.createElement('div');e.textContent=t;f.appendChild(e);if(f.children.length>5)f.firstChild.remove();setTimeout(()=>e.remove(),4500)}
function handle(d){
if(d.t==='p'){let q=pl[d.i];if(!q)q=pl[d.i]=mk(d.i,d.n);Object.assign(q,{x:d.x,y:d.y,z:d.z,w:d.w,hp:d.hp,k:d.k,d:d.d,g:d.g,c:d.c,seen:performance.now()});if(!q.init){q.init=true;q.m.position.set(d.x,d.y,d.z)}}
else if(d.t==='h'){if(d.to===myId&&!me.dead){me.hp-=d.d;$('#dmg').style.opacity=.7;setTimeout(()=>$('#dmg').style.opacity=0,200);beep(110,.15);if(me.hp<=0)die(d.i)}}
else if(d.t==='k'){feed(nm(d.by)+'  ➜  '+nm(d.to))}
else if(d.t==='s')tracer(new THREE.Vector3(...d.a),new THREE.Vector3(...d.b));
else if(d.t==='x')rm(d.id)}
function die(by){me.dead=true;me.d++;me.hp=0;handle({t:'k',by,to:myId});send({t:'k',by,to:myId});$('#death').style.display='block';
setTimeout(()=>{if(net){spawn();$('#death').style.display='none'}},2500)}

const claim=id=>new Promise(r=>{let ok=false;const p=new Peer(id);p.on('open',()=>{ok=true;r(p)});p.on('error',()=>{if(!ok){p.destroy();r(null)}});setTimeout(()=>{if(!ok){p.destroy();r(null)}},8000)});
const mkPeer=()=>new Promise(r=>{const p=new Peer();p.on('open',()=>r(p));p.on('error',()=>r(null));setTimeout(()=>r(null),8000)});
const join=(p,id)=>new Promise(res=>{let done=false;const fin=v=>{if(!done){done=true;res(v)}};
const c=p.connect(id,{reliable:true});
p.on('error',e=>{if(e.type==='peer-unavailable')fin(null)});
c.on('data',d=>{if(d.t==='welcome')fin(c);else if(d.t==='full')fin(null);else recv(d)});
c.on('error',()=>fin(null));c.on('close',()=>{fin(null);if(net&&net.hc===c)leave('Host disconnected.')});
setTimeout(()=>fin(null),6000)});

async function find(){let cl=null;
for(let i=0;i<8;i++){const id=PFX+i;st('Searching rooms… ('+(i+1)+'/8)');
const hp=await claim(id);
if(hp){hp.on('connection',c=>{
c.on('open',()=>{if(!net)return;if(net.conns.length>=MAX-1){c.send({t:'full'});setTimeout(()=>c.close(),400);return}net.conns.push(c);c.send({t:'welcome'});feed('A player joined')});
c.on('data',d=>recv(d,c));
c.on('close',()=>{if(!net||!net.conns.includes(c))return;net.conns=net.conns.filter(x=>x!==c);rm(c.peer);net.conns.forEach(x=>x.open&&x.send({t:'x',id:c.peer}))})});
net={host:true,peer:hp,conns:[]};myId=id;enter('Room '+(i+1)+' · hosting');return}
if(!cl)cl=await mkPeer();if(!cl)return;
const c=await join(cl,id);
if(c){net={host:false,peer:cl,hc:c};myId=cl.id;enter('Room '+(i+1)+' · connected');return}}}

function enter(label){t0=performance.now();me.k=me.d=0;me.n=clean($('#name').value)||me.n;spawn();$('#menu').style.display='none';$('#hud').style.display='block';$('#pause').style.display='flex';$('#room').textContent=label;$('#death').style.display='none'}
function leave(msg){if(!net)return;const n=net;net=null;try{if(!n.host)n.hc.close();n.peer.destroy()}catch(e){}
for(const id in pl)rm(id);$('#feed').innerHTML='';document.exitPointerLock();
$('#pause').style.display='none';$('#hud').style.display='none';$('#menu').style.display='flex';$('#find').disabled=false;st(msg||'');pk('gameplayStop')}

$('#find').onclick=async()=>{const n=clean($('#name').value.trim()||('Player'+(100+Math.random()*900|0)));$('#name').value=n;me.n=n;
$('#find').disabled=true;st('Connecting…');ac();await pk('commercialBreak');
try{await find()}catch(e){}
if(!net){st('No match found. Check your connection and try again.');$('#find').disabled=false}};
$('#play').onclick=()=>{ac();R.domElement.requestPointerLock()};
$('#leave').onclick=()=>leave('You left the match.');

// ---------- combat ----------
function tracer(a,b){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:0xffee88}));S.add(l);setTimeout(()=>{S.remove(l);l.geometry.dispose()},70)}
const rc=new THREE.Raycaster();rc.far=90;
const LD={0:'akm',1:'glock',2:'knife'},AM={},TARGET=30,NS=['PRIMARY','PISTOL','MELEE'];let slot=0,rl=0,zoom=false,fresh=false,t0=0,ls=0;
const cw=()=>W[LD[slot]];
function refill(){for(const k in LD){const w=W[LD[k]];AM[LD[k]]={m:w.mag,r:w.res}}slot=0;rl=0;setGun(gun,LD[0],.85,1);document.querySelectorAll('.sl').forEach((e,i)=>e.textContent=(i+1)+'  '+W[LD[i]].n)}
function sw(i){if(i===slot||me.dead)return;slot=i;rl=0;setGun(gun,LD[i],.85,1)}
function reload(){const w=cw(),a=AM[w.id];if(rl||!w.mag||a.m>=w.mag||a.r<=0)return;rl=performance.now()+w.rl;beep(180,.2)}
function shoot(){const t=performance.now(),w=cw(),a=AM[w.id];if(t-last<w.rate||me.dead||rl)return;
if(!w.auto){if(!fresh)return;fresh=false}
if(w.mag){if(a.m<=0){reload();return}a.m--}
last=t;gun.position.z=-.5;if(w.mag){fl2.position.set(.38,-.24,slot===1?-1.0:-1.45);fl2.rotation.z=Math.random()*6;fl2.visible=true;setTimeout(()=>fl2.visible=false,45)}beep(w.f,.07);C.updateMatrixWorld();
rc.far=w.range||90;const dm={},o0=C.localToWorld(new THREE.Vector3(.3,-.25,-1));
for(let i=0;i<(w.pel||1);i++){rc.setFromCamera({x:(Math.random()-.5)*w.spr*2,y:(Math.random()-.5)*w.spr*2},C);
const hit=rc.intersectObjects([...bm,...Object.values(pl).filter(o=>o.hp>0).map(o=>o.m)],true)[0],end=hit?hit.point:rc.ray.at(rc.far,new THREE.Vector3());
if(w.mag&&i<3){tracer(o0,end);if(!i)send({t:'s',a:o0.toArray(),b:end.toArray()})}
if(hit){let o=hit.object;const hd=o.userData.head?2:1;while(o&&o.userData.pid===undefined)o=o.parent;if(o)dm[o.userData.pid]=(dm[o.userData.pid]||0)+w.dmg*hd}}
for(const id in dm){send({t:'h',to:id,d:dm[id]});const cx=$('#cx');cx.classList.add('hit');setTimeout(()=>cx.classList.remove('hit'),120);const q=pl[id];if(q&&q.hp-dm[id]<=0)me.k++}
if(w.mag&&a.m<=0)setTimeout(reload,150)}
function hud(dt){const w=cw(),a=AM[w.id];C.fov+=((zoom&&w.zoom?80/w.zoom:80)-C.fov)*Math.min(1,dt*14);C.updateProjectionMatrix();
if(rl&&performance.now()>rl){rl=0;const n=Math.min(w.mag-a.m,a.r);a.m+=n;a.r-=n}
const s=(performance.now()-t0)/1000|0;$('#kl').textContent=me.k;$('#tm').textContent=String(s/60|0).padStart(2,0)+':'+String(s%60).padStart(2,0);
$('#am').innerHTML=w.mag?a.m+'<small>/'+a.r+'</small>':'';$('#wn').textContent=rl?'RELOADING…':w.n;$('#scope').style.display=zoom&&w.zoom?'block':'none';
document.querySelectorAll('.sl').forEach((e,i)=>e.classList.toggle('on',i===slot))}
addEventListener('keydown',e=>{if(!lock)return;if(e.code==='KeyR')reload();const i=['Digit1','Digit2','Digit3'].indexOf(e.code);if(i>=0)sw(i)});
addEventListener('mousedown',e=>{if(!lock)return;if(e.button===0)fresh=true;if(e.button===2)zoom=true});
addEventListener('mouseup',e=>{if(e.button===2)zoom=false});
// lobby soldier + loadout
const lob=makeSoldier(0xb5651d);S.add(lob);setGun(lob.userData.hold,LD[0],.8);
let lab=null;const setLab=()=>{if(lab)lob.remove(lab);lab=labelSprite(clean($('#name').value)||'Player');lab.position.y=2.15;lob.add(lab)};setLab();$('#name').oninput=setLab;
function drawLo(){const L=$('#lslots'),G=$('#grid');L.innerHTML='';G.innerHTML='';
NS.forEach((n,i)=>{const d=document.createElement('div');d.className='ls'+(i===ls?' on':'');d.innerHTML='<small>'+n+'</small><img src="'+thumb(LD[i])+'">';d.onclick=()=>{ls=i;drawLo()};L.appendChild(d)});
Object.keys(W).filter(k=>W[k].s===ls).forEach(k=>{const w=W[k],d=document.createElement('div');d.className='gc'+(LD[ls]===k?' on':'');
d.innerHTML='<b>'+w.n+'</b><img src="'+thumb(k)+'"><i style="width:'+Math.min(100,w.dmg*(w.pel||1)/1.2)+'%"></i>';
d.onclick=()=>{LD[ls]=k;if(!ls)setGun(lob.userData.hold,k,.8);drawLo()};G.appendChild(d)})}
$('#lbtn').onclick=()=>{$('#lo').style.display='flex';drawLo()};$('#lok').onclick=()=>$('#lo').style.display='none';

// ---------- input ----------
addEventListener('mousemove',e=>{if(!lock)return;me.w-=e.movementX*.0022;me.p=Math.max(-1.5,Math.min(1.5,me.p-e.movementY*.0022))});
addEventListener('mousedown',e=>{if(lock&&e.button===0)down=true});addEventListener('mouseup',()=>down=false);
addEventListener('keydown',e=>{K[e.code]=true;if(lock&&['Space','ArrowUp','ArrowDown','Tab'].includes(e.code))e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=false);
addEventListener('blur',()=>{for(const k in K)K[k]=false;down=false});
addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{lock=document.pointerLockElement===R.domElement;if(net){$('#pause').style.display=lock?'none':'flex';pk(lock?'gameplayStart':'gameplayStop')}});
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()});

// ---------- loop ----------
function update(dt,t){
const f=(K.KeyW?1:0)-(K.KeyS?1:0),s=(K.KeyD?1:0)-(K.KeyA?1:0),l=Math.hypot(f,s)||1,sp=((K.ControlLeft||K.KeyC)?3.5:K.ShiftLeft?10:7)*dt;
if(lock&&!me.dead){me.x+=(-Math.sin(me.w)*f+Math.cos(me.w)*s)/l*sp;me.z+=(-Math.cos(me.w)*f-Math.sin(me.w)*s)/l*sp;
if(K.Space&&me.g){me.vy=8.5;me.g=false}if(down)shoot()}
const py=me.y;me.vy-=24*dt;me.y+=me.vy*dt;collide(py);
me.x=Math.max(-49.4,Math.min(49.4,me.x));me.z=Math.max(-49.4,Math.min(49.4,me.z));
const ct=me.dead?.4:(K.ControlLeft||K.KeyC)?1.0:1.6;me.ch+=(ct-me.ch)*Math.min(1,dt*14);C.position.set(me.x,me.y+me.ch,me.z);C.rotation.set(me.p,me.w,0,'YXZ');
gun.position.z+=(-.65-gun.position.z)*Math.min(1,dt*15);gun.visible=!me.dead&&!zoom;gun.position.y=-.3+((lock&&me.g&&(K.KeyW||K.KeyA||K.KeyS||K.KeyD))?Math.sin(performance.now()*.011)*.012:0);hud(dt);
const now=performance.now(),a=Math.min(1,dt*14);
for(const id in pl){const o=pl[id];if(now-o.seen>4000){rm(id);continue}const m=o.m;
m.position.x+=(o.x-m.position.x)*a;m.position.y+=(o.y-m.position.y)*a;m.position.z+=(o.z-m.position.z)*a;m.rotation.y=o.w;m.visible=o.hp>0;m.scale.y+=((o.c?.75:1)-m.scale.y)*a;if(o.cg!==o.g){o.cg=o.g;setGun(m.userData.hold,o.g,.8)}}
tick+=dt;if(tick>.05){tick=0;send({t:'p',x:me.x,y:me.y,z:me.z,w:me.w,hp:me.hp,k:me.k,d:me.d,n:me.n,g:cw().id,c:me.ch<1.3?1:0})}
$('#hpb b').style.width=Math.max(0,me.hp)+'%';$('#hpb b').style.background=me.hp>50?'#42e08a':me.hp>25?'#ffc542':'#ff4a3a';$('#hpt').textContent='HP '+Math.max(0,me.hp);
bt+=dt;if(bt>.5){bt=0;const all=[{n:me.n+' (you)',k:me.k,d:me.d},...Object.values(pl)].sort((x,y)=>y.k-x.k),b=$('#board');if(all[0].k>=TARGET){feed(all[0].n+' wins the round!');me.k=me.d=0}b.innerHTML='<h4>Kills / Deaths</h4>';
all.forEach(o=>{const r=document.createElement('div'),a=document.createElement('b'),c=document.createElement('span');a.textContent=o.n;c.textContent=o.k+' / '+o.d;r.append(a,c);b.appendChild(r)})}}
let lt=performance.now();
(function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-lt)/1000);lt=t;
lob.visible=!net;if(net)update(dt,t);else{C.fov=60;C.updateProjectionMatrix();C.position.set(Math.sin(t/4000)*.25,1.5,3.9);C.lookAt(0,1.15,0);lob.rotation.y=Math.sin(t/1800)*.3}
R.render(S,C)})(lt);
})();

(()=>{
const $=s=>document.querySelector(s),Q=Math.PI/2,P=window.PokiSDK;
const pk=async f=>{try{if(P)await P[f]()}catch(e){}};
try{P&&P.init().then(()=>P.gameLoadingFinished()).catch(()=>{})}catch(e){}
const PFX='vortexstrike-v1-room-',MAX=6,clean=s=>String(s||'Player').replace(/[^\w \-]/g,'').slice(0,14)||'Player';
const st=t=>$('#status').textContent=t;

// ---------- scene ----------
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x7fb2ff);S.fog=new THREE.Fog(0x7fb2ff,35,130);
const C=new THREE.PerspectiveCamera(80,innerWidth/innerHeight,.1,200);S.add(C);
S.add(new THREE.HemisphereLight(0xffffff,0x4a5a66,.95));
const sun=new THREE.DirectionalLight(0xffffff,.6);sun.position.set(30,50,20);S.add(sun);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(104,104),new THREE.MeshLambertMaterial({color:0x5f8a55}));fl.rotation.x=-Q;S.add(fl);
const gr=new THREE.GridHelper(104,52,0x000000,0x000000);gr.material.transparent=true;gr.material.opacity=.14;gr.position.y=.01;S.add(gr);
const rng=(a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(7);
const B=[],bm=[];
const addB=(x,z,w,h,d,c)=>{B.push({x,z,w,h,d});const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,h/2,z);S.add(m);bm.push(m)};
[[0,-51,104,8,2],[0,51,104,8,2],[-51,0,2,8,104],[51,0,2,8,104]].forEach(a=>addB(a[0],a[1],a[2],a[3],a[4],0x2b3350));
for(let i=0;i<36;i++){const h=[1,1,2,3,4,6][i%6],x=(rng()-.5)*88,z=(rng()-.5)*88,w=3+rng()*6,d=3+rng()*6;addB(x,z,w,h,d,new THREE.Color().setHSL(rng(),.5,.52).getHex())}
const gun=new THREE.Mesh(new THREE.BoxGeometry(.12,.14,.7),new THREE.MeshLambertMaterial({color:0x222831}));gun.position.set(.3,-.28,-.65);C.add(gun);

// ---------- state ----------
const me={x:0,y:0,z:0,vy:0,w:0,p:0,hp:100,k:0,d:0,g:true,dead:false,n:'Player'};
const K={},pl={};let lock=false,down=false,last=0,net=null,myId='',tick=0,bt=0;
let AC;const ac=()=>AC=AC||new(window.AudioContext||window.webkitAudioContext)();
const beep=(f,d)=>{if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d)};

function spawn(){for(let i=0;i<40;i++){me.x=(Math.random()-.5)*80;me.z=(Math.random()-.5)*80;if(B.every(b=>Math.abs(me.x-b.x)>b.w/2+1.2&&Math.abs(me.z-b.z)>b.d/2+1.2))break}
me.y=0;me.vy=0;me.hp=100;me.dead=false;me.w=Math.random()*6.28;me.p=0}
function collide(py){const r=.4;me.g=false;
if(me.y<=0){me.y=0;me.vy=0;me.g=true}
for(const b of B){const dx=me.x-b.x,dz=me.z-b.z,ox=b.w/2+r-Math.abs(dx),oz=b.d/2+r-Math.abs(dz);
if(ox<=0||oz<=0||me.y>=b.h)continue;
if(py>=b.h-.05){me.y=b.h;me.vy=0;me.g=true}
else if(ox<oz)me.x+=dx>0?ox:-ox;else me.z+=dz>0?oz:-oz}}

// ---------- remote players ----------
function mk(id,name){const g=new THREE.Group(),n=clean(name);let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%360;
const col=new THREE.Color().setHSL(h/360,.75,.5);
const b=new THREE.Mesh(new THREE.BoxGeometry(.7,1.1,.4),new THREE.MeshLambertMaterial({color:col}));b.position.y=.65;
const hd=new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.4),new THREE.MeshLambertMaterial({color:0xffd7b0}));hd.position.y=1.5;
const gn=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.6),new THREE.MeshLambertMaterial({color:0x222222}));gn.position.set(.35,.9,-.35);
const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d');x.font='bold 34px sans-serif';x.textAlign='center';x.lineWidth=6;x.strokeStyle='#000';x.fillStyle='#fff';x.strokeText(n,128,44);x.fillText(n,128,44);
const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));sp.scale.set(2,.5,1);sp.position.y=2.15;
g.add(b,hd,gn,sp);g.userData.pid=id;g.position.set(0,-99,0);S.add(g);
return{m:g,n,x:0,y:0,z:0,w:0,hp:100,k:0,d:0,seen:performance.now(),init:false}}
function rm(id){const o=pl[id];if(o){S.remove(o.m);delete pl[id]}}

// ---------- networking ----------
function send(d){if(!net)return;d.i=myId;if(net.host)net.conns.forEach(c=>c.open&&c.send(d));else if(net.hc.open)net.hc.send(d)}
function recv(d,from){if(!net||!d)return;if(net.host&&from){d.i=from.peer;net.conns.forEach(c=>c!==from&&c.open&&c.send(d))}handle(d)}
const nm=id=>id===myId?'You':(pl[id]?pl[id].n:'?');
function feed(t){const f=$('#feed'),e=document.createElement('div');e.textContent=t;f.appendChild(e);if(f.children.length>5)f.firstChild.remove();setTimeout(()=>e.remove(),4500)}
function handle(d){
if(d.t==='p'){let q=pl[d.i];if(!q)q=pl[d.i]=mk(d.i,d.n);Object.assign(q,{x:d.x,y:d.y,z:d.z,w:d.w,hp:d.hp,k:d.k,d:d.d,seen:performance.now()});if(!q.init){q.init=true;q.m.position.set(d.x,d.y,d.z)}}
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

function enter(label){me.k=me.d=0;me.n=clean($('#name').value)||me.n;spawn();$('#menu').style.display='none';$('#hud').style.display='block';$('#pause').style.display='flex';$('#room').textContent=label;$('#death').style.display='none'}
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
function shoot(){const t=performance.now();if(t-last<140||me.dead)return;last=t;gun.position.z=-.5;beep(300,.06);
C.updateMatrixWorld();rc.setFromCamera({x:0,y:0},C);
const hit=rc.intersectObjects([...bm,...Object.values(pl).filter(o=>o.hp>0).map(o=>o.m)],true)[0];
const end=hit?hit.point:rc.ray.at(90,new THREE.Vector3()),st0=C.localToWorld(new THREE.Vector3(.3,-.25,-1));
tracer(st0,end);send({t:'s',a:st0.toArray(),b:end.toArray()});
if(hit){let o=hit.object;while(o&&o.userData.pid===undefined)o=o.parent;
if(o){send({t:'h',to:o.userData.pid,d:20});const cx=$('#cx');cx.classList.add('hit');setTimeout(()=>cx.classList.remove('hit'),120);
const q=pl[o.userData.pid];if(q&&q.hp-20<=0)me.k++}}}

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
const f=(K.KeyW?1:0)-(K.KeyS?1:0),s=(K.KeyD?1:0)-(K.KeyA?1:0),l=Math.hypot(f,s)||1,sp=(K.ShiftLeft?10:7)*dt;
if(lock&&!me.dead){me.x+=(-Math.sin(me.w)*f+Math.cos(me.w)*s)/l*sp;me.z+=(-Math.cos(me.w)*f-Math.sin(me.w)*s)/l*sp;
if(K.Space&&me.g){me.vy=8.5;me.g=false}if(down)shoot()}
const py=me.y;me.vy-=24*dt;me.y+=me.vy*dt;collide(py);
me.x=Math.max(-49.4,Math.min(49.4,me.x));me.z=Math.max(-49.4,Math.min(49.4,me.z));
C.position.set(me.x,me.y+(me.dead?.4:1.6),me.z);C.rotation.set(me.p,me.w,0,'YXZ');
gun.position.z+=(-.65-gun.position.z)*Math.min(1,dt*15);gun.visible=!me.dead;
const now=performance.now(),a=Math.min(1,dt*14);
for(const id in pl){const o=pl[id];if(now-o.seen>4000){rm(id);continue}const m=o.m;
m.position.x+=(o.x-m.position.x)*a;m.position.y+=(o.y-m.position.y)*a;m.position.z+=(o.z-m.position.z)*a;m.rotation.y=o.w;m.visible=o.hp>0}
tick+=dt;if(tick>.05){tick=0;send({t:'p',x:me.x,y:me.y,z:me.z,w:me.w,hp:me.hp,k:me.k,d:me.d,n:me.n})}
$('#hpb b').style.width=Math.max(0,me.hp)+'%';$('#hpb b').style.background=me.hp>50?'#42e08a':me.hp>25?'#ffc542':'#ff4a3a';$('#hpt').textContent='HP '+Math.max(0,me.hp);
bt+=dt;if(bt>.5){bt=0;const all=[{n:me.n+' (you)',k:me.k,d:me.d},...Object.values(pl)].sort((x,y)=>y.k-x.k),b=$('#board');b.innerHTML='<h4>Kills / Deaths</h4>';
all.forEach(o=>{const r=document.createElement('div'),a=document.createElement('b'),c=document.createElement('span');a.textContent=o.n;c.textContent=o.k+' / '+o.d;r.append(a,c);b.appendChild(r)})}}
let lt=performance.now();
(function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-lt)/1000);lt=t;
if(net)update(dt,t);else{C.position.set(Math.cos(t/7000)*42,16,Math.sin(t/7000)*42);C.lookAt(0,0,0)}
R.render(S,C)})(lt);
})();

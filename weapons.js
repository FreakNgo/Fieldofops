(()=>{
const M=0x4d5c9a,D=0x2b2f45,K=0x1b1d24,Wd=0xb5622a,Gr=0x3d7a4d,Tn=0xb98a52,Sk=0xd08a4e,Sl=0xa05f2c,LN=0x6ad0e8;
const tx=f=>{const c=document.createElement('canvas');c.width=c.height=64;f(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t};
const metal=tx(x=>{x.fillStyle='#e4e4ec';x.fillRect(0,0,64,64);for(let i=0;i<260;i++){x.fillStyle='rgba(0,0,0,'+Math.random()*.2+')';x.fillRect(Math.random()*64,Math.random()*64,1+Math.random()*7,1)}for(let i=0;i<24;i++){x.fillStyle='rgba(255,255,255,.3)';x.fillRect(Math.random()*64,Math.random()*64,7,1)}});
const wood=tx(x=>{x.fillStyle='#fff';x.fillRect(0,0,64,64);for(let i=0;i<44;i++){x.fillStyle='rgba(60,25,5,'+(.1+Math.random()*.28)+')';x.fillRect(0,Math.random()*64,64,1)}});
const MC={},mat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:c,map:c===Wd?wood:metal}));
const bx=(g,w,h,d,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
const cy=(g,r,l,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10),mat(c));m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
// part: [w,h,d,x,y,z,color,opt] opt: 'c' = cylinder (w=radius,d=length), number = tilt
window.W={
akm:{n:'AKM',s:0,ads:[0,-.15,-.55],ds:1.4,dmg:28,rate:100,mag:30,res:90,rl:2200,auto:1,spr:.012,f:260,p:[[.07,.1,.42,0,0,0,M],[.06,.03,.4,0,.065,.02,D],[.017,0,.5,0,.015,-.46,D,'c'],[.014,0,.32,0,.062,-.3,M,'c'],[.075,.075,.3,0,-.005,-.27,Wd],[.07,.025,.3,0,.04,-.27,Wd],[.012,.05,.012,0,.07,-.55,D],[.024,0,.06,0,.015,-.74,K,'c'],[.055,.12,.3,0,-.035,.4,Wd],[.045,.13,.05,0,-.11,.17,Wd,.3],[.05,.22,.09,0,-.16,-.06,M,.25]]},
awm:{n:'AWM',s:0,dmg:110,rate:1300,mag:5,res:20,rl:2800,auto:0,spr:0,f:150,zoom:3.5,p:[[.075,.11,.75,0,0,0,Gr],[.02,0,.75,0,.02,-.7,K,'c'],[.03,0,.1,0,.02,-1.1,K,'c'],[.07,.15,.4,0,-.03,.55,Gr],[.07,.04,.2,0,.08,.55,K],[.032,0,.4,0,.14,-.05,K,'c'],[.04,0,.08,0,.14,-.28,K,'c'],[.034,0,.01,0,.14,-.325,LN,'c'],[.036,0,.06,0,.14,.17,K,'c'],[.03,.05,.03,0,.1,.05,M],[.03,.05,.03,0,.1,-.15,M],[.045,.08,.12,0,-.1,0,M],[.025,.025,.1,.07,.04,.15,M]]},
mossberg:{n:'Mossberg',s:0,shell:1,ads:[0,-.13,-.5],ds:1.25,dmg:14,pel:8,rate:800,mag:8,res:32,rl:2600,auto:0,spr:.07,range:40,f:110,p:[[.065,.09,.3,0,0,.1,D],[.022,0,.8,0,.025,-.5,K,'c'],[.018,0,.7,0,-.025,-.45,M,'c'],[.075,.06,.22,0,-.04,-.3,Wd],[.05,.11,.35,0,-.03,.45,Wd],[.01,.02,.01,0,.05,-.9,0xffcc00],[.04,.02,.1,0,-.06,.12,D]]},
mp5:{n:'MP5',s:0,ads:[0,-.14,-.5],ds:1.3,dmg:17,rate:70,mag:30,res:120,rl:1800,auto:1,spr:.025,f:340,p:[[.065,.095,.38,0,0,0,K],[.075,.07,.2,0,-.01,-.26,K],[.014,0,.15,0,.015,-.42,M,'c'],[.04,.05,.01,0,.04,-.48,K],[.04,.26,.06,0,-.17,-.12,K,-.12],[.04,.12,.05,0,-.1,.12,K,.25],[.04,.08,.22,0,0,.3,M],[.04,.1,.02,0,0,.42,K],[.02,.03,.02,0,.065,.1,K]]},
scar:{n:'M4A1',s:0,ads:[0,-.2,-.55],ds:1.4,dmg:24,rate:85,mag:20,res:100,rl:2000,auto:1,spr:.01,f:230,p:[[.075,.11,.5,0,0,0,Tn],[.018,0,.4,0,.02,-.4,D,'c'],[.08,.085,.3,0,0,-.3,Tn],[.022,0,.08,0,.02,-.63,K,'c'],[.04,.015,.5,0,.065,-.05,K],[.05,.06,.14,0,.1,-.03,K],[.04,.04,.01,0,.1,-.11,0xe84040],[.06,.13,.3,0,-.03,.4,Tn],[.045,.13,.05,0,-.11,.17,K,.3],[.05,.17,.09,0,-.13,-.02,K,.1]]},
glock:{n:'Glock',s:1,ads:[0,-.11,-.5],ds:1.25,dmg:20,rate:220,mag:15,res:60,rl:1400,auto:0,spr:.008,f:400,p:[[.04,.055,.3,0,.035,-.05,K],[.045,.035,.26,0,-.005,-.05,D],[.042,.14,.075,0,-.08,.06,D,-.2],[.03,.02,.07,0,-.035,-.08,D],[.012,0,.03,0,.035,-.21,M,'c'],[.01,.012,.01,0,.068,.08,0xffffff]]},
knife:{n:'Knife',s:2,dmg:55,rate:450,mag:0,res:0,rl:0,auto:0,spr:0,range:2.8,f:90,p:[[.012,.06,.32,0,.02,-.28,0xd5dbe3],[.01,.03,.07,0,.035,-.47,0xd5dbe3],[.016,.012,.3,0,.055,-.27,0x8a929c],[.04,.07,.015,0,0,-.11,D],[.03,.045,.14,0,-.01,-.03,0x1c1c1c],[.035,.05,.02,0,-.01,.05,M]]}
};
for(const k in W)W[k].id=k;
const GL=THREE.GLTFLoader?new THREE.GLTFLoader():null,MODELS={},LEN={akm:1.05,awm:1.5,mossberg:1.25,mp5:.7,scar:1.2,glock:.32,knife:.36},TINT={scar:0x353a44};
function fit(root,L,k){root.updateMatrixWorld(true);const pts=[],v=new THREE.Vector3();
root.traverse(o=>{if(o.isMesh){o.castShadow=true;if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();const cl=o.material.color,wh=cl&&cl.r>.9&&cl.g>.9&&cl.b>.9&&!o.material.map;o.material=new THREE.MeshLambertMaterial({color:wh?(TINT[k]||0x3a3f4a):(cl||0xffffff),map:o.material.map||null,side:THREE.DoubleSide});const a=o.geometry.attributes.position,st=Math.max(1,a.count/400|0);for(let i=0;i<a.count;i+=st)pts.push(v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld).clone())}});
const bb=new THREE.Box3().setFromPoints(pts),sz=bb.getSize(new THREE.Vector3()),ct=bb.getCenter(new THREE.Vector3()),c=new THREE.Vector3();pts.forEach(p=>c.add(p));c.divideScalar(pts.length);
const ax=['x','y','z'].sort((a,b)=>sz[b]-sz[a]),lg=ax[0],up=ax[1],zv=new THREE.Vector3(),yv=new THREE.Vector3();
zv[lg]=c[lg]>ct[lg]?1:-1;yv[up]=c[up]>ct[up]?1:-1;
const xv=new THREE.Vector3().crossVectors(yv,zv),basis=new THREE.Matrix4().makeBasis(xv,yv,zv).invert();
const piv=new THREE.Group();piv.add(root);root.position.sub(ct);
const rot=new THREE.Group();rot.add(piv);rot.quaternion.setFromRotationMatrix(basis);rot.scale.setScalar(L/sz[lg]);
const out=new THREE.Group();out.add(rot);out.position.z=-.05;return out}
window.loadModels=()=>{if(!GL)return;for(const k in W)if(k!=='knife')GL.load('models/'+k+'.glb',g=>{try{MODELS[k]=fit(g.scene,LEN[k]||1,k);window.onModel&&onModel()}catch(e){console.warn('model',k,e)}},undefined,()=>{})};
const GLV=0xb08a5a,SLV=0x56653f;
// r/l = right/left hand position, w = magazine well (all in gun space)
const HP={akm:{r:[0,-.14,.17],l:[0,-.07,-.27],w:[0,-.16,-.06]},awm:{r:[0,-.12,.3],l:[0,-.08,-.35],w:[0,-.1,0]},mossberg:{r:[0,-.1,.18],l:[0,-.075,-.3],w:[0,-.06,.1]},mp5:{r:[0,-.15,.12],l:[0,-.085,-.26],w:[0,-.17,-.12]},scar:{r:[0,-.14,.04],l:[0,-.075,-.34],w:[0,-.14,-.06]},glock:{r:[0,-.07,.09],l:[-.015,-.11,.08],w:[0,-.1,.06]},knife:{r:[0,-.02,0]}};
function hand(g,pos,side){const h=new THREE.Group();h.position.fromArray(pos);
bx(h,.075,.05,.1,0,0,0,GLV);
for(let i=0;i<4;i++)bx(h,.017,.024,.055,-.0275+i*.018,-.03,-.02,GLV);
bx(h,.02,.022,.06,side*.045,.012,-.03,GLV);
bx(h,.09,.07,.05,0,-.005,.065,0x2b2f2a);
const s=bx(h,.1,.09,.5,0,0,0,SLV);s.position.set(side*.05,-.08,.33);s.rotation.set(.5,side*.28,0);
h.userData.rest=pos.slice();g.add(h);return h}
function addHands(g,id){const c=HP[id];if(!c)return;hand(g,c.r,1);if(c.l)g.userData.lh=hand(g,c.l,-1);
if(c.w){g.userData.mw=c.w;const m=bx(g,.05,.17,.08,c.w[0],c.w[1]-.04,c.w[2],0x2b2f45);m.visible=false;g.userData.mag=m}}
window.arcTex=()=>{const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,256,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.7,'rgba(190,230,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.strokeStyle=g;x.lineWidth=14;x.lineCap='round';x.beginPath();x.arc(128,150,110,Math.PI*1.12,Math.PI*1.88);x.stroke();return new THREE.CanvasTexture(c)};
function makeKnife(){const g=new THREE.Group(),sh=new THREE.Shape();
sh.moveTo(0,.014);sh.lineTo(.19,.014);sh.lineTo(.235,0);sh.lineTo(.17,-.022);sh.lineTo(.09,-.03);sh.lineTo(0,-.026);sh.closePath();
const geo=new THREE.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:false});geo.translate(0,0,-.006);
const bl=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:0xdfe6ee,specular:0xffffff,shininess:110}));bl.rotation.y=Math.PI/2;bl.position.z=-.1;bl.castShadow=true;g.add(bl);
bx(g,.0135,.007,.14,0,.004,-.22,0x8a94a0);
bx(g,.05,.07,.016,0,-.004,-.095,0x2a2f38);
bx(g,.034,.046,.17,0,-.006,0,0x1b1d22);
[-.06,-.02,.02,.06].forEach(z=>bx(g,.038,.05,.01,0,-.006,z,0xd9772b));
bx(g,.04,.05,.024,0,-.006,.095,0x2a2f38);return g}
window.buildGun=(id,hand)=>{const g=new THREE.Group();if(id==='knife'){g.add(makeKnife());if(hand)addHands(g,id);return g}if(MODELS[id]){g.add(MODELS[id].clone());if(hand)addHands(g,id);return g}
W[id].p.forEach(a=>{const m=a[7]==='c'?cy(g,a[0],a[2],a[3],a[4],a[5],a[6]):bx(g,a[0],a[1],a[2],a[3],a[4],a[5],a[6]);if(typeof a[7]==='number')m.rotation.x=a[7]});
if(hand)addHands(g,id);return g};
window.setGun=(g,id,s,hand)=>{while(g.children.length)g.remove(g.children[0]);const m=buildGun(id,hand);m.scale.setScalar(s||1);if(id==='knife'&&hand){m.rotation.set(.1,.05,.14);m.position.set(.02,-.01,-.1)}g.add(m)};
const CAMO=tx(x=>{const cs=['#7c8a55','#56663a','#9aa072','#3e4a2c'];x.fillStyle=cs[1];x.fillRect(0,0,64,64);for(let i=0;i<70;i++){x.fillStyle=cs[i%4];x.fillRect(Math.random()*64,Math.random()*64,6+Math.random()*14,4+Math.random()*9)}});
const MCm={},matC=c=>MCm[c]||(MCm[c]=new THREE.MeshLambertMaterial({color:c,map:CAMO}));
const bxc=(g,w,h,d,x,y,z,c)=>{const m=bx(g,w,h,d,x,y,z,c);m.material=matC(c);return m};
window.makeSoldier=col=>{const g=new THREE.Group(),T=new THREE.Color(col).lerp(new THREE.Color(0xffffff),.55).getHex(),VS=0x2b3027,DK=0x1a1d22,SKN=0xd8a47c;
const legs=[-1,1].map(s=>{const l=new THREE.Group();l.position.set(s*.14,.8,0);g.add(l);bxc(l,.2,.72,.23,0,-.38,0,T);bx(l,.17,.12,.06,0,-.42,-.12,DK);bx(l,.22,.12,.31,0,-.72,-.04,DK);return l});
bx(g,.5,.09,.3,0,.84,0,DK);[-.27,.27].forEach(x=>bx(g,.09,.12,.14,x,.8,-.04,VS));
bxc(g,.52,.5,.3,0,1.1,0,T);bxc(g,.5,.44,.35,0,1.12,-.01,VS);
[-.14,0,.14].forEach(x=>bx(g,.11,.12,.06,x,1.02,-.2,DK));bx(g,.3,.14,.04,0,1.28,-.19,DK);
[-.19,.19].forEach(x=>bx(g,.1,.08,.34,x,1.34,0,VS));
bx(g,.1,.08,.1,0,1.4,0,SKN);
bx(g,.27,.29,.27,0,1.56,0,SKN).userData.head=true;
bx(g,.285,.15,.285,0,1.5,0,DK).userData.head=true;
bx(g,.29,.08,.06,0,1.6,-.14,0x274a5a).userData.head=true;
bxc(g,.35,.17,.35,0,1.74,0,T).userData.head=true;bx(g,.37,.04,.4,0,1.67,-.01,DK).userData.head=true;
bxc(g,.34,.4,.17,0,1.15,.25,T);bx(g,.12,.1,.06,0,1.0,.36,DK);
bxc(g,.13,.32,.13,-.3,1.22,-.03,T);bxc(g,.13,.32,.13,.3,1.2,-.03,T);
bxc(g,.1,.1,.42,-.2,1.06,-.3,T);bxc(g,.1,.1,.36,.24,1.06,-.22,T);
bx(g,.1,.1,.1,-.2,1.06,-.54,DK);bx(g,.1,.1,.1,.24,1.06,-.42,DK);
const hold=new THREE.Group();hold.position.set(.22,1.1,-.36);g.add(hold);g.userData.hold=hold;g.userData.legs=legs;
g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g};
window.labelSprite=n=>{const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d');x.font='bold 34px Georgia,serif';x.textAlign='center';x.lineWidth=6;x.strokeStyle='#000';x.fillStyle='#fff';x.strokeText(n,128,44);x.fillText(n,128,44);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));s.scale.set(2,.5,1);return s};
window.flashTex=()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'#fff');g.addColorStop(.35,'rgba(255,200,90,.9)');g.addColorStop(1,'rgba(255,120,20,0)');x.fillStyle=g;x.fillRect(0,0,64,64);x.fillStyle='rgba(255,230,160,.9)';x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?10:31;x.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r)}x.fill();return new THREE.CanvasTexture(c)};
let tr,ts,tc;
window.thumb=id=>{if(!tr){tr=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});tr.setSize(300,120);ts=new THREE.Scene();ts.add(new THREE.HemisphereLight(0xffffff,0x556677,1.3));const l=new THREE.DirectionalLight(0xffffff,.8);l.position.set(-3,3,2);ts.add(l);tc=new THREE.PerspectiveCamera(22,2.5,.1,20);tc.position.set(-3,.05,-.2);tc.lookAt(0,0,-.2)}
const g=buildGun(id);ts.add(g);tr.render(ts,tc);ts.remove(g);return tr.domElement.toDataURL()};
})();

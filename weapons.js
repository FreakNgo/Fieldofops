(()=>{
const M=0x4d5c9a,D=0x2b2f45,Wd=0xb5622a,Gr=0x3d7a4d,Tn=0xb98a52,Sk=0xd08a4e,Sl=0xa05f2c;
const tx=f=>{const c=document.createElement('canvas');c.width=c.height=64;f(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t};
const metal=tx(x=>{x.fillStyle='#e4e4ec';x.fillRect(0,0,64,64);for(let i=0;i<260;i++){x.fillStyle='rgba(0,0,0,'+Math.random()*.2+')';x.fillRect(Math.random()*64,Math.random()*64,1+Math.random()*7,1)}for(let i=0;i<24;i++){x.fillStyle='rgba(255,255,255,.3)';x.fillRect(Math.random()*64,Math.random()*64,7,1)}});
const wood=tx(x=>{x.fillStyle='#fff';x.fillRect(0,0,64,64);for(let i=0;i<44;i++){x.fillStyle='rgba(60,25,5,'+(.1+Math.random()*.28)+')';x.fillRect(0,Math.random()*64,64,1)}});
const bx=(g,w,h,d,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c,map:c===Wd?wood:metal}));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
// s: slot (0 primary, 1 pistol, 2 melee). p: parts [w,h,d,x,y,z,color]
window.W={
akm:{n:'AKM',s:0,dmg:28,rate:100,mag:30,res:90,rl:2200,auto:1,spr:.012,f:260,p:[[.07,.09,.4,0,0,0,M],[.03,.03,.45,0,.01,-.42,D],[.065,.07,.28,0,-.005,-.28,Wd],[.05,.1,.28,0,-.03,.34,Wd],[.05,.2,.08,0,-.14,-.05,M],[.04,.12,.05,0,-.1,.14,Wd],[.02,.04,.02,0,.07,-.5,D],[.03,.03,.3,0,.055,-.3,M]]},
awm:{n:'AWM',s:0,dmg:110,rate:1300,mag:5,res:20,rl:2800,auto:0,spr:0,f:150,zoom:3.5,p:[[.07,.1,.7,0,0,.05,Gr],[.035,.035,.7,0,.02,-.65,D],[.06,.14,.3,0,-.02,.5,Gr],[.06,.06,.3,0,.12,-.05,D],[.04,.07,.1,0,-.08,0,M],[.03,.03,.1,.06,.03,.1,M]]},
mossberg:{n:'Mossberg',s:0,dmg:14,pel:8,rate:800,mag:8,res:32,rl:2600,auto:0,spr:.07,range:40,f:110,p:[[.06,.08,.5,0,0,.05,D],[.04,.04,.7,0,.02,-.45,D],[.03,.03,.6,0,-.04,-.38,M],[.07,.06,.2,0,-.05,-.3,Wd],[.05,.1,.3,0,-.04,.45,D]]},
mp5:{n:'MP5',s:0,dmg:17,rate:70,mag:30,res:120,rl:1800,auto:1,spr:.025,f:340,p:[[.065,.09,.4,0,0,0,D],[.03,.03,.25,0,.01,-.3,M],[.04,.25,.06,0,-.16,-.1,D],[.04,.12,.05,0,-.1,.12,D],[.04,.07,.25,0,0,.3,M],[.07,.06,.2,0,-.02,-.2,D]]},
scar:{n:'SCAR',s:0,dmg:24,rate:85,mag:20,res:100,rl:2000,auto:1,spr:.01,f:230,p:[[.07,.1,.5,0,0,0,Tn],[.03,.03,.4,0,.015,-.42,D],[.07,.07,.3,0,0,-.28,Tn],[.055,.12,.28,0,-.03,.38,Tn],[.045,.16,.07,0,-.12,0,D],[.04,.12,.05,0,-.1,.17,D],[.04,.05,.12,0,.08,-.03,D]]},
glock:{n:'Glock',s:1,dmg:20,rate:220,mag:15,res:60,rl:1400,auto:0,spr:.008,f:400,p:[[.04,.06,.3,0,.03,-.05,D],[.045,.03,.25,0,-.02,-.05,M],[.04,.14,.07,0,-.07,.07,M]]},
knife:{n:'Knife',s:2,dmg:55,rate:450,mag:0,res:0,rl:0,auto:0,spr:0,range:2.8,f:90,p:[[.012,.06,.32,0,.02,-.28,0xd5dbe3],[.016,.012,.3,0,.055,-.27,0x8a929c],[.04,.07,.015,0,0,-.11,D],[.03,.045,.14,0,-.01,-.03,0x1c1c1c]]}
};
for(const k in W)W[k].id=k;
window.buildGun=(id,hand)=>{const g=new THREE.Group();W[id].p.forEach(a=>bx(g,...a));if(hand){if(id==='knife'){bx(g,.07,.07,.1,0,-.012,-.03,Sk);bx(g,.09,.09,.45,.02,-.05,.25,Sl)}else{bx(g,.1,.1,.14,0,-.075,-.3,Sk);bx(g,.09,.11,.1,0,-.12,.14,Sk);bx(g,.11,.11,.5,.07,-.2,.45,Sl);bx(g,.1,.1,.45,-.05,-.16,-.55,Sl)}}return g};
window.setGun=(g,id,s,hand)=>{while(g.children.length)g.remove(g.children[0]);const m=buildGun(id,hand);m.scale.setScalar(s||1);if(id==='knife'&&hand){m.rotation.x=.5;m.position.set(.05,-.02,-.05)}g.add(m)};
window.makeSoldier=col=>{const g=new THREE.Group(),P=0x3a3f33,V=0x2d3036;
bx(g,.22,.72,.26,-.14,.36,0,P);bx(g,.22,.72,.26,.14,.36,0,P);bx(g,.25,.12,.34,-.14,.06,-.03,D);bx(g,.25,.12,.34,.14,.06,-.03,D);
bx(g,.56,.62,.3,0,1.02,0,col);bx(g,.5,.42,.35,0,1.06,0,V);bx(g,.14,.55,.14,-.36,1.0,0,col);bx(g,.14,.14,.5,.3,1.08,-.22,col);
const h=bx(g,.3,.32,.3,0,1.56,0,Sk);h.userData.head=true;bx(g,.31,.14,.31,0,1.5,0,0x222222).userData.head=true;bx(g,.35,.16,.35,0,1.74,0,0x4b5a3a).userData.head=true;
const hold=new THREE.Group();hold.position.set(.3,1.1,-.25);g.add(hold);g.userData.hold=hold;return g};
window.labelSprite=n=>{const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d');x.font='bold 34px Georgia,serif';x.textAlign='center';x.lineWidth=6;x.strokeStyle='#000';x.fillStyle='#fff';x.strokeText(n,128,44);x.fillText(n,128,44);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));s.scale.set(2,.5,1);return s};
let tr,ts,tc;
window.thumb=id=>{if(!tr){tr=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});tr.setSize(300,120);ts=new THREE.Scene();ts.add(new THREE.HemisphereLight(0xffffff,0x556677,1.3));const l=new THREE.DirectionalLight(0xffffff,.8);l.position.set(-3,3,2);ts.add(l);tc=new THREE.PerspectiveCamera(22,2.5,.1,20);tc.position.set(-2.5,.05,-.05);tc.lookAt(0,0,-.05)}
const g=buildGun(id);ts.add(g);tr.render(ts,tc);ts.remove(g);return tr.domElement.toDataURL()};
})();

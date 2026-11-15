(()=>{
const M=0x4d5c9a,D=0x2b2f45,K=0x1b1d24,Wd=0xb5622a,Gr=0x3d7a4d,Tn=0xb98a52,Sk=0xd08a4e,Sl=0xa05f2c,LN=0x6ad0e8;
const tx=f=>{const c=document.createElement('canvas');c.width=c.height=64;f(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t};
const metal=tx(x=>{x.fillStyle='#e4e4ec';x.fillRect(0,0,64,64);for(let i=0;i<260;i++){x.fillStyle='rgba(0,0,0,'+Math.random()*.2+')';x.fillRect(Math.random()*64,Math.random()*64,1+Math.random()*7,1)}for(let i=0;i<24;i++){x.fillStyle='rgba(255,255,255,.3)';x.fillRect(Math.random()*64,Math.random()*64,7,1)}});
const wood=tx(x=>{x.fillStyle='#fff';x.fillRect(0,0,64,64);for(let i=0;i<44;i++){x.fillStyle='rgba(60,25,5,'+(.1+Math.random()*.28)+')';x.fillRect(0,Math.random()*64,64,1)}});
const mat=c=>new THREE.MeshLambertMaterial({color:c,map:c===Wd?wood:metal});
const bx=(g,w,h,d,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
const cy=(g,r,l,x,y,z,c)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10),mat(c));m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
// part: [w,h,d,x,y,z,color,opt] opt: 'c' = cylinder (w=radius,d=length), number = tilt
window.W={
akm:{n:'AKM',s:0,dmg:28,rate:100,mag:30,res:90,rl:2200,auto:1,spr:.012,f:260,p:[[.07,.1,.42,0,0,0,M],[.06,.03,.4,0,.065,.02,D],[.017,0,.5,0,.015,-.46,D,'c'],[.014,0,.32,0,.062,-.3,M,'c'],[.075,.075,.3,0,-.005,-.27,Wd],[.07,.025,.3,0,.04,-.27,Wd],[.012,.05,.012,0,.07,-.55,D],[.024,0,.06,0,.015,-.74,K,'c'],[.055,.12,.3,0,-.035,.4,Wd],[.045,.13,.05,0,-.11,.17,Wd,.3],[.05,.22,.09,0,-.16,-.06,M,.25]]},
awm:{n:'AWM',s:0,dmg:110,rate:1300,mag:5,res:20,rl:2800,auto:0,spr:0,f:150,zoom:3.5,p:[[.075,.11,.75,0,0,0,Gr],[.02,0,.75,0,.02,-.7,K,'c'],[.03,0,.1,0,.02,-1.1,K,'c'],[.07,.15,.4,0,-.03,.55,Gr],[.07,.04,.2,0,.08,.55,K],[.032,0,.4,0,.14,-.05,K,'c'],[.04,0,.08,0,.14,-.28,K,'c'],[.034,0,.01,0,.14,-.325,LN,'c'],[.036,0,.06,0,.14,.17,K,'c'],[.03,.05,.03,0,.1,.05,M],[.03,.05,.03,0,.1,-.15,M],[.045,.08,.12,0,-.1,0,M],[.025,.025,.1,.07,.04,.15,M]]},
mossberg:{n:'Mossberg',s:0,dmg:14,pel:8,rate:800,mag:8,res:32,rl:2600,auto:0,spr:.07,range:40,f:110,p:[[.065,.09,.3,0,0,.1,D],[.022,0,.8,0,.025,-.5,K,'c'],[.018,0,.7,0,-.025,-.45,M,'c'],[.075,.06,.22,0,-.04,-.3,Wd],[.05,.11,.35,0,-.03,.45,Wd],[.01,.02,.01,0,.05,-.9,0xffcc00],[.04,.02,.1,0,-.06,.12,D]]},
mp5:{n:'MP5',s:0,dmg:17,rate:70,mag:30,res:120,rl:1800,auto:1,spr:.025,f:340,p:[[.065,.095,.38,0,0,0,K],[.075,.07,.2,0,-.01,-.26,K],[.014,0,.15,0,.015,-.42,M,'c'],[.04,.05,.01,0,.04,-.48,K],[.04,.26,.06,0,-.17,-.12,K,-.12],[.04,.12,.05,0,-.1,.12,K,.25],[.04,.08,.22,0,0,.3,M],[.04,.1,.02,0,0,.42,K],[.02,.03,.02,0,.065,.1,K]]},
scar:{n:'SCAR',s:0,dmg:24,rate:85,mag:20,res:100,rl:2000,auto:1,spr:.01,f:230,p:[[.075,.11,.5,0,0,0,Tn],[.018,0,.4,0,.02,-.4,D,'c'],[.08,.085,.3,0,0,-.3,Tn],[.022,0,.08,0,.02,-.63,K,'c'],[.04,.015,.5,0,.065,-.05,K],[.05,.06,.14,0,.1,-.03,K],[.04,.04,.01,0,.1,-.11,0xe84040],[.06,.13,.3,0,-.03,.4,Tn],[.045,.13,.05,0,-.11,.17,K,.3],[.05,.17,.09,0,-.13,-.02,K,.1]]},
glock:{n:'Glock',s:1,dmg:20,rate:220,mag:15,res:60,rl:1400,auto:0,spr:.008,f:400,p:[[.04,.055,.3,0,.035,-.05,K],[.045,.035,.26,0,-.005,-.05,D],[.042,.14,.075,0,-.08,.06,D,-.2],[.03,.02,.07,0,-.035,-.08,D],[.012,0,.03,0,.035,-.21,M,'c'],[.01,.012,.01,0,.068,.08,0xffffff]]},
knife:{n:'Knife',s:2,dmg:55,rate:450,mag:0,res:0,rl:0,auto:0,spr:0,range:2.8,f:90,p:[[.012,.06,.32,0,.02,-.28,0xd5dbe3],[.01,.03,.07,0,.035,-.47,0xd5dbe3],[.016,.012,.3,0,.055,-.27,0x8a929c],[.04,.07,.015,0,0,-.11,D],[.03,.045,.14,0,-.01,-.03,0x1c1c1c],[.035,.05,.02,0,-.01,.05,M]]}
};
for(const k in W)W[k].id=k;
window.buildGun=(id,hand)=>{const g=new THREE.Group();
W[id].p.forEach(a=>{const m=a[7]==='c'?cy(g,a[0],a[2],a[3],a[4],a[5],a[6]):bx(g,a[0],a[1],a[2],a[3],a[4],a[5],a[6]);if(typeof a[7]==='number')m.rotation.x=a[7]});
if(hand){if(id==='knife'){bx(g,.07,.07,.1,0,-.012,-.03,Sk);bx(g,.09,.09,.45,.02,-.05,.25,Sl)}else{bx(g,.1,.1,.14,0,-.075,-.3,Sk);bx(g,.09,.11,.1,0,-.12,.14,Sk);bx(g,.11,.11,.5,.07,-.2,.45,Sl);bx(g,.1,.1,.45,-.05,-.16,-.55,Sl)}}return g};
window.setGun=(g,id,s,hand)=>{while(g.children.length)g.remove(g.children[0]);const m=buildGun(id,hand);m.scale.setScalar(s||1);if(id==='knife'&&hand){m.rotation.x=.5;m.position.set(.05,-.02,-.05)}g.add(m)};
window.makeSoldier=col=>{const g=new THREE.Group(),P=0x3a3f33,V=0x2d3036;
bx(g,.22,.72,.26,-.14,.36,0,P);bx(g,.22,.72,.26,.14,.36,0,P);bx(g,.25,.12,.34,-.14,.06,-.03,D);bx(g,.25,.12,.34,.14,.06,-.03,D);
bx(g,.56,.62,.3,0,1.02,0,col);bx(g,.5,.42,.35,0,1.06,0,V);bx(g,.14,.55,.14,-.36,1.0,0,col);bx(g,.14,.14,.5,.3,1.08,-.22,col);
const h=bx(g,.3,.32,.3,0,1.56,0,Sk);h.userData.head=true;bx(g,.31,.14,.31,0,1.5,0,0x222222).userData.head=true;bx(g,.35,.16,.35,0,1.74,0,0x4b5a3a).userData.head=true;
const hold=new THREE.Group();hold.position.set(.3,1.1,-.25);g.add(hold);g.userData.hold=hold;return g};
window.labelSprite=n=>{const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d');x.font='bold 34px Georgia,serif';x.textAlign='center';x.lineWidth=6;x.strokeStyle='#000';x.fillStyle='#fff';x.strokeText(n,128,44);x.fillText(n,128,44);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));s.scale.set(2,.5,1);return s};
window.flashTex=()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'#fff');g.addColorStop(.35,'rgba(255,200,90,.9)');g.addColorStop(1,'rgba(255,120,20,0)');x.fillStyle=g;x.fillRect(0,0,64,64);x.fillStyle='rgba(255,230,160,.9)';x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?10:31;x.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r)}x.fill();return new THREE.CanvasTexture(c)};
let tr,ts,tc;
window.thumb=id=>{if(!tr){tr=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});tr.setSize(300,120);ts=new THREE.Scene();ts.add(new THREE.HemisphereLight(0xffffff,0x556677,1.3));const l=new THREE.DirectionalLight(0xffffff,.8);l.position.set(-3,3,2);ts.add(l);tc=new THREE.PerspectiveCamera(22,2.5,.1,20);tc.position.set(-3,.05,-.2);tc.lookAt(0,0,-.2)}
const g=buildGun(id);ts.add(g);tr.render(ts,tc);ts.remove(g);return tr.domElement.toDataURL()};
})();

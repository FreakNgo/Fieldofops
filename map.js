(()=>{
const rnd=Math.random,hex=c=>'#'+c.toString(16).padStart(6,0);
const cv=(w,h,f,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||1,ry||1);return t};
const cont=(col,txt)=>cv(256,256,x=>{x.fillStyle=hex(col);x.fillRect(0,0,256,256);
for(let i=0;i<16;i++){const g=x.createLinearGradient(i*16,0,i*16+16,0);g.addColorStop(0,'rgba(255,255,255,.14)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.32)');x.fillStyle=g;x.fillRect(i*16,12,16,232)}
for(let i=0;i<14;i++){x.fillStyle='rgba(95,50,20,'+(.12+rnd()*.2)+')';x.fillRect(rnd()*256,rnd()*60,3+rnd()*5,40+rnd()*160)}
for(let i=0;i<30;i++){x.fillStyle='rgba(200,190,170,'+rnd()*.25+')';x.fillRect(rnd()*256,rnd()*256,4+rnd()*14,2+rnd()*5)}
x.fillStyle='rgba(15,18,28,.7)';x.fillRect(0,0,256,12);x.fillRect(0,244,256,12);x.fillStyle='rgba(255,255,255,.15)';x.fillRect(0,12,256,2);
x.fillStyle='rgba(255,255,255,.88)';x.font='900 54px Impact,Arial Black,sans-serif';x.textAlign='center';x.fillText(txt,128,138);x.font='700 16px Arial';x.fillText('MAX 50000 KG',128,200)});
const crate=cv(128,128,x=>{x.fillStyle='#c9772b';x.fillRect(0,0,128,128);for(let i=0;i<8;i++){x.fillStyle='rgba(60,25,5,.35)';x.fillRect(0,i*16,128,2)}
for(let i=0;i<60;i++){x.fillStyle='rgba(60,25,5,'+rnd()*.2+')';x.fillRect(rnd()*128,rnd()*128,rnd()*30,1)}
x.fillStyle='#8f959c';[14,64,112].forEach(a=>x.fillRect(a,0,10,128));x.fillRect(0,0,128,6);x.fillRect(0,122,128,6);x.fillStyle='#dfe3e8';[14,64,112].forEach(a=>{x.fillRect(a+4,12,3,3);x.fillRect(a+4,112,3,3)})});
const ammo=cv(64,64,x=>{x.fillStyle='#4d6a35';x.fillRect(0,0,64,64);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,28,64,3);x.fillStyle='#d9d27a';x.fillRect(8,40,20,6);for(let i=0;i<40;i++){x.fillStyle='rgba(0,0,0,'+rnd()*.15+')';x.fillRect(rnd()*64,rnd()*64,3,1)}});
const asp=cv(128,128,x=>{x.fillStyle='#4a4c52';x.fillRect(0,0,128,128);for(let i=0;i<500;i++){const v=rnd()*40|0;x.fillStyle='rgb('+(60+v)+','+(62+v)+','+(68+v)+')';x.fillRect(rnd()*128,rnd()*128,2,2)}
x.strokeStyle='rgba(15,15,20,.6)';x.beginPath();x.moveTo(rnd()*128,0);for(let i=1;i<6;i++)x.lineTo(rnd()*128,i*22);x.stroke()},26,26);
const win=cv(64,64,x=>{x.fillStyle='#d6cfbd';x.fillRect(0,0,64,64);x.fillStyle='#46556b';for(let i=0;i<2;i++)for(let j=0;j<4;j++)x.fillRect(4+j*16,8+i*28,10,18);x.fillStyle='rgba(0,0,0,.15)';x.fillRect(0,60,64,4)},13);
const sky=cv(8,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#4f7fc4');g.addColorStop(.45,'#9ab8dc');g.addColorStop(.52,'#f4c08e');g.addColorStop(1,'#d98f6a');x.fillStyle=g;x.fillRect(0,0,w,h)});
sky.magFilter=sky.minFilter=THREE.LinearFilter;
window.buildMap=(add,S,rng)=>{
const fl=S.children.find(o=>o.geometry&&o.geometry.type==='PlaneGeometry'),gr=S.children.find(o=>o.type==='GridHelper');
fl.material.map=asp;fl.material.color.set(0xffffff);fl.material.needsUpdate=true;gr.visible=false;
S.add(new THREE.Mesh(new THREE.SphereGeometry(120,16,12),new THREE.MeshBasicMaterial({map:sky,side:THREE.BackSide,fog:false})));
const lab=['BD 13','VECTO','BD 13','VECTO','BD 13'],base=[0x2f5f9e,0xa8302e,0x3f8a4f,0xd98a2b,0x2f5f9e].map((c,i)=>cont(c,lab[i])),mats={};
const M=(i,n)=>mats[i+'_'+n]||(mats[i+'_'+n]=(t=>{t.repeat.set(3,n);t.needsUpdate=true;return new THREE.MeshLambertMaterial({map:t})})(base[i].clone()));
const cm=new THREE.MeshLambertMaterial({map:crate}),am=new THREE.MeshLambertMaterial({map:ammo}),wm=new THREE.MeshLambertMaterial({map:win}),st=new THREE.MeshLambertMaterial({color:0x55627a});
[[0,-49.9,0],[0,49.9,Math.PI],[-49.9,0,Math.PI/2],[49.9,0,-Math.PI/2]].forEach(a=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(100,8),wm);p.position.set(a[0],4,a[1]);p.rotation.y=a[2];S.add(p)});
for(let gx=-3;gx<=3;gx++)for(let gz=-3;gz<=3;gz++){if(Math.abs(gx)<=1&&Math.abs(gz)<=1)continue;if(rng()<.3)continue;
const x=gx*13+(rng()-.5)*3,z=gz*13+(rng()-.5)*3,a=rng()<.5,n=1+(rng()*2.2|0),m=M(rng()*5|0,n);
add(x,z,a?11:2.6,2.6*n,a?2.6:11,m);if(n===1&&rng()<.6)add(x+(a?0:3.2),z+(a?3.2:0),1.6,1.2,1.6,cm)}
[[-5,4],[5,-4],[-4,-6],[6,5]].forEach(a=>add(a[0],a[1],3,1,.8,0x9aa0a6));
[[-4,-3],[7,2],[-8,6]].forEach(a=>{add(a[0],a[1],2.2,.6,1.4,am);add(a[0]+.2,a[1],1.6,1.1,1.1,am)});
[[-9,-9],[9,9]].forEach(a=>{add(a[0],a[1],.5,12,.5,0x2c2f35);const l=new THREE.Mesh(new THREE.BoxGeometry(2.2,.4,1),new THREE.MeshBasicMaterial({color:0xfff1c4}));l.position.set(a[0],12.2,a[1]);S.add(l)});
[[-46,-46],[46,-46],[-46,46],[46,46]].forEach(a=>add(a[0],a[1],1.6,14,1.6,st));
[-46,46].forEach(z=>{const b=new THREE.Mesh(new THREE.BoxGeometry(92,1.2,1.2),st);b.position.set(0,14.5,z);b.castShadow=true;S.add(b)});
const hc=new THREE.Mesh(new THREE.BoxGeometry(11,2.6,2.6),M(3,1));hc.position.set(-6,10,-46);hc.castShadow=true;S.add(hc);
[-9,-3].forEach(x=>{const c=new THREE.Mesh(new THREE.BoxGeometry(.06,3,.06),st);c.position.set(x,12.4,-46);S.add(c)})};
})();

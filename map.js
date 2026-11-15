(()=>{
const cv=(w,h,f,rx)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||1,1);return t};
const cont=col=>cv(128,128,x=>{x.fillStyle='#'+col.toString(16).padStart(6,0);x.fillRect(0,0,128,128);
for(let i=0;i<16;i++){x.fillStyle='rgba(0,0,0,.22)';x.fillRect(i*8+4,6,3,116)}
x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,128,6);x.fillRect(0,122,128,6);
for(let i=0;i<20;i++){x.fillStyle='rgba(60,30,10,.18)';x.fillRect(Math.random()*128,Math.random()*128,10,4)}
x.fillStyle='rgba(255,255,255,.75)';x.font='bold 22px sans-serif';x.fillText('BD 13',34,70)});
const win=cv(64,64,x=>{x.fillStyle='#d6cfbd';x.fillRect(0,0,64,64);x.fillStyle='#46556b';for(let i=0;i<2;i++)for(let j=0;j<4;j++)x.fillRect(4+j*16,8+i*28,10,18);x.fillStyle='rgba(0,0,0,.15)';x.fillRect(0,60,64,4)},13);
window.buildMap=(add,S,rng)=>{
const pal=[0xb8372b,0x2f5f9e,0x3f8a4f,0xd98a2b,0xe6e6dc].map(c=>new THREE.MeshLambertMaterial({map:cont(c)})),wm=new THREE.MeshLambertMaterial({map:win});
[[0,-49.9,0],[0,49.9,Math.PI],[-49.9,0,Math.PI/2],[49.9,0,-Math.PI/2]].forEach(a=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(100,8),wm);p.position.set(a[0],4,a[1]);p.rotation.y=a[2];S.add(p)});
for(let gx=-3;gx<=3;gx++)for(let gz=-3;gz<=3;gz++){if(Math.abs(gx)<=1&&Math.abs(gz)<=1)continue;if(rng()<.3)continue;
const x=gx*13+(rng()-.5)*3,z=gz*13+(rng()-.5)*3,a=rng()<.5,n=1+(rng()*2.2|0),m=pal[rng()*5|0];
add(x,z,a?11:2.6,2.6*n,a?2.6:11,m);if(n===1&&rng()<.6)add(x+(a?0:3.2),z+(a?3.2:0),1.6,1.2,1.6,0x9c7a4a)}
[[-5,4],[5,-4],[-4,-6],[6,5]].forEach(a=>add(a[0],a[1],3,1,.8,0x9aa0a6));
[[-9,-9],[9,9]].forEach(a=>{add(a[0],a[1],.5,12,.5,0x2c2f35);const l=new THREE.Mesh(new THREE.BoxGeometry(2.2,.4,1),new THREE.MeshBasicMaterial({color:0xfff1c4}));l.position.set(a[0],12.2,a[1]);S.add(l)})};
})();

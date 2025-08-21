// Cursor star
const cursor=document.createElement("div");
cursor.classList.add("cursor-star");
cursor.innerText="★";
document.body.appendChild(cursor);
document.addEventListener("mousemove",e=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";

  const trail=document.createElement("div");
  trail.classList.add("trail-star");
  trail.innerText="★";
  trail.style.left=e.clientX+"px";
  trail.style.top=e.clientY+"px";
  document.body.appendChild(trail);
  setTimeout(()=>trail.remove(),800);
});

// Click image buttons
document.querySelectorAll(".img-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const src=btn.dataset.src;
    const img=document.createElement("img");
    img.src=src;
    img.classList.add("pop-image");
    img.style.left=Math.random()*(window.innerWidth-200)+"px";
    img.style.top=Math.random()*(window.innerHeight-200)+"px";
    document.body.appendChild(img);
    setTimeout(()=>img.remove(),1500);
  });
});

// Snow canvas
(function(){
  const canvas=document.createElement('canvas');
  canvas.id='snow-canvas';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let w,h,dpr,flakes=[], FLAKE_COUNT_BASE=120, flakeCount=FLAKE_COUNT_BASE;

  function resize(){
    dpr=window.devicePixelRatio||1;
    w=window.innerWidth; h=window.innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    flakeCount=Math.floor(FLAKE_COUNT_BASE*(w*h)/(1280*720));
    flakeCount=Math.min(400, Math.max(80, flakeCount));
    while(flakes.length<flakeCount) flakes.push(makeFlake(true));
    if(flakes.length>flakeCount) flakes.length=flakeCount;
  }

  function rand(min,max){return Math.random()*(max-min)+min;}
  function makeFlake(top=false){return {x:rand(0,w),y:top?rand(-h,0):rand(0,h),r:rand(2,8),sp:rand(1.2,1.35),drift:rand(-0.6,0.6),phase:rand(0,Math.PI*2),alpha:rand(0.35,0.85)};}
  function update(){
    ctx.clearRect(0,0,w,h);
    flakes.forEach((f,i)=>{
      f.phase+=0.01; f.x+=Math.sin(f.phase)*0.5+f.drift; f.y+=f.sp;
      if(f.y-f.r>h) flakes[i]=makeFlake(true);
      if(f.x<-10) f.x=w+10; if(f.x>w+10) f.x=-10;
      ctx.globalAlpha=f.alpha;
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle='#fff';
      ctx.fill();
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(update);
  }

  window.addEventListener('resize',resize);
  resize(); update();
})();

/* Potato Client — motion, navegación e interacciones */
(() => {
  "use strict";
  // Sustituye estas cadenas por los enlaces reales cuando publiques las descargas.
  const DOWNLOADS={"1.21.4":"","1.20.1":""};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const progress=$("#progress"),backTop=$("#backTop"),nav=$("#nav"),menuToggle=$("#menuToggle"),modal=$("#downloadModal"),toast=$("#toast"),loader=$("#pageLoader"),cursorGlow=$("#cursorGlow");
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hideLoader=()=>setTimeout(()=>loader?.classList.add("is-hidden"),420);
  if(document.readyState==="complete")hideLoader();else addEventListener("load",hideLoader,{once:true});setTimeout(hideLoader,1800);
  function onScroll(){const d=document.documentElement,max=d.scrollHeight-d.clientHeight;if(progress)progress.style.width=`${max>0?d.scrollTop/max*100:0}%`;backTop?.classList.toggle("visible",scrollY>550)}
  addEventListener("scroll",onScroll,{passive:true});onScroll();
  if("IntersectionObserver" in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObserver.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});$$(".reveal").forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*65}ms`;revealObserver.observe(el)});}else $$(".reveal").forEach(el=>el.classList.add("visible"));
  const sectionLinks=$$("#nav a[href^='#']");if("IntersectionObserver" in window){const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)sectionLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${e.target.id}`))}),{rootMargin:"-35% 0px -55% 0px"});$$("main section[id]").forEach(s=>sectionObserver.observe(s))}
  menuToggle?.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(opened))});$$("#nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}));
  function openModal(){modal?.classList.add("open");modal?.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("[data-close-modal]",modal)?.focus()}function closeModal(){modal?.classList.remove("open");modal?.setAttribute("aria-hidden","true");document.body.style.overflow=""}
  $$('[data-open-download]').forEach(b=>b.addEventListener("click",openModal));$$('[data-close-modal]').forEach(b=>b.addEventListener("click",closeModal));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
  const rows=$$(".modal-version");["1.21.4","1.20.1"].forEach((v,i)=>{const url=DOWNLOADS[v],row=rows[i];if(!url||!row)return;const badge=$(".version-badge",row);if(badge){badge.textContent="DESCARGAR";badge.classList.add("download-ready")}row.style.cursor="pointer";row.addEventListener("click",()=>window.open(url,"_blank","noopener"))});
  function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
  $("#copyFolder")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(".minecraft/mods");showToast("Ruta copiada al portapapeles")}catch{showToast("Ruta: .minecraft/mods")}});
  $$(".button").forEach(btn=>btn.addEventListener("pointerdown",e=>{if(reduceMotion)return;const r=btn.getBoundingClientRect(),rip=document.createElement("span");rip.className="ripple";rip.style.left=`${e.clientX-r.left}px`;rip.style.top=`${e.clientY-r.top}px`;btn.append(rip);rip.addEventListener("animationend",()=>rip.remove(),{once:true})}));
  if(cursorGlow&&matchMedia("(pointer:fine)").matches&&!reduceMotion)addEventListener("pointermove",e=>{cursorGlow.style.left=`${e.clientX}px`;cursorGlow.style.top=`${e.clientY}px`},{passive:true});
  if(!reduceMotion&&matchMedia("(pointer:fine)").matches){$$(".feature-card,.version-card").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-3px)`});card.addEventListener("pointerleave",()=>card.style.transform="")})}
  backTop?.addEventListener("click",()=>scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"}));addEventListener("resize",()=>{if(innerWidth>680){nav?.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}});

  /* ===== POTATO FX ENGINE: partículas, parallax y microinteracciones ===== */
  // Fondo de partículas ligero, adaptativo y sin dependencias externas.
  if (!reduceMotion && !matchMedia('(pointer: coarse)').matches) {
    const canvas = document.createElement('canvas');
    canvas.id = 'potatoFxCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {position:'fixed', inset:'0', width:'100%', height:'100%', zIndex:'0', pointerEvents:'none', opacity:'.55'});
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w=0,h=0,points=[],raf=0;
    const pointer={x:-9999,y:-9999};
    function resizeFx(){
      const dpr=Math.min(devicePixelRatio||1,1.5); w=innerWidth; h=innerHeight;
      canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.min(65,Math.max(24,Math.floor(w*h/22000)));
      points=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.5,a:Math.random()*.42+.12}));
    }
    function drawFx(){
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<points.length;i++){
        const p=points[i]; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
        const dx=pointer.x-p.x,dy=pointer.y-p.y,dist=Math.hypot(dx,dy);
        if(dist<115){p.x-=dx/dist*.12;p.y-=dy/dist*.12;}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(170,151,255,${p.a})`;ctx.fill();
        for(let j=i+1;j<points.length;j++){
          const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);
          if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(145,122,255,${(1-d/105)*.12})`;ctx.lineWidth=.7;ctx.stroke();}
        }
      }
      raf=requestAnimationFrame(drawFx);
    }
    resizeFx(); drawFx();
    addEventListener('resize',resizeFx,{passive:true});
    addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else drawFx()});
  }

  // Destello que recorre los paneles al pasar el cursor.
  $$('.feature-card,.version-card,.preview-window,.requirements-panel').forEach(card=>{
    card.classList.add('fx-card');
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--pointer-x',`${e.clientX-r.left}px`);
      card.style.setProperty('--pointer-y',`${e.clientY-r.top}px`);
    });
  });

  // Botones magnéticos sutiles en escritorio.
  if(!reduceMotion && matchMedia('(pointer:fine)').matches){
    $$('.button').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
        btn.style.setProperty('--mag-x',`${x*.055}px`);btn.style.setProperty('--mag-y',`${y*.09}px`);
      });
      btn.addEventListener('pointerleave',()=>{btn.style.setProperty('--mag-x','0px');btn.style.setProperty('--mag-y','0px')});
    });
  }

  // Parallax leve en los fondos decorativos del hero.
  if(!reduceMotion && matchMedia('(pointer:fine)').matches){
    const hero=$('.hero');
    hero?.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      $$('.ambient').forEach((el,i)=>{el.style.translate=`${x*(i+1)*9}px ${y*(i+1)*7}px`});
      const preview=$('.client-preview'); if(preview) preview.style.setProperty('--hero-shift',`${x*5}px`);
    });
    hero?.addEventListener('pointerleave',()=>{$$('.ambient').forEach(el=>el.style.translate='');const preview=$('.client-preview');if(preview)preview.style.setProperty('--hero-shift','0px')});
  }

  // Contadores animados cuando sus números entran en pantalla.
  const counters=$$('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target,target=Number(el.dataset.count)||0,duration=1100,start=performance.now();
      function tick(now){const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,4);el.textContent=Math.round(target*ease).toLocaleString('es-MX');if(t<1)requestAnimationFrame(tick)}
      requestAnimationFrame(tick);countObserver.unobserve(el);
    }),{threshold:.6});
    counters.forEach(el=>countObserver.observe(el));
  }

  // Acordeones FAQ accesibles (si existen en el HTML).
  $$('[data-faq-toggle]').forEach(toggle=>toggle.addEventListener('click',()=>{
    const item=toggle.closest('[data-faq]');if(!item)return;
    const opened=item.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(opened));
  }));

  // Desplazamiento suave para enlaces internos y feedback al copiar.
  $$('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
    const target=$(link.getAttribute('href'));if(!target)return;e.preventDefault();
    target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
  }));

})();

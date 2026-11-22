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
})();
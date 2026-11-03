"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Decorative media never blocks content; posters remain when playback is unavailable. */
export function MotionVideo({src,poster,className="",scrub=false,paused=false}:{src:string;poster:string;className?:string;scrub?:boolean;paused?:boolean}){
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=ref.current;if(!video)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');let visible=false;let tween:gsap.core.Tween|null=null;
  const play=()=>{if(visible&&!paused&&!motion.matches&&!scrub)void video.play().catch(()=>{});else video.pause()};
  const destroyScrub=()=>{tween?.scrollTrigger?.kill();tween?.kill();tween=null};
  const createScrub=()=>{
   destroyScrub();
   if(!scrub||paused||motion.matches||!Number.isFinite(video.duration)||video.duration<=0)return;
   gsap.registerPlugin(ScrollTrigger);video.pause();
   tween=gsap.fromTo(video,{currentTime:0},{currentTime:Math.max(0,video.duration-.08),ease:'none',scrollTrigger:{trigger:video.parentElement??video,start:'top bottom',end:'bottom top',scrub:.35,invalidateOnRefresh:true}});
   tween.scrollTrigger?.refresh();
  };
  const loaded=()=>{if(scrub)createScrub();else play()};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!video.src){video.src=src;video.load()}play()},{rootMargin:'80% 0px'});
  observer.observe(video);motion.addEventListener('change',loaded);video.addEventListener('loadedmetadata',loaded);video.addEventListener('loadeddata',play);
  if(video.readyState>=1)loaded();
  const visibility=()=>{if(document.hidden)video.pause();else play()};document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();destroyScrub();video.pause();motion.removeEventListener('change',loaded);video.removeEventListener('loadedmetadata',loaded);video.removeEventListener('loadeddata',play);document.removeEventListener('visibilitychange',visibility)};
 },[src,scrub,paused]);
 return <video ref={ref} className={className} poster={poster} muted loop={!scrub} playsInline preload="none" aria-hidden="true" data-scroll-scrub={scrub||undefined} disablePictureInPicture/>;
}

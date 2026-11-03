"use client";
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export const services=[
 {title:'Branding',subtitle:'Estratégia e identidade',description:'Uma essência clara. Uma identidade que traduz quem você é.',tags:'Posicionamento · Identidade visual · Naming',poster:'symbol.webp',video:'logo-1.mp4'},
 {title:'Sites',subtitle:'Presença digital',description:'Sua marca em uma presença digital feita para conectar.',tags:'Sites institucionais · Desenvolvimento web',poster:'panels.webp',video:'panels.mp4'},
 {title:'UI/UX',subtitle:'Experiências intuitivas',description:'Interfaces pensadas para as pessoas, em cada interação.',tags:'Pesquisa · Interfaces · Prototipação',poster:'lenses.webp',video:'lenses.mp4'},
 {title:'Projetos completos',subtitle:'Da ideia à entrega',description:'Estratégia, identidade e experiência trabalhando juntas.',tags:'Branding · Design · Tecnologia',poster:'arcs.webp',video:'arcs.mp4'}
];
export function ServiceStage({paused}:{paused:boolean}){
 const host=useRef<HTMLDivElement>(null);const canvasHost=useRef<HTMLDivElement>(null);const labels=useRef<(HTMLButtonElement|null)[]>([]);const activeRef=useRef(0);const pauseRef=useRef(paused);pauseRef.current=paused;
 const [active,setActive]=useState(0);const [ready,setReady]=useState(false);
 const select=(index:number)=>{activeRef.current=index;setActive(index)};
 useEffect(()=>{
  const root=host.current;const mount=canvasHost.current;if(!root||!mount)return;
  const media=window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
  let cleanup=()=>{};let disposed=false;
  async function setup(){
   cleanup();setReady(false);if(!media.matches)return;
   const THREE=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');if(disposed)return;
   let renderer:InstanceType<typeof THREE.WebGLRenderer>;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}catch{return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;mount!.appendChild(renderer.domElement);
   const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-7.1,7.1,3.5,-3.5,.1,80);camera.position.set(0,0,20);
   const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();
   scene.add(new THREE.AmbientLight(0xc5d8ff,.5));const light=new THREE.DirectionalLight(0x7190ff,2.5);light.position.set(3,6,9);scene.add(light);
   const groups:InstanceType<typeof THREE.Group>[]=[];const videos:HTMLVideoElement[]=[];const textures:InstanceType<typeof THREE.Texture>[]=[];const materials:InstanceType<typeof THREE.MeshBasicMaterial>[]=[];const posterTextures:InstanceType<typeof THREE.Texture>[]=[];
   const loader=new THREE.TextureLoader();
   services.forEach((service,i)=>{
    const group=new THREE.Group();group.position.x=(i-1.5)*3.45;scene.add(group);groups.push(group);
    const geometry=new THREE.BoxGeometry(3.13,4.75,.085);
    const material=new THREE.MeshPhysicalMaterial({color:0x142637,metalness:.45,roughness:.28,clearcoat:1,clearcoatRoughness:.18,envMapIntensity:.3,transmission:0,thickness:.4});
    group.add(new THREE.Mesh(geometry,material));
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0x6586ff,transparent:true,opacity:.85}));group.add(edge);
    const poster=loader.load('/media/'+service.poster);poster.colorSpace=THREE.SRGBColorSpace;textures.push(poster);posterTextures.push(poster);
    const screenMaterial=new THREE.MeshBasicMaterial({map:poster,toneMapped:false});materials.push(screenMaterial);
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.95,1.75),screenMaterial);screen.position.set(0,-.7,.052);group.add(screen);
    const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';video.src='/media/'+service.video;videos.push(video);
    const tex=new THREE.VideoTexture(video);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);
    video.addEventListener('playing',()=>{screenMaterial.map=tex;screenMaterial.needsUpdate=true});
   });
   let width=0,height=0,visible=false,frame=0,lastTime=0,currentVideo=-1,scrollProgress=0;let pointerX=0,pointerY=0;
   const resize=()=>{const w=root!.clientWidth,h=root!.clientHeight;if(w===width&&h===height)return;width=w;height=h;renderer.setSize(width,height,false);const halfH=7.1*height/width;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix()};resize();window.addEventListener('resize',resize);
   const point=new THREE.Vector3();const project=(group:InstanceType<typeof THREE.Group>,x:number,y:number)=>{point.set(x,y,.1);group.localToWorld(point);point.project(camera);return {x:(point.x*.5+.5)*width,y:(-.5*point.y+.5)*height}};
   const stopVideos=()=>videos.forEach(v=>v.pause());
   const render=(time:number)=>{
    frame=requestAnimationFrame(render);if(!visible||document.hidden)return;if(time-lastTime<30)return;lastTime=time;
    const chosen=activeRef.current;
    if(currentVideo!==chosen||pauseRef.current){stopVideos();currentVideo=pauseRef.current?-1:chosen;if(!pauseRef.current)void videos[chosen].play().catch(()=>{});}
    groups.forEach((group,i)=>{const focus=i===chosen;const t=pauseRef.current?0:time*.00055;
     const arrival=THREE.MathUtils.smoothstep(scrollProgress,0+i*.035,.45+i*.035);
     group.position.y+=( ((focus?.18:-.08)+Math.sin(t+i*1.6)*.045-(1-arrival)*.65)-group.position.y)*.08;
     group.rotation.y+=(((i-1.5)*-.12+pointerX*.08+(1-arrival)*.45)-group.rotation.y)*.05;
     group.rotation.x+=((pointerY*.025)-group.rotation.x)*.05;
     const scale=focus?1.025:.96;group.scale.lerp(new THREE.Vector3(scale,scale,scale),.07);group.updateMatrixWorld(true);
     const a=project(group,-1.32,2.08),b=project(group,1.32,-2.03);const label=labels.current[i];
     if(label){label.style.left=a.x+'px';label.style.top=a.y+'px';label.style.width=(b.x-a.x)+'px';label.style.height=(b.y-a.y)+'px'}
    });renderer.render(scene,camera);
   };
   const observe=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){stopVideos();currentVideo=-1}},{rootMargin:'80px'});observe.observe(root!);
   const move=(e:PointerEvent)=>{const r=root!.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5};const leave=()=>{pointerX=0;pointerY=0};root!.addEventListener('pointermove',move);root!.addEventListener('pointerleave',leave);
   const ctxLost=()=>setReady(false);renderer.domElement.addEventListener('webglcontextlost',ctxLost);
   gsap.registerPlugin(ScrollTrigger);const trigger=ScrollTrigger.create({trigger:root,start:'top 95%',end:'bottom 15%',onUpdate:self=>{scrollProgress=self.progress;const i=Math.min(3,Math.floor(self.progress*4));activeRef.current=i;setActive(i)}});scrollProgress=trigger.progress;
   frame=requestAnimationFrame(render);setReady(true);
   cleanup=()=>{cancelAnimationFrame(frame);stopVideos();observe.disconnect();window.removeEventListener('resize',resize);trigger.kill();root!.removeEventListener('pointermove',move);root!.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',ctxLost);videos.forEach(v=>{v.removeAttribute('src');v.load()});scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.LineSegments){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose())}});textures.forEach(t=>t.dispose());env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();labels.current.forEach(el=>{el?.removeAttribute('style')})};
  }
  void setup();const change=()=>void setup();media.addEventListener('change',change);
  return()=>{disposed=true;cleanup();media.removeEventListener('change',change)};
 },[]);
 return <><div ref={host} className={'service-stage '+(ready?'is-3d':'')}><div ref={canvasHost} className="service-canvas" aria-hidden="true"/>{services.map((s,i)=><button ref={el=>{labels.current[i]=el}} key={s.title} className={'service-card '+(active===i?'is-active':'')} onClick={()=>select(i)} onFocus={()=>select(i)} onPointerEnter={()=>select(i)} aria-pressed={active===i} aria-label={`Explorar ${s.title}`}><span className="service-number">0{i+1}</span><h3>{s.title}</h3><p>{s.subtitle}</p><img className="service-poster" src={'/media/'+s.poster} alt="" loading="lazy"/><span className="service-card-bottom">Explorar possibilidades <ArrowUpRight size={16}/></span></button>)}</div><div className="service-detail" aria-live="polite"><p>{services[active].description}<span>{services[active].tags}</span></p><div className="service-controls" aria-label="Escolher solução">{services.map((s,i)=><button key={s.title} aria-label={s.title} aria-pressed={active===i} onClick={()=>select(i)}>0{i+1}</button>)}</div></div></>;
}


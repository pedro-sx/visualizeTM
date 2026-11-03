(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const photos = window.PHOTOS;
  let model='Lucas', group='todos', list=[], index=0, split=50, loadToken=0;
  const stage=$('#stage'), frame=$('#image-frame'), slider=$('#slider');
  const before=$('#before'), after=$('#after');
  function resize(){
    const p=list[index]; if(!p)return;
    const scale=Math.min(stage.clientWidth/p.width,stage.clientHeight/p.height);
    frame.style.width=`${p.width*scale}px`;frame.style.height=`${p.height*scale}px`;
  }
  function setSplit(value){
    split=Number(value);slider.value=split;frame.style.setProperty('--split',`${split}%`);
    slider.setAttribute('aria-valuetext',`${split}% original, ${100-split}% editada`);
    $('#divider').style.opacity=(split===0||split===100)?'0':'1';
    document.querySelectorAll('[data-value]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.value)===split)));
  }
  function show(next,focusThumb=false){
    index=(next+list.length)%list.length;const p=list[index];const token=++loadToken;
    $('#image-error').hidden=true;
    frame.style.visibility='hidden';
    Promise.all([load(before,p.before),load(after,p.after)]).then(()=>{if(token===loadToken)frame.style.visibility='visible'}).catch(()=>{if(token===loadToken)$('#image-error').hidden=false});
    before.alt=`Original de ${p.model}: ${p.original}`;after.alt=`Edição final de ${p.model}: ${p.edited}`;
    $('#category').textContent=`${p.model.toUpperCase()} / ${p.group==='interno'?'ESTÚDIO':'EXTERNA'}`;
    $('#photo-title').textContent=`Fotografia ${p.id.split('-')[1]}`;
    $('#filename').textContent=p.original;
    $('#source-note').textContent=p.raw?'Antes: prévia original da câmera (CR2). Depois: versão do álbum.':'Antes: JPEG original. Depois: versão do álbum.';
    $('#count').textContent=`${String(index+1).padStart(2,'0')} / ${list.length}`;
    $('#prev').disabled=list.length<2;$('#next').disabled=list.length<2;
    document.querySelectorAll('.thumb').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
    if(focusThumb){const b=$(`.thumb[data-index="${index}"]`);if(b)b.scrollIntoView({block:'nearest',inline:'nearest'})}
    setSplit(50);resize();
  }
  function load(img,src){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=src;if(img.complete&&img.naturalWidth)resolve()})}
  function filter(){
    list=photos.filter(p=>p.model===model&&(group==='todos'||p.group===group));index=0;
    $('#thumbnails').style.setProperty('--rows',Math.ceil(list.length/4));
    $('#total').textContent=`${list.length} FOTOS`;
    $('#direction').textContent=model==='Lucas'?'Retrato profissional · luz suave e cenário orgânico.':'Retrato esportivo · contraste, cor e energia da quadra.';
    document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===model)));
    document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===group)));
    $('#thumbnails').replaceChildren(...list.map((p,i)=>{
      const b=document.createElement('button');b.className='thumb';b.dataset.index=i;
      b.setAttribute('aria-label',`${p.model}, ${p.group==='interno'?'interna':'externa'}, ${p.original}`);
      const img=document.createElement('img');img.src=p.thumb;img.alt='';img.loading='lazy';
      const num=document.createElement('span');num.textContent=p.id.split('-')[1];b.append(img,num);
      b.addEventListener('click',()=>show(i));return b;
    }));show(0);
  }
  document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>{model=b.dataset.model;group='todos';filter()}));
  document.querySelectorAll('[data-group]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.group;filter()}));
  document.querySelectorAll('[data-value]').forEach(b=>b.addEventListener('click',()=>setSplit(b.dataset.value)));
  slider.addEventListener('input',()=>setSplit(slider.value));
  $('#prev').addEventListener('click',()=>show(index-1,true));$('#next').addEventListener('click',()=>show(index+1,true));
  async function present(){
    if(document.body.classList.contains('presenting')){exit();return}
    document.body.classList.add('presenting');resize();
    try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen()}catch(e){}
    resize();
  }
  function exit(){document.body.classList.remove('presenting');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});resize()}
  $('#present').addEventListener('click',present);
  $('.viewer-bar').addEventListener('click',()=>{if(document.body.classList.contains('presenting'))exit()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)document.body.classList.remove('presenting');resize()});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){exit();return}
    if(e.target.matches('input,textarea,select'))return;
    if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true)}
    if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true)}
    if(e.key.toLowerCase()==='f'){e.preventDefault();present()}
  });
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize',resize);filter();
})();

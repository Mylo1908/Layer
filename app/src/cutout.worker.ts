import {removeBackground} from '@imgly/background-removal';
import {readResources} from './model-resources';
import {cleanAlpha,applyPhotoAlpha} from './alpha-cleanup';
// The whole inference runs off the UI thread; photos never leave the browser.
self.onmessage=async(event:MessageEvent<{image:Blob;publicPath:string}>)=>{
 try {
  self.postMessage({progress:'KI vorbereiten …'});
  await readResources(event.data.publicPath);
  const blob=await removeBackground(event.data.image,{publicPath:event.data.publicPath,model:'isnet_quint8',device:'cpu',proxyToWorker:false,output:{format:'image/png'},progress:(key,current,total)=>self.postMessage({progress:key.startsWith('fetch:')?`${key.includes('/models/')?'KI-Modell':'KI-Laufzeit'} laden · ${Math.round(current/Math.max(1,total)*100)} %`:'Kleidung erkennen und Hintergrund entfernen …'})});
  const bitmap=await createImageBitmap(blob),preview=new OffscreenCanvas(96,96),ctx=preview.getContext('2d')!;
  ctx.drawImage(bitmap,0,0,96,96);bitmap.close();
  const pixels=ctx.getImageData(0,0,96,96).data;let visible=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>30)visible++;
  if(visible<10)throw Error('Die KI konnte kein Kleidungsstück erkennen. Bitte das ganze Stück gut beleuchtet fotografieren.');
  self.postMessage({progress:'Kanten säubern und Freistellung fertigstellen …'});
  const full=await createImageBitmap(blob),canvas=new OffscreenCanvas(full.width,full.height),context=canvas.getContext('2d')!;
  context.drawImage(full,0,0);full.close();const mask=context.getImageData(0,0,canvas.width,canvas.height);
  const source=await createImageBitmap(event.data.image);context.clearRect(0,0,canvas.width,canvas.height);context.drawImage(source,0,0,canvas.width,canvas.height);source.close();const original=context.getImageData(0,0,canvas.width,canvas.height);original.data.set(applyPhotoAlpha(original.data,cleanAlpha(mask.data,canvas.width,canvas.height)));context.putImageData(original,0,0);
  self.postMessage({blob:await canvas.convertToBlob({type:'image/png'})});
 }
 catch(e){self.postMessage({error:e instanceof Error?e.message:String(e)});}
};

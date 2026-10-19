import type {Garment,Layer} from './types';
export const TEMPLATES=['Classic','Editorial','Compact'] as const;
export type CollageTemplate=typeof TEMPLATES[number];
export type Motif={id:string;category:Garment['category'];accessoryType?:Garment['accessoryType'];aspect:number};
export type Bounds={x:number;y:number;width:number;height:number};
export function alphaBounds(data:Uint8ClampedArray,w:number,h:number):Bounds|undefined{let x0=w,y0=h,x1=-1,y1=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>16){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return x1<0?undefined:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1};}
export function rotatedSize(width:number,aspect:number,rotation:number){const h=width/aspect,a=rotation*Math.PI/180;return {w:Math.abs(width*Math.cos(a))+Math.abs(h*Math.sin(a)),h:Math.abs(h*Math.cos(a))+Math.abs(width*Math.sin(a))};}
export function frame(layer:Layer,aspect:number){const s=rotatedSize(layer.width,aspect,layer.rotation);return {left:layer.x-s.w/2,right:layer.x+s.w/2,top:layer.y-s.h/2,bottom:layer.y+s.h/2};}
function visualRole(g:Motif){return g.category==='Kleider'?0:['T-Shirts','Longsleeves','Pullover','Hemden','Jacken'].includes(g.category)?1:['Hosen','Röcke'].includes(g.category)?2:g.category==='Schuhe'?3:4;}
function motifSize(g:Motif,template:CollageTemplate){const r=visualRole(g),compact=template==='Compact',many=compact?.92:1;let w=r<2?290:r===2?245:r===3?160:105,h=r===0?690:r===1?300:r===2?400:r===3?135:135;
 if(r===4){switch(g.accessoryType){case 'Ringe':case 'Anhänger':w=45;h=55;break;case 'Armbänder':case 'Uhren':w=62;h=95;break;case 'Halsketten':w=95;h=190;break;case 'Gürtel':w=240;h=240;break;case 'Taschen':case 'Rucksäcke':w=145;h=190;break;case 'Sonnenbrillen':case 'Brillen':w=115;h=65;break;case 'Schals':w=125;h=240;break;case 'Socken':case 'Handschuhe':w=90;h=140;break;default:w=110;h=140;}}
 return Math.min(w,h*g.aspect)*many;
}
/** Semantic anchors + bounded best-position packing. Variant is explicit, deterministic and undoable. */
export function layoutCollage(items:Motif[],template:CollageTemplate,variant=0){const compact=template==='Compact',editorial=template==='Editorial',placed:Array<{layer:Layer;box:ReturnType<typeof frame>}>=[],unplaced:string[]=[];const counts=new Map<number,number>(),v=Math.abs(Math.trunc(variant))%6;
 const ordered=[...items].sort((a,b)=>visualRole(a)-visualRole(b)||motifSize(b,template)-motifSize(a,template)||a.id.localeCompare(b.id));
 for(const g of ordered){if(placed.length>=32||!Number.isFinite(g.aspect)||g.aspect<=0){unplaced.push(g.id);continue;}const r=visualRole(g),n=counts.get(r)??0;counts.set(r,n+1);const flip=v%2===1,jitter=((v*7+n*3)%5-2)*9;
 let anchor=r===0?{x:270,y:420}:r===1?{x:compact?225:editorial?240:280,y:195+n*72}:r===2?{x:editorial?325:compact?250:280,y:570}:r===3?{x:compact?450:490,y:editorial?730:700}:{x:compact?475:n%2?500:80,y:125+Math.floor(n/(compact?1:2))*(compact?105:155)};
 if(r===4){if(flip)anchor.x=600-anchor.x;anchor.y=Math.min(810,anchor.y+jitter);if(editorial)anchor.x+=n%2?-18:18;}else if(r>0){anchor.x+=v===0?0:jitter;anchor.y+=v===0?0:(v%3-1)*15;}
 const base=motifSize(g,template);let chosen:typeof placed[number]|undefined;
 for(let attempt=0;attempt<9&&!chosen;attempt++){const width=base*Math.pow(.9,attempt);if(width<10)break;const rotation=editorial?(r<3?(n%2?-5:3):(n%2?7:-6)):r===4?(n%2?-2:2):0;const candidates=[anchor];for(let y=32;y<=868;y+=24)for(let x=32;x<=568;x+=24)candidates.push({x,y});let best=Infinity;
 for(const p of candidates){const layer:Layer={id:'collage-'+g.id,garmentId:g.id,x:p.x,y:p.y,width,rotation,locked:false};const box=frame(layer,g.aspect),gap=compact?9:editorial?23:16;if(box.left<24||box.right>576||box.top<24||box.bottom>876)continue;if(placed.some(q=>!(box.right+gap<=q.box.left||box.left-gap>=q.box.right||box.bottom+gap<=q.box.top||box.top-gap>=q.box.bottom)))continue;
 const anchorCost=Math.hypot(p.x-anchor.x,(p.y-anchor.y)*.9),edgeRole=r===4?Math.max(0,125-Math.abs(300-p.x))*.7:0;const score=anchorCost+edgeRole;if(score<best){best=score;chosen={layer,box};}}
 }
 if(chosen)placed.push(chosen);else unplaced.push(g.id);
 }return {layers:placed.map(p=>p.layer),unplaced};}
export function safeFilename(name:string){return (name.trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').slice(0,120)||'Collage')+'.png';}

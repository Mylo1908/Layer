import {layeringOf} from './garment-details';
import { type Category, type Garment, type Layer, uid } from './types';
export function guessCategory(name:string):Category|undefined {const n=name.toLowerCase();const rules:Array<[RegExp,Category]>=[[/longsleeve|langarm/,'Longsleeves'],[/pullover|strick|sweater|hoodie|pulli/,'Pullover'],[/jacke|mantel|blazer/,'Jacken'],[/t.?shirt|tee/,'T-Shirts'],[/hemd|bluse/,'Hemden'],[/hose|jeans|shorts/,'Hosen'],[/rock|skirt/,'Röcke'],[/kleid|dress/,'Kleider'],[/schuh|sneaker|stiefel/,'Schuhe'],[/gürtel|mütze|tasche|kette|schal/,'Accessoires']];return rules.find(([r])=>r.test(n))?.[1];}
export function defaultLayer(g:Garment):Layer {const bottoms=['Hosen','Röcke'].includes(g.category);const shoe=g.category==='Schuhe';return {id:uid(),garmentId:g.id,x:300,y:shoe?650:bottoms?500:g.category==='Kleider'?330:220,width:shoe?190:bottoms?215:300,rotation:0,locked:false};}
export function proposeLayers(gs:Garment[],layering:boolean):Layer[]{
 const pick=(a:Garment[])=>a[Math.floor(Math.random()*a.length)];
 const upper=(g:Garment)=>['T-Shirts','Longsleeves','Pullover','Hemden','Jacken'].includes(g.category);
 const base=pick(gs.filter(g=>layering?upper(g)&&['under','either'].includes(layeringOf(g)):['T-Shirts','Longsleeves','Pullover','Hemden','Kleider'].includes(g.category)));
 const layers:Layer[]=[];if(base){const l=defaultLayer(base);if(layering){l.y=245;l.width=310;}layers.push(l);}
 const bottom=base?.category==='Kleider'?undefined:pick(gs.filter(g=>['Hosen','Röcke'].includes(g.category)));if(bottom)layers.unshift(defaultLayer(bottom));
 if(layering){const top=pick(gs.filter(g=>upper(g)&&g.id!==base?.id&&['over','either'].includes(layeringOf(g))));if(top)layers.push(defaultLayer(top));}
 const shoes=pick(gs.filter(g=>g.category==='Schuhe'));if(shoes)layers.push(defaultLayer(shoes));return layers;
}
export function moveLayer(layers:Layer[],id:string,direction:number){const a=[...layers],i=a.findIndex(l=>l.id===id),j=Math.max(0,Math.min(a.length-1,i+direction));if(i<0)return a;[a[i],a[j]]=[a[j],a[i]];return a;}
/** Connected edge flood fill: enclosed garment pixels are protected. */
export function edgeMask(data:Uint8ClampedArray,w:number,h:number,tolerance:number){const out=new Uint8ClampedArray(data);const colors:number[][]=[];const step=Math.max(1,Math.floor(Math.min(w,h)/15));for(let x=0;x<w;x+=step)for(const y of [0,h-1]){const i=(y*w+x)*4;colors.push([data[i],data[i+1],data[i+2]]);}for(let y=0;y<h;y+=step)for(const x of [0,w-1]){const i=(y*w+x)*4;colors.push([data[i],data[i+1],data[i+2]]);}const visited=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;const enqueue=(p:number)=>{if(visited[p])return;visited[p]=1;const i=p*4;if(data[i+3]===0||colors.some(c=>(data[i]-c[0])**2+(data[i+1]-c[1])**2+(data[i+2]-c[2])**2<tolerance**2)){queue[tail++]=p;out[i+3]=0;}};for(let x=0;x<w;x++){enqueue(x);enqueue((h-1)*w+x);}for(let y=0;y<h;y++){enqueue(y*w);enqueue(y*w+w-1);}while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);if(x>0)enqueue(p-1);if(x<w-1)enqueue(p+1);if(y>0)enqueue(p-w);if(y<h-1)enqueue(p+w);}return out;}

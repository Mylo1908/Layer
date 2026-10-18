import type {Garment} from './types';
/** Keep URLs across metadata-only changes; retire replaced URLs only after React has committed their replacements. */
export class ImageUrls{
 private active=new Map<string,{blob:Blob;url:string}>();private retired=new Set<string>();
 constructor(private create=(b:Blob)=>URL.createObjectURL(b),private revoke=(u:string)=>URL.revokeObjectURL(u)){}
 reconcile(gs:Garment[]){const next=new Map<string,{blob:Blob;url:string}>();for(const g of gs){const old=this.active.get(g.id);next.set(g.id,old?.blob===g.image?old:{blob:g.image,url:this.create(g.image)});}for(const [id,item]of this.active)if(next.get(id)!==item)this.retired.add(item.url);this.active=next;return Object.fromEntries([...next].map(([id,x])=>[id,x.url]));}
 releaseAfterCommit(displayed:Record<string,string>){const used=new Set(Object.values(displayed));for(const url of this.retired)if(!used.has(url)){this.revoke(url);this.retired.delete(url);}}
 dispose(){for(const x of this.active.values())this.revoke(x.url);for(const u of this.retired)this.revoke(u);this.active.clear();this.retired.clear();}
}

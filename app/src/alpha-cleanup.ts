/** Remove small disconnected mask speckles while retaining multiple garment parts. */
export function cleanAlpha(data:Uint8ClampedArray,w:number,h:number){
 const labels=new Int32Array(w*h),queue=new Int32Array(w*h),sizes=[0];let largest=0;
 for(let p=0;p<w*h;p++){if(labels[p]||data[p*4+3]<24)continue;const id=sizes.length;let head=0,tail=1;queue[0]=p;labels[p]=id;
  while(head<tail){const current=queue[head++],x=current%w,y=Math.floor(current/w);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const n=ny*w+nx;if(!labels[n]&&data[n*4+3]>=24){labels[n]=id;queue[tail++]=n;}}}
  sizes.push(tail);largest=Math.max(largest,tail);
 }
 if(!largest)return new Uint8ClampedArray(data);
 const threshold=Math.max(1,Math.ceil(largest*.025)),keep=sizes.map((size,id)=>id>0&&size>=threshold),out=new Uint8ClampedArray(data);
 for(let p=0;p<w*h;p++){if(keep[labels[p]])continue;let feather=false;if(!labels[p]&&data[p*4+3]>0){const x=p%w,y=Math.floor(p/w);for(let dy=-1;dy<=1&&!feather;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&keep[labels[ny*w+nx]]){feather=true;break;}}}if(!feather)out[p*4+3]=0;}
 return out;
}

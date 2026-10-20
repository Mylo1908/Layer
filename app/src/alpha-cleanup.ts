/** Remove small disconnected mask speckles while retaining multiple garment parts. */
export function cleanAlpha(data:Uint8ClampedArray,w:number,h:number){
 const labels=new Int32Array(w*h),queue=new Int32Array(w*h),sizes=[0],spans=[0];let largest=0;
 for(let p=0;p<w*h;p++){if(labels[p]||data[p*4+3]<8)continue;const id=sizes.length;let head=0,tail=1,minX=p%w,maxX=p%w,minY=Math.floor(p/w),maxY=Math.floor(p/w);queue[0]=p;labels[p]=id;
  while(head<tail){const current=queue[head++],x=current%w,y=Math.floor(current/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const n=ny*w+nx;if(!labels[n]&&data[n*4+3]>=8){labels[n]=id;queue[tail++]=n;}}}
  sizes.push(tail);spans.push(Math.max(maxX-minX+1,maxY-minY+1));largest=Math.max(largest,tail);
 }
 if(!largest)return new Uint8ClampedArray(data);
 const threshold=Math.max(2,Math.min(12,Math.ceil(largest*.001))),keep=sizes.map((size,id)=>id>0&&(size>=threshold||size>=3&&spans[id]>=4)),out=new Uint8ClampedArray(data);
 for(let p=0;p<w*h;p++){if(keep[labels[p]])continue;let feather=false;if(!labels[p]&&data[p*4+3]>0){const x=p%w,y=Math.floor(p/w);for(let dy=-1;dy<=1&&!feather;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&keep[labels[ny*w+nx]]){feather=true;break;}}}if(!feather)out[p*4+3]=0;}
 return out;
}

/** Keep all original RGB values: model output supplies only alpha. */
export function applyPhotoAlpha(original:Uint8ClampedArray,mask:Uint8ClampedArray){if(original.length!==mask.length)throw Error('Freistellmaske passt nicht zum Foto.');const out=new Uint8ClampedArray(original);for(let i=3;i<out.length;i+=4)out[i]=Math.round(original[i]*mask[i]/255);return out;}

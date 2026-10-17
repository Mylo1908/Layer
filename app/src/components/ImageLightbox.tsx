import {useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';
export function ImageLightbox({image,original,name,onClose}:{image:Blob;original?:Blob;name:string;onClose:()=>void}){
 const [source,S]=useState<'image'|'original'>('image'),[url,U]=useState('');const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const blob=source==='original'&&original?original:image;const u=URL.createObjectURL(blob);U(u);return()=>URL.revokeObjectURL(u);},[source,image,original]);
 useEffect(()=>{const el=dialog.current,previous=document.activeElement as HTMLElement|null;el?.showModal();return()=>{el?.close();previous?.focus();};},[]);
 return <dialog ref={dialog} className="image-lightbox" aria-label="Bild-Großansicht" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section className="lightbox-content"><header><h2>{name}</h2><button autoFocus className="icon-button" onClick={onClose} aria-label="Großansicht schließen"><X/></button></header>{original&&<div className="photo-actions"><button className="button secondary" aria-pressed={source==='image'} onClick={()=>S('image')}>Produktbild</button><button className="button secondary" aria-pressed={source==='original'} onClick={()=>S('original')}>Originalbild</button></div>}<div className="checker lightbox-image"><img src={url} alt={source==='original'?`Original: ${name}`:name}/></div></section></dialog>;
}

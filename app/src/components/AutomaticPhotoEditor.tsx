import {useEffect,useRef,useState} from 'react';
import {Camera,ImagePlus,X,Sparkles} from 'lucide-react';
import {normalizePhoto,aiCutout,requireTransparency,cropTransparent} from '../images';
import {freshTurnstileToken} from '../turnstile';
import {generateProduct} from '../automatic-prettify';
import {readDraft,writeDraft,deleteDraft,type PhotoDraft} from '../photo-draft';
import {uid,type Garment} from '../types';
import {useModal} from '../modal';

export function AutomaticPhotoEditor({endpoint,onClose,onSave}:{endpoint:string;onClose:()=>void;onSave:(g:Garment)=>Promise<void>}){
 useModal();
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[photo,setPhoto]=useState<Blob>(),[preview,setPreview]=useState('');
 const draft=useRef<PhotoDraft|undefined>(undefined),locked=useRef(false),id=useRef<string>(uid()),verification=useRef<HTMLDivElement>(null);
 useEffect(()=>{let active=true;readDraft('automatic-new').then(d=>{if(active){draft.current=d;if(d?.garmentId)id.current=d.garmentId;setPhoto(d?.original);setReady(true);}}).catch(()=>{if(active){setError('Entwurf konnte nicht geladen werden.');setReady(true);}});return()=>{active=false;};},[]);
 useEffect(()=>{if(!photo)return;const u=URL.createObjectURL(photo);setPreview(u);return()=>URL.revokeObjectURL(u);},[photo]);
 async function process(file?:File){
  if(locked.current)return;locked.current=true;setBusy(true);setError('');
  try{
   if(file){
    setStatus('Foto vorbereiten …');const original=await normalizePhoto(file);id.current=uid();
    draft.current={original,garmentId:id.current,analysisText:'',name:'',category:'T-Shirts',color:'Neutral',season:'Ganzjährig',notes:''};setPhoto(original);
    await writeDraft('automatic-new',draft.current);
   }
   const d=draft.current;if(!d?.original)throw Error('Bitte zuerst ein Foto wählen.');
   if(!d.generated||!d.analysis){
    setStatus('Dein Kleidungsstück wird analysiert und als neues Produktbild erstellt …');
    const reference=await normalizePhoto(d.original,511);
    setStatus('Sicherheitsprüfung …');
    if(!verification.current)throw Error('Sicherheitsprüfung konnte nicht gestartet werden.');
    const token=await freshTurnstileToken(verification.current);
    setStatus('Dein Produktbild wird erstellt …');
    const generated=await generateProduct(endpoint,reference,token);
    d.generated=generated.image;d.analysis=generated.analysis;d.name=generated.analysis.name;d.category=generated.analysis.category;d.color=generated.analysis.color;
    await writeDraft('automatic-new',d);
   }
   if(!d.result){
    setStatus('Hintergrund entfernen …');
    const cutout=await aiCutout(d.generated,s=>setStatus(`Hintergrund entfernen · ${s}`));
    await requireTransparency(cutout);d.result=await cropTransparent(cutout);await writeDraft('automatic-new',d);
   }
   setStatus('Im Kleiderschrank speichern …');
   await onSave({id:id.current,name:d.analysis.name,category:d.analysis.category,color:d.analysis.color,season:'Ganzjährig',notes:'',favorite:false,image:d.result,processed:d.result,original:d.original,createdAt:Date.now(),imageSource:'automatic'});
   await deleteDraft('automatic-new');
  }catch(e){setError(e instanceof Error?e.message:'Verarbeitung fehlgeschlagen.');setStatus('');}
  finally{locked.current=false;setBusy(false);}
 }
 return <div className="modal-backdrop"><section className="modal photo-modal" role="dialog" aria-modal="true" aria-label="Automatisches KI-Produktbild"><header className="modal-head"><div><span className="eyebrow">LAYER PRETTIFY</span><h2>Ein Foto. Dein neues Produktbild.</h2></div><button className="icon-button" disabled={busy} onClick={onClose} aria-label="Schließen"><X/></button></header>
 <p>Wähle ein Foto oder fotografiere ein einzelnes Kleidungsstück. Layer analysiert es, entwickelt den Bildauftrag, erstellt ein neues Bild und speichert es ohne Hintergrund in deinem Schrank.</p>
 <p className="micro">Mit der Fotoauswahl sendest du eine verkleinerte Referenz zur KI-Verarbeitung an Cloudflare. Das Original bleibt auf diesem Gerät. KI-Bilder können bei Mustern und Aufdrucken abweichen; du kannst Original und Ergebnis später vergleichen.</p>
 {preview&&<div className="workflow-previews"><figure className="workflow-preview"><figcaption>Dein Referenzfoto</figcaption><div className="checker"><img src={preview} alt="Referenzfoto des Kleidungsstücks"/></div></figure></div>}
 <div className="photo-actions"><label className="button primary"><Camera size={17}/> Fotografieren<input hidden type="file" accept="image/*" capture="environment" disabled={!ready||busy} onChange={e=>{if(e.target.files?.[0])void process(e.target.files[0]);e.target.value='';}}/></label><label className="button secondary"><ImagePlus size={17}/> Foto wählen<input hidden type="file" accept="image/*" disabled={!ready||busy} onChange={e=>{if(e.target.files?.[0])void process(e.target.files[0]);e.target.value='';}}/></label></div>
 <div ref={verification} aria-label="Sicherheitsprüfung"/>{busy&&<p className="status" role="status"><span className="spinner"/>{status}</p>}{busy&&<p className="micro">Das kann einige Minuten dauern. Bitte Layer geöffnet lassen. Beim ersten Mal werden zusätzlich die Dateien zum Freistellen geladen.</p>}
 {error&&<p className="error" role="alert">{error}</p>}{!busy&&photo&&<button className="button primary" onClick={()=>void process()}><Sparkles size={17}/>{error?'Erneut versuchen':'Verarbeitung fortsetzen'}</button>}
 <footer className="modal-foot"><button className="button secondary" disabled={busy} onClick={onClose}>Schließen</button></footer></section></div>;
}

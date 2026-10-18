import {parseReview,type Review,type ReviewEdits} from './review-workflow';
import type {Season} from './garment-details';
export async function loadAutomaticEndpoint():Promise<string>{
 const res=await fetch(new URL('ai-config.json',new URL(import.meta.env.BASE_URL,document.baseURI)),{cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!res.ok)throw Error('KI-Konfiguration konnte nicht geladen werden.');const {endpoint}=await res.json();if(!endpoint)return '';
 const url=new URL(endpoint);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Ungültige KI-Konfiguration.');return url.href;
}
async function call(endpoint:string,reference:Blob,token:string,phase:'analyze'|'generate',context:unknown){
 const encodedContext=encodeURIComponent(JSON.stringify(context));if(encodedContext.length>48000)throw Error('Die Detailangaben sind zu lang. Bitte Beschreibungen kürzen und erneut versuchen.');
 let response:Response;try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'image/png','X-Turnstile-Token':token,'X-Layer-Phase':phase,'X-Layer-Context':encodedContext},body:reference,signal:AbortSignal.timeout(180000),credentials:'omit',redirect:'error'});}catch{throw Error('KI-Verbindung unterbrochen oder Zeitlimit erreicht. Dein Foto bleibt erhalten. Bitte erneut versuchen.');}
 const data=await response.json().catch(()=>null);if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'Die KI-Verarbeitung ist fehlgeschlagen. Dein Foto bleibt erhalten.');return data;
}
export async function analyzeProduct(endpoint:string,reference:Blob,token:string,context:{userHints:string;seasons:Season[];material?:string;materialDetails?:string;measuredPalette?:import('./appearance').MeasuredColor[]}):Promise<{analysis:Review;ticket:string}>{const protocol=await fetch(endpoint,{method:'OPTIONS',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!protocol.ok||protocol.headers.get('X-Layer-Protocol')!=='review-v2')throw Error('Die neue KI-Verbindung wird noch bereitgestellt. Bitte gleich erneut versuchen.');const data=await call(endpoint,reference,token,'analyze',context);if(typeof data?.ticket!=='string'||!data.ticket)throw Error('Die Analyse konnte nicht zur Bestätigung vorbereitet werden.');return {analysis:parseReview(data.analysis),ticket:data.ticket};}
export async function generateProduct(endpoint:string,reference:Blob,token:string,approval:{ticket:string;edits:ReviewEdits;confirmed:true;userHints?:string;refinement?:string}):Promise<{analysis:Review;image:Blob}>{
 if(approval.confirmed!==true||!approval.ticket)throw Error('Bitte zuerst die Analyse bestätigen.');
 if(approval.refinement){const protocol=await fetch(endpoint,{method:'OPTIONS',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!protocol.ok||!protocol.headers.get('X-Layer-Features')?.split(/,\s*/).includes('refinement-v1'))throw Error('Die Nachbesserung wird noch bereitgestellt. Dein bisheriges Bild bleibt erhalten.');}
 const data=await call(endpoint,reference,token,'generate',approval);
 if(typeof data?.image!=='string'||!data.image||data.image.length>20_000_000)throw Error('Die KI hat kein Bild geliefert.');const analysis=parseReview(data.analysis);
 let bytes:Uint8Array<ArrayBuffer>;try{bytes=Uint8Array.from(atob(data.image),c=>c.charCodeAt(0));}catch{throw Error('Das KI-Bild konnte nicht geöffnet werden.');}
 const type=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':'';
 if(!type)throw Error('Das KI-Bild hat kein unterstütztes Bildformat.');return {analysis,image:new Blob([bytes],{type})};
}

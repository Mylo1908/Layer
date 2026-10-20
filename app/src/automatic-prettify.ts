import {parseReview,type Review} from './review-workflow';
import type {Season} from './garment-details';
export async function loadAutomaticEndpoint():Promise<string>{
 const res=await fetch(new URL('ai-config.json',new URL(import.meta.env.BASE_URL,document.baseURI)),{cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!res.ok)throw Error('KI-Konfiguration konnte nicht geladen werden.');const {endpoint}=await res.json();if(!endpoint)return '';
 const url=new URL(endpoint);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Ungültige KI-Konfiguration.');return url.href;
}
async function call(endpoint:string,reference:Blob,token:string,phase:'analyze',context:unknown){
 const encodedContext=encodeURIComponent(JSON.stringify(context));if(encodedContext.length>48000)throw Error('Die Detailangaben sind zu lang. Bitte Beschreibungen kürzen und erneut versuchen.');
 let response:Response;try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'image/png','X-Turnstile-Token':token,'X-Layer-Phase':phase,'X-Layer-Context':encodedContext},body:reference,signal:AbortSignal.timeout(180000),credentials:'omit',redirect:'error'});}catch{throw Error('KI-Verbindung unterbrochen oder Zeitlimit erreicht. Dein Foto bleibt erhalten. Bitte erneut versuchen.');}
 const data=await response.json().catch(()=>null);if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'Die KI-Verarbeitung ist fehlgeschlagen. Dein Foto bleibt erhalten.');return data;
}
export async function analyzeProduct(endpoint:string,reference:Blob,token:string,context:{userHints:string;seasons:Season[];material?:string;materialDetails?:string;measuredPalette?:import('./appearance').MeasuredColor[]}):Promise<{analysis:Review}>{const protocol=await fetch(endpoint,{method:'OPTIONS',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!protocol.ok||protocol.headers.get('X-Layer-Protocol')!=='photo-metadata-v1')throw Error('Die neue KI-Verbindung wird noch bereitgestellt. Bitte gleich erneut versuchen.');const data=await call(endpoint,reference,token,'analyze',context);return {analysis:parseReview(data.analysis)};}

import {parseAnalysis,type Analysis} from './chat-workflow';
export async function loadAutomaticEndpoint():Promise<string>{
 const res=await fetch(new URL('ai-config.json',new URL(import.meta.env.BASE_URL,document.baseURI)),{cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!res.ok)throw Error('KI-Konfiguration konnte nicht geladen werden.');
 const {endpoint}=await res.json();
 if(!endpoint)return '';
 const url=new URL(endpoint);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Ungültige KI-Konfiguration.');
 return url.href;
}
export async function generateProduct(endpoint:string,reference:Blob,token:string):Promise<{analysis:Analysis;image:Blob}>{
 let response:Response;
 try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'image/png','X-Turnstile-Token':token},body:reference,signal:AbortSignal.timeout(180000),credentials:'omit',redirect:'error'});}catch{throw Error('KI-Verbindung unterbrochen oder Zeitlimit erreicht. Dein Foto bleibt erhalten. Bitte erneut versuchen.');}
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'Die KI konnte kein Produktbild erstellen. Bitte später erneut versuchen.');
 if(typeof data?.image!=='string'||!data.image||data.image.length>20_000_000)throw Error('Die KI hat kein Bild geliefert.');
 const analysis=parseAnalysis(JSON.stringify(data.analysis));
 let bytes:Uint8Array<ArrayBuffer>;try{bytes=Uint8Array.from(atob(data.image),c=>c.charCodeAt(0));}catch{throw Error('Das KI-Bild konnte nicht geöffnet werden.');}
 const type=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':'';
 if(!type)throw Error('Das KI-Bild hat kein unterstütztes Bildformat.');
 return {analysis,image:new Blob([bytes],{type})};
}

export type ResourceMap=Record<string,{size:number;mime:string;chunks:Array<{name:string;hash:string;offsets:[number,number]}>}>;
export const MODEL_KEYS=['/models/isnet_quint8','/onnxruntime-web/ort-wasm-simd-threaded.wasm','/onnxruntime-web/ort-wasm-simd-threaded.mjs'] as const;
export function validateResources(value:unknown,base:string):ResourceMap {
 if(!value||typeof value!=='object')throw Error('Die KI-Dateiliste ist ungültig.');
 const map=value as ResourceMap;const baseUrl=new URL(base);const origin=baseUrl.origin;
 for(const key of MODEL_KEYS){const entry=map[key];if(!entry||!Number.isInteger(entry.size)||entry.size<=0||typeof entry.mime!=='string'||!Array.isArray(entry.chunks)||!entry.chunks.length)throw Error('Die KI-Dateiliste ist unvollständig.');let offset=0;
  for(const c of entry.chunks){if(!c||typeof c.name!=='string'||!Array.isArray(c.offsets)||c.offsets.length!==2||c.offsets[0]!==offset||!Number.isInteger(c.offsets[1])||c.offsets[1]<=offset||new URL(c.name,base).origin!==origin||!new URL(c.name,base).pathname.startsWith(baseUrl.pathname)||!!new URL(c.name,base).search||!!new URL(c.name,base).hash)throw Error('Ein KI-Dateipfad oder Dateibereich ist ungültig.');offset=c.offsets[1];}
  if(offset!==entry.size)throw Error('Die KI-Dateiliste enthält unvollständige Daten.');
 }return map;
}
export async function readResources(base:string,fetcher:typeof fetch=fetch):Promise<ResourceMap>{
 const r=await fetcher(new URL('resources.json',base),{cache:'no-cache'});
 if(!r.ok)throw Error(`KI-Dateiliste konnte nicht geladen werden (HTTP ${r.status}). Bitte die App aktualisieren und erneut versuchen.`);
 let value:unknown;try{value=await r.json();}catch{throw Error('Die KI-Dateiliste enthält kein gültiges JSON.');}
 return validateResources(value,base);
}

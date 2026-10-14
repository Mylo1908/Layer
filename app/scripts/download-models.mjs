import {mkdir,readFile,writeFile,stat,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const base='https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';
const dir=path.resolve('public/models');await mkdir(dir,{recursive:true});
async function fetchBytes(url){for(let attempt=0;attempt<3;attempt++){try{const r=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error(`HTTP ${r.status}: ${url}`);return Buffer.from(await r.arrayBuffer());}catch(e){if(attempt===2)throw e;console.log('Download wird erneut versucht …');}}}
let resources;try{resources=JSON.parse(await readFile(path.join(dir,'resources.json'),'utf8'));}catch{resources=JSON.parse((await fetchBytes(base+'resources.json')).toString());}
const needed=['/models/isnet_quint8','/onnxruntime-web/ort-wasm-simd-threaded.wasm','/onnxruntime-web/ort-wasm-simd-threaded.mjs'];
const selected={};for(const key of needed){if(!resources[key])throw Error(`Modelldaten fehlen: ${key}`);selected[key]=resources[key];}
const chunks=[...new Map(Object.values(selected).flatMap(r=>r.chunks).map(c=>[c.name,c])).values()];
console.log(`KI-Paket: ${chunks.length} Dateien (einmaliger Download, danach lokal).`);
for(let i=0;i<chunks.length;i++){const c=chunks[i],dest=path.join(dir,c.name);const expected=c.offsets[1]-c.offsets[0];let data;try{data=await readFile(dest);}catch{}if(!data||data.length!==expected){console.log(`${i+1}/${chunks.length}: ${c.name}`);data=await fetchBytes(base+c.name);if(data.length!==expected)throw Error(`Download unvollständig: ${c.name}`);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,data);}}
await writeFile(path.join(dir,'resources.json'),JSON.stringify(selected,null,2));
await writeFile(path.join(dir,'checksums.json'),JSON.stringify(Object.fromEntries(await Promise.all(chunks.map(async c=>[c.name,createHash('sha256').update(await readFile(path.join(dir,c.name))).digest('hex')]))),null,2));
console.log('KI-Modell und WASM stehen bereit. Kein externer KI-Dienst nötig.');

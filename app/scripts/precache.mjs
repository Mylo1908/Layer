import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const all=await walk('dist');const files=all.filter(f=>!f.endsWith('sw.js')&&!f.endsWith('ai-config.json')&&!f.includes('models'+path.sep)&&!f.endsWith('.map')&&!path.basename(f).startsWith('.')).map(f=>'./'+path.relative('dist',f).split(path.sep).join('/'));
const hash=createHash('sha256');for(const f of all.filter(f=>!f.includes('models'+path.sep)))hash.update(await readFile(f));
const sw=await readFile('public/sw.js','utf8');await writeFile('dist/sw.js',sw.replace('__VERSION__',hash.digest('hex').slice(0,12)).replace('/*__PRECACHE__*/[]',JSON.stringify(files)));
console.log(`Offline-Shell: ${files.length} Dateien. KI wird separat auf Wunsch offline gespeichert.`);

import {access,cp,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
try{await access('public/models/resources.json');}catch{
 try{let source='dist/models';try{await access(source+'/resources.json');}catch{source='../models';await access(source+'/resources.json');}await mkdir('public/models',{recursive:true});await cp(source,'public/models',{recursive:true});console.log('KI-Dateien aus dem fertigen Build übernommen.');}
 catch{const result=spawnSync(process.execPath,['scripts/download-models.mjs'],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);}
}

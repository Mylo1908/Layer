import {rm} from 'node:fs/promises';
// Called only after prepare-models has retained the bundled AI files in public/.
await rm('dist',{recursive:true,force:true});

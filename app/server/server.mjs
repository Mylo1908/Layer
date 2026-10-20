// Compatibility tombstone for installations of the retired optional image server.
// There are no provider credentials, provider requests or image generation paths.
import {createServer} from 'node:http';import {pathToFileURL} from 'node:url';
export function createApp(env=process.env,_request=fetch){if(!env.ALLOWED_ORIGIN)throw Error('Set ALLOWED_ORIGIN.');return createServer((req,res)=>{res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');if(req.headers.origin!==env.ALLOWED_ORIGIN){res.writeHead(403);return res.end();}res.setHeader('Access-Control-Allow-Origin',env.ALLOWED_ORIGIN);res.writeHead(req.url==='/prettify'?410:404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Generative Bildverarbeitung wurde entfernt.',code:'GENERATION_REMOVED'}));});}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createApp().listen(Number(process.env.PORT||8787),'127.0.0.1');

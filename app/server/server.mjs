// Node.js 22+. Deploy behind HTTPS. Never put OPENAI_API_KEY in frontend files.
import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {pathToFileURL} from 'node:url';
export function createApp(env=process.env,request=fetch){
 const {OPENAI_API_KEY,LAYER_ACCESS_TOKEN,ALLOWED_ORIGIN}=env;
 if(!OPENAI_API_KEY||!LAYER_ACCESS_TOKEN||LAYER_ACCESS_TOKEN.length<32||!ALLOWED_ORIGIN)throw Error('Set OPENAI_API_KEY, LAYER_ACCESS_TOKEN (32+ characters), ALLOWED_ORIGIN.');
 let active=false,count=0,day='';
 return createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');
  const send=(code,message)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify({error:message}));};
  if(req.headers.origin!==ALLOWED_ORIGIN)return send(403,'Origin denied');
  res.setHeader('Access-Control-Allow-Origin',ALLOWED_ORIGIN);
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.writeHead(204);return res.end();}
  if(req.url!=='/prettify'||req.method!=='POST')return send(404,'Not found');
  const supplied=Buffer.from(req.headers.authorization??''),expected=Buffer.from(`Bearer ${LAYER_ACCESS_TOKEN}`);
  if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return send(401,'Unauthorized');
  if(req.headers['content-type']!=='image/png')return send(415,'PNG required');
  const today=new Date().toISOString().slice(0,10);if(day!==today){day=today;count=0;}
  if(active||count>=Number(env.DAILY_LIMIT||20))return send(429,'Limit reached');
  active=true;
  try{
   const parts=[];let size=0;for await(const part of req){size+=part.length;if(size>10*1024*1024){send(413,'Image too large');return;}parts.push(part);}
   const input=Buffer.concat(parts);if(!input.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return send(415,'Invalid PNG');
   count++;
   const form=new FormData();form.set('model',env.OPENAI_IMAGE_MODEL||'gpt-image-1.5');form.set('image',new Blob([input],{type:'image/png'}),'garment.png');form.set('background','transparent');form.set('output_format','png');form.set('size','1024x1024');form.set('quality','medium');
   form.set('prompt','Analyze the reference garment and recreate ONLY that garment as a clean, photorealistic front-view flat lay product image, fully visible and centered. Remove wearer, hands, hangers, furniture and background. Improve lighting and smooth distracting wrinkles. Preserve exact cut, proportions, length, colors, fabric texture, pattern, printed text and logos. Do not add accessories or invent styling. Transparent alpha background, no exterior cast shadow.');
   const upstream=await request('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:`Bearer ${OPENAI_API_KEY}`},body:form,signal:AbortSignal.timeout(210000)});
   if(!upstream.ok)return send(502,'Image provider failed');
   const result=await upstream.json(),encoded=result.data?.[0]?.b64_json;if(!encoded)return send(502,'No image returned');
   res.writeHead(200,{'Content-Type':'image/png'});res.end(Buffer.from(encoded,'base64'));
  }catch{if(!res.headersSent)send(502,'Processing failed');else res.end();}finally{active=false;}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createApp().listen(Number(process.env.PORT||8787),'0.0.0.0');

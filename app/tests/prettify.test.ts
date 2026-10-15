import test from 'node:test';
import assert from 'node:assert/strict';
import {serverUrl} from '../src/prettify';
import {createApp} from '../server/server.mjs';
test('KI-Serveradresse lehnt unsichere URLs und Zugangsdaten ab',()=>{
 for(const url of ['http://example.com','https://user:pass@example.com','https://example.com?key=secret','https://example.com/#token'])assert.throws(()=>serverUrl(url));
 assert.equal(serverUrl('https://example.com/'),'https://example.com');
});
test('Bildserver prüft Zugang, Origin, PNG und Tageslimit',async()=>{
 let calls=0;const token='a'.repeat(32),origin='https://mylo1908.github.io',png=Buffer.from([137,80,78,71,13,10,26,10]);
 const server=createApp({OPENAI_API_KEY:'test',LAYER_ACCESS_TOKEN:token,ALLOWED_ORIGIN:origin,DAILY_LIMIT:'1'},async(url,options)=>{
  calls++;assert.equal(url,'https://api.openai.com/v1/images/edits');assert.equal(options.body.get('background'),'transparent');assert.equal(options.body.get('output_format'),'png');
  return new Response(JSON.stringify({data:[{b64_json:png.toString('base64')}]}));
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/prettify`;
 try{
  const headers={Origin:origin,Authorization:`Bearer ${token}`,'Content-Type':'image/png'};
  assert.equal((await fetch(url,{method:'POST',body:png})).status,403);
  assert.equal((await fetch(url,{method:'POST',headers:{...headers,Authorization:'Bearer wrong'},body:png})).status,401);
  assert.equal((await fetch(url,{method:'POST',headers,body:'invalid'})).status,415);assert.equal(calls,0);
  const result=await fetch(url,{method:'POST',headers,body:png});assert.equal(result.status,200);assert.equal(result.headers.get('content-type'),'image/png');assert.deepEqual(Buffer.from(await result.arrayBuffer()),png);
  assert.equal((await fetch(url,{method:'POST',headers,body:png})).status,429);assert.equal(calls,1);
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});

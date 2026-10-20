import test from 'node:test';
import assert from 'node:assert/strict';
import {serverUrl} from '../src/prettify';
import {createApp} from '../server/server.mjs';
test('KI-Serveradresse lehnt unsichere URLs und Zugangsdaten ab',()=>{
 for(const url of ['http://example.com','https://user:pass@example.com','https://example.com?key=secret','https://example.com/#token'])assert.throws(()=>serverUrl(url));
 assert.equal(serverUrl('https://example.com/'),'https://example.com');
});
test('retired optional image server always returns 410 without credentials or provider calls',async()=>{let calls=0;const origin='https://mylo1908.github.io',server=createApp({ALLOWED_ORIGIN:origin},async()=>{calls++;throw Error('must not call');});await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}/prettify`;try{assert.equal((await fetch(url,{method:'POST',body:'old'})).status,403);for(const body of ['invalid','old photo'])assert.equal((await fetch(url,{method:'POST',headers:{Origin:origin},body})).status,410);assert.equal(calls,0);}finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}});

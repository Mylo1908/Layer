import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanAlpha} from '../src/alpha-cleanup';
test('Kleine isolierte Hintergrundreste verschwinden, Kleidungsstück und weiche Kante bleiben',()=>{const w=30,h=30,d=new Uint8ClampedArray(w*h*4);for(let y=8;y<23;y++)for(let x=8;x<23;x++)d[(y*w+x)*4+3]=255;d[(7*w+10)*4+3]=10;d[3]=255;const out=cleanAlpha(d,w,h);assert.equal(out[3],0);assert.equal(out[(7*w+10)*4+3],10);assert.equal(out[(10*w+10)*4+3],255);assert.equal(d[3],255);});
test('Zwei getrennte große Teile, zum Beispiel ein Schuhpaar, bleiben erhalten',()=>{const w=40,h=30,d=new Uint8ClampedArray(w*h*4);for(let y=5;y<25;y++)for(const [start,end] of [[3,13],[25,35]])for(let x=start;x<end;x++)d[(y*w+x)*4+3]=255;const out=cleanAlpha(d,w,h);assert.equal(out[(10*w+8)*4+3],255);assert.equal(out[(10*w+30)*4+3],255);});
test('Vollständig transparente Bilder bleiben transparent',()=>{const d=new Uint8ClampedArray(16);assert.deepEqual(cleanAlpha(d,2,2),d);});

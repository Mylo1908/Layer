import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {parseAnalysis} from '../src/chat-workflow';
import {writeDraft,readDraft,deleteDraft} from '../src/photo-draft';
const a={name:'Creme-Pullover',category:'Pullover',color:'Creme',imagePrompt:'Cremefarbener Strickpullover mit langem Arm, Rundhalsausschnitt und breiten Rippbündchen.'};
test('Metadaten-JSON wird ohne Bildauftrag validiert; alte Prompts werden ignoriert',()=>{const parsed=parseAnalysis('```json\n'+JSON.stringify(a)+'\n```');assert.equal(parsed.category,'Pullover');assert.equal((parsed as any).imagePrompt,undefined);for(const input of ['kein JSON','null',JSON.stringify({...a,category:'Unbekannt'})])assert.throws(()=>parseAnalysis(input));});
test('Foto und KI-Ergebnis bleiben im wiederherstellbaren Entwurf getrennt',async()=>{const original=new Blob(['reference']),result=new Blob(['generated']);await writeDraft('test',{original,result,analysis:parseAnalysis(JSON.stringify(a)),analysisText:JSON.stringify(a),name:a.name,category:a.category,color:a.color,season:'Winter',notes:''});const d=await readDraft('test');assert.equal(await d?.original?.text(),'reference');assert.equal(await d?.result?.text(),'generated');assert.equal((d?.analysis as any)?.imagePrompt,undefined);await deleteDraft('test');assert.equal(await readDraft('test'),undefined);});

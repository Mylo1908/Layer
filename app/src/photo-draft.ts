import {openDB} from 'idb';
import type {Analysis} from './chat-workflow';
export type PhotoDraft={original?:Blob;result?:Blob;analysis?:Analysis;analysisText:string;name:string;category:string;color:string;season:string;notes:string};
const db=()=>openDB('layer-photo-drafts',1,{upgrade(d){d.createObjectStore('drafts');}});
export async function readDraft(id:string):Promise<PhotoDraft|undefined>{const d=await db();return d.get('drafts',id);}
export async function writeDraft(id:string,draft:PhotoDraft){const d=await db();await d.put('drafts',draft,id);}
export async function deleteDraft(id:string){const d=await db();await d.delete('drafts',id);}

import {openDB} from 'idb';
import {type Season,type Layering} from './garment-details';
import type {Analysis} from './chat-workflow';
export type PhotoDraft=import('./purchase').PurchaseDraft & import('./visual-details').VisualDetails & import('./photos').PhotoFields & {accessoryType?:import('./accessories').AccessoryType;workflowVersion?:2;reviewStatus?:'processing'|'review';refinement?:string;revision?:number;previousGenerated?:Blob;previousResult?:Blob;reference?:Blob;ticket?:string;confirmed?:boolean;seasons?:Season[];layering?:Layering;userHints?:string;description?:string;garmentId?:string;generated?:Blob;original?:Blob;result?:Blob;analysis?:Analysis;analysisText:string;name:string;category:string;color:string;season:string;notes:string};
const db=()=>openDB('layer-photo-drafts',1,{upgrade(d){d.createObjectStore('drafts');}});
export async function readDraft(id:string):Promise<PhotoDraft|undefined>{const d=await db();return d.get('drafts',id);}
export async function writeDraft(id:string,draft:PhotoDraft){const d=await db();await d.put('drafts',draft,id);}
export async function deleteDraft(id:string){const d=await db();await d.delete('drafts',id);}

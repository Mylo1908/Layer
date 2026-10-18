import {parseAnalysis,type Analysis} from './chat-workflow';
import {visualDetails,type VisualDetails} from './visual-details';
import {seasonsOf,defaultLayering,LAYERING,type Layering,type Season} from './garment-details';
export type Review=Analysis & {description:string;seasons:Season[];layering:Layering};
export type ReviewEdits=VisualDetails & {name:string;category:Analysis['category'];color:string;description:string;seasons:Season[];layering:Layering};
export function parseReview(value:unknown):Review{const v=value as any;const a=parseAnalysis(JSON.stringify(value));return {...a,description:typeof v.description==='string'?v.description.slice(0,3000):a.imagePrompt,seasons:seasonsOf(v),layering:Object.hasOwn(LAYERING,v.layering)?v.layering:defaultLayering(a.category)};}
export function editedReview(original:Analysis,edits:ReviewEdits):Review{
 const changedIdentity=edits.category!==original.category||edits.color!==original.color;
 const originalReview=original as Review;
 // Do not retain unedited prose that describes the previous category or color.
 const description=changedIdentity&&edits.description===originalReview.description?'':edits.description;
 const name=changedIdentity&&edits.name===original.name?`${edits.color} ${edits.category}`:edits.name;
 const resolved={...original,...edits,...visualDetails(edits),name,description};
 for(const field of ['colorDetails','secondaryColors','patternDetails','printDetails'] as const){if(changedIdentity&&edits[field]===original[field])resolved[field]='';}
 return parseReview({...resolved,imagePrompt:'Resolved confirmed garment data; the generation prompt is rebuilt server-side.'});
}
export const base64url=(bytes:Uint8Array)=>btoa(Array.from(bytes,x=>String.fromCharCode(x)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unbase64=(s:string)=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),x=>x.charCodeAt(0));
async function key(secret:string){return crypto.subtle.importKey('raw',new TextEncoder().encode('layer-review-v1:'+secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function hash(bytes:Uint8Array){return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(bytes))));}
export async function signReview(secret:string,bytes:Uint8Array,review:Review,now=Date.now()){const payload=base64url(new TextEncoder().encode(JSON.stringify({review,photo:await hash(bytes),expires:now+60*60*1000})));const signature=await crypto.subtle.sign('HMAC',await key(secret),new TextEncoder().encode(payload));return payload+'.'+base64url(new Uint8Array(signature));}
export async function verifyReview(secret:string,bytes:Uint8Array,ticket:string,now=Date.now()):Promise<Review>{try{const [payload,signature,...rest]=ticket.split('.');if(rest.length||!payload||!signature)throw Error();if(!await crypto.subtle.verify('HMAC',await key(secret),unbase64(signature),new TextEncoder().encode(payload)))throw Error();const data=JSON.parse(new TextDecoder().decode(unbase64(payload)));if(data.expires<now||data.photo!==await hash(bytes))throw Error();return parseReview(data.review);}catch{throw Error('Die Analyse ist abgelaufen oder passt nicht zum Foto. Bitte erneut analysieren.');}}

import {parseAnalysis,type Analysis} from './chat-workflow';
import {visualDetails,type VisualDetails} from './visual-details';
import {seasonsOf,defaultLayering,LAYERING,type Layering,type Season} from './garment-details';
export type Review=Analysis & {description:string;seasons:Season[];layering:Layering};
export type ReviewEdits=VisualDetails & {name:string;category:Analysis['category'];color:string;description:string;seasons:Season[];layering:Layering};
export function parseReview(value:unknown):Review{const v=value as any;const a=parseAnalysis(JSON.stringify(value));return {...a,description:typeof v.description==='string'?v.description.slice(0,3000):'',seasons:seasonsOf(v),layering:Object.hasOwn(LAYERING,v.layering)?v.layering:defaultLayering(a.category)};}
export function editedReview(original:Analysis,edits:ReviewEdits):Review{
 const changedIdentity=edits.category!==original.category||edits.color!==original.color;
 const originalReview=original as Review;
 // Do not retain unedited prose that describes the previous category or color.
 const description=changedIdentity&&edits.description===originalReview.description?'':edits.description;
 const name=changedIdentity&&edits.name===original.name?`${edits.color} ${edits.category}`:edits.name;
 const resolved={...original,...edits,...visualDetails(edits),name,description};
 for(const field of ['colorDetails','secondaryColors','patternDetails','printDetails'] as const){if(changedIdentity&&(edits[field]===undefined||edits[field]===original[field]))resolved[field]='';}
 if(changedIdentity&&(edits.appearance===undefined||JSON.stringify(edits.appearance)===JSON.stringify(original.appearance)))resolved.appearance={};
 const appearanceChanged=edits.appearance!==undefined&&JSON.stringify(edits.appearance)!==JSON.stringify(original.appearance);
 const legacyChanged=['colorDetails','secondaryColors','patternDetails','printDetails'].some(k=>(edits as any)[k]!==undefined&&(edits as any)[k]!== (original as any)[k]);
 if(appearanceChanged){for(const field of ['colorDetails','secondaryColors','patternDetails','printDetails'] as const)if(edits[field]===original[field])resolved[field]='';if(edits.description===originalReview.description)resolved.description='';}
 if(legacyChanged&&JSON.stringify(edits.appearance)===JSON.stringify(original.appearance))resolved.appearance={};
 if(resolved.appearance){
 const a={...resolved.appearance},old=original.appearance??{},edited=edits.appearance??{};
 const same=(key:keyof typeof a)=>JSON.stringify(a[key])===JSON.stringify(old[key]);
 const colorChanged=edits.color!==original.color||edited.primaryColorName!==undefined&&edited.primaryColorName!==old.primaryColorName||edited.primaryColorHex!==undefined&&edited.primaryColorHex!==old.primaryColorHex;
 if(colorChanged)for(const key of ['primaryColorName','primaryColorHex','secondaryColors','accentColors','patternDescription','stripeColorOrder','collarDetails','cuffDetails','seamDetails','printColors'] as const)if(same(key))delete a[key];
 if(a.patternType==='none')for(const key of ['patternDescription','patternDirection','patternRepeat','patternScale','patternRegions','stripeColorOrder','stripeWidths','stripeSpacing'] as const)delete a[key];
 resolved.appearance=a;
 }
 return parseReview(resolved);
}

import {purchaseDetails} from './purchase';
import {visualDetails} from './visual-details';
import type {PhotoDraft} from './photo-draft';
import {seasonsOf} from './garment-details';
import type {Garment,Category} from './types';
/** Compatibility reader for old reviewed drafts; no generation or automatic saving. */
export function acceptedGarment(d:PhotoDraft):Garment{if(!d.result||!d.original||!d.garmentId||d.reviewStatus!=='review')throw Error('Bitte zuerst die Bildverarbeitung abschließen.');return {...visualDetails(d),...purchaseDetails(d),id:d.garmentId,photos:d.photos?.map(p=>p.id===(d.primaryPhotoId??d.photos?.[0]?.id)?{...p,source:p.source??p.image,image:d.result!}:p),primaryPhotoId:d.primaryPhotoId,accessoryType:d.category==='Accessoires'?d.accessoryType:undefined,name:d.name,category:d.category as Category,color:d.color,season:seasonsOf(d)[0],seasons:seasonsOf(d),layering:d.layering??'none',description:d.description??'',userHints:d.userHints??'',notes:d.notes,favorite:false,image:d.result,processed:d.result,original:d.original,createdAt:Date.now(),imageSource:'automatic'};}

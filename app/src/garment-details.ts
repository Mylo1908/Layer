import {type Garment,type Category} from './types';
export const SEASONS=['Frühling','Sommer','Herbst','Winter','Ganzjährig'] as const;
export type Season=typeof SEASONS[number];
export const LAYERING={under:'Layer unten',over:'Layer oben',either:'Layer unten oder oben',none:'Nicht relevant'} as const;
export type Layering=keyof typeof LAYERING;
export const COLORS=['Neutral','Schwarz','Weiß','Creme','Grau','Braun','Blau','Grün','Rot','Rosa','Gelb','Bunt'];
export function seasonsOf(g:{seasons?:readonly string[];season?:string}):Season[]{const values=g.seasons??[g.season??'Ganzjährig'];const valid=[...new Set(values.filter((s):s is Season=>SEASONS.includes(s as Season)))];return !valid.length||valid.includes('Ganzjährig')?['Ganzjährig']:valid;}
export function defaultLayering(category:Category):Layering{return ['T-Shirts','Longsleeves','Hemden'].includes(category)?'under':['Pullover','Jacken'].includes(category)?'over':'none';}
export function layeringOf(g:{layering?:Layering;category:Category}):Layering{return g.layering??defaultLayering(g.category);}
export function normalizeGarment(g:Garment):Garment{return {...g,seasons:seasonsOf(g),layering:layeringOf(g)};}
export function matchesSeason(g:Garment,season:string){const ss=seasonsOf(g);return season==='Alle Saisons'||ss.includes('Ganzjährig')||ss.includes(season as Season);}

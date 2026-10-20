import type {Season,Layering} from './garment-details';
export const CATEGORIES = ['T-Shirts','Longsleeves','Pullover','Hemden','Jacken','Hosen','Röcke','Kleider','Schuhe','Accessoires'] as const;
export type Category = typeof CATEGORIES[number];
export type Garment = import('./garment-attributes').GarmentAttributes & import('./purchase').Purchase & import('./visual-details').VisualDetails & import('./photos').PhotoFields & {accessoryType?:import('./accessories').AccessoryType;seasons?:Season[];layering?:Layering;userHints?:string;description?:string;imageSource?:'chatgpt'|'automatic'|'local';id:string; name:string; category:Category; color:string; season:string; notes:string; favorite:boolean; image:Blob; original:Blob; processed:Blob; createdAt:number};
export type Layer = {id:string; garmentId:string; x:number; y:number; width:number; rotation:number; locked:boolean};
export type Outfit = {id:string; name:string; layers:Layer[]; background:string; notes:string; createdAt:number; updatedAt:number};
export type Collage=Outfit & {outline?:import('./collage-outline').CollageOutline;template:import('./collage').CollageTemplate;variant?:number;outfitId?:string};
export type Backup = {format:'layer-wardrobe'; version:1; garments:Array<Omit<Garment,'image'|'original'|'processed'|'photos'> & {image:string; original:string; processed:string;photos?:Array<Omit<import('./photos').GarmentPhoto,'image'|'source'>&{image:string;source?:string}>}>; outfits:Outfit[];collages?:Collage[];calendarEntries?:import('./calendar').OutfitCalendarEntry[]};
export const uid = () => crypto.randomUUID();

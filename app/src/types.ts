export const CATEGORIES = ['T-Shirts','Longsleeves','Pullover','Hemden','Jacken','Hosen','Röcke','Kleider','Schuhe','Accessoires'] as const;
export type Category = typeof CATEGORIES[number];
export type Garment = {imageSource?:'chatgpt';id:string; name:string; category:Category; color:string; season:string; notes:string; favorite:boolean; image:Blob; original:Blob; processed:Blob; createdAt:number};
export type Layer = {id:string; garmentId:string; x:number; y:number; width:number; rotation:number; locked:boolean};
export type Outfit = {id:string; name:string; layers:Layer[]; background:string; notes:string; createdAt:number; updatedAt:number};
export type Backup = {format:'layer-wardrobe'; version:1; garments:Array<Omit<Garment,'image'|'original'|'processed'> & {image:string; original:string; processed:string}>; outfits:Outfit[]};
export const uid = () => crypto.randomUUID();

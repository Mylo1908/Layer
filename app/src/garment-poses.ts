import type {Category} from './types';
const templates:Record<Category,string>={
 'Hosen':'Front-facing trousers, waistband at top, both legs naturally extended downward, retain the actual rise, leg width and inseam. Do not taper wide legs or widen narrow legs.',
 'T-Shirts':'Straight frontal T-shirt, sleeves gently out to each side, retain shoulder width, sleeve length and original silhouette.',
 'Longsleeves':'Straight frontal long-sleeve top, sleeves gently angled outward and downward, preserve actual sleeve and body proportions.',
 'Pullover':'Straight frontal sweater with natural relaxed shoulders and sleeves angled slightly downward, preserve actual knit volume, length and cuffs.',
 'Hemden':'Straight frontal shirt with collar, placket and sleeves exactly as visible. Preserve the real button positions and open or closed state.',
 'Jacken':'Straight frontal outerwear, natural shoulders and silhouette. Preserve actual length, collar, closures and open or closed state.',
 'Röcke':'Straight frontal skirt, waistband at top and hem naturally below. Preserve the actual fullness, pleats, asymmetry and length.',
 'Kleider':'Straight frontal dress, neckline at top and hem below. Preserve silhouette, waist position, sleeves and actual length.',
 'Schuhe':'Show only the actual reference footwear, same number of shoes and recognizable viewing angle. Preserve shape, soles and laces. Do not invent a second shoe.',
 'Accessoires':'Single isolated reference accessory in its natural recognizable orientation. Preserve its shape, proportions and all visible details.'};
export function garmentPose(category:Category|string,description=''){const cardigan=/cardigan|strickjack/i.test(description);return `Use this category presentation instead of generic pose words in earlier descriptions. Presentation only, outfit collage catalog aesthetic: ${cardigan?'Front-facing cardigan, relaxed shoulders and sleeves; preserve the actual open or closed state, buttons and drape.':templates[category as Category]??'Natural straight frontal product view. If this pose conflicts with garment construction, keep the natural reference orientation.'} Standardize presentation ONLY. Never change cut, silhouette, color, texture, print, closures or visible construction. Never add accessories or other garments. No geometry stretching; reference identity takes priority over pose.`;}
export function fittedSize(width:number,height:number,canvas=1024,padding=64){if(width<=0||height<=0)throw Error('Ungültige Bildgröße.');const scale=Math.min((canvas-2*padding)/width,(canvas-2*padding)/height);return {width:width*scale,height:height*scale,x:(canvas-width*scale)/2,y:(canvas-height*scale)/2};}

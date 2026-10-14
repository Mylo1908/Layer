import { useEffect,useState } from 'react';
import type { Garment } from './types';
export function useImages(gs:Garment[]){const [images,setImages]=useState<Record<string,string>>({});useEffect(()=>{const next=Object.fromEntries(gs.map(g=>[g.id,URL.createObjectURL(g.image)]));setImages(next);return()=>Object.values(next).forEach(URL.revokeObjectURL);},[gs]);return images;}

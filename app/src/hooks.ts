import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {Garment} from './types';
import {ImageUrls} from './image-urls';
export function useImages(gs:Garment[]){const cache=useRef<ImageUrls>(undefined);if(!cache.current)cache.current=new ImageUrls();const [images,S]=useState<Record<string,string>>({});useLayoutEffect(()=>{S(cache.current!.reconcile(gs));},[gs]);useEffect(()=>{cache.current!.releaseAfterCommit(images);},[images]);useEffect(()=>()=>cache.current!.dispose(),[]);return images;}

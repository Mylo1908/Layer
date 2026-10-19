import {validDay} from './calendar';
export type Purchase={purchasePriceCents?:number;purchaseDate?:string};
export type PurchaseDraft=Purchase&{purchasePriceInput?:string};
export const MAX_PURCHASE_CENTS=100_000_000;
export function parsePrice(input:string):number|undefined{const s=input.trim();if(!s)return undefined;if(!/^\d{1,7}(?:[.,]\d{1,2})?$/.test(s))throw Error('Kaufpreis bitte als Eurobetrag eingeben, z. B. 49,99.');const [euros,cents='']=s.replace(',','.').split('.'),value=Number(euros)*100+Number(cents.padEnd(2,'0'));if(!Number.isSafeInteger(value)||value>MAX_PURCHASE_CENTS)throw Error('Kaufpreis muss zwischen 0 und 1.000.000 € liegen.');return value;}
export function priceInput(cents?:number){return cents===undefined?'':(cents/100).toFixed(2).replace('.',',');}
export function validatePurchase(p:Purchase){if(p.purchasePriceCents!==undefined&&(!Number.isSafeInteger(p.purchasePriceCents)||p.purchasePriceCents<0||p.purchasePriceCents>MAX_PURCHASE_CENTS))throw Error('Ungültiger Kaufpreis.');if(p.purchaseDate!==undefined&&!validDay(p.purchaseDate))throw Error('Ungültiges Kaufdatum.');}
export function purchaseDetails(p:PurchaseDraft):Purchase{const value:Purchase={purchasePriceCents:p.purchasePriceInput!==undefined?parsePrice(p.purchasePriceInput):p.purchasePriceCents,purchaseDate:p.purchaseDate||undefined};validatePurchase(value);return value;}
export function costPerWear(cents:number|undefined,days:number){return cents===undefined||days<=0?undefined:cents/days;}
export const euros=(cents:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);

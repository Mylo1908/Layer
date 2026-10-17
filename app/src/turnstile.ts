type Turnstile = {render:(container:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global {interface Window {turnstile?:Turnstile}}
let loading:Promise<Turnstile>|undefined;
function load():Promise<Turnstile>{
 if(window.turnstile)return Promise.resolve(window.turnstile);
 if(loading)return loading;
 loading=new Promise<Turnstile>((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
  const timer=setTimeout(()=>fail(),15000);
  const fail=()=>{clearTimeout(timer);script.remove();reject(Error('Sicherheitsprüfung konnte nicht geladen werden. Bitte Verbindung prüfen und erneut versuchen.'));};
  script.onerror=fail;script.onload=()=>{clearTimeout(timer);window.turnstile?resolve(window.turnstile):fail();};document.head.append(script);
 }).catch(e=>{loading=undefined;throw e;});return loading;
}
export async function freshTurnstileToken(container:HTMLElement):Promise<string>{
 const api=await load();
 return new Promise((resolve,reject)=>{
  let id:string|undefined,finished=false;
  const finish=(token?:string)=>{if(finished)return;finished=true;clearTimeout(timer);if(id!==undefined)api.remove(id);token?resolve(token):reject(Error('Sicherheitsprüfung fehlgeschlagen oder abgelaufen. Bitte erneut versuchen.'));};
  const timer=setTimeout(()=>finish(),120000);
  try{id=api.render(container,{sitekey:'0x4AAAAAAFZG2M92TLxigxyT',action:'layer_prettify',appearance:'interaction-only',retry:'never','refresh-expired':'never',callback:(token:string)=>finish(token),'error-callback':()=>finish(),'expired-callback':()=>finish(),'timeout-callback':()=>finish()});if(finished)api.remove(id);}catch{finish();}
 });
}

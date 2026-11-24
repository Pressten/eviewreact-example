import React from 'react';
const icons = typeof LUCIDE !== 'undefined' ? LUCIDE : {};
export function Icon({name,size='1rem',className='',title}) {
 const nodes=icons[name]||[];
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={title?undefined:true} role={title?'img':undefined}>
  {title&&<title>{title}</title>}{nodes.map(([tag,attributes],index)=>React.createElement(tag,{...attributes,key:index}))}
 </svg>;
}

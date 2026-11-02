import TextField from '@/shared/TextField';
import './index.css';

// 即时筛选仍回传字符串；Enter 作为可选提交事件，不改变调用方原有搜索节奏。
export default function SearchInput({id,value,onChange,placeholder,ariaLabel,className='',onPressEnter,disabled=false}){
 return <span className={'ict-search-field '+className}>
  <TextField id={id} className="ict-search-input" style={{width:'100%'}} value={value} aria-label={ariaLabel} placeholder={placeholder}
   disabled={disabled} onChange={value=>onChange(value)} onKeyDown={event=>{if(event.key==='Enter')onPressEnter?.(event);}}/>
 </span>;
}

import {useEffect,useState} from 'react';
import DivMessage from '@nce/eview-react/DivMessage';
import {useApp} from '../../context.jsx';

// 保留 toast() 业务入口；DivMessage 无命令式 API，改为渲染受控 <DivMessage>。
// 外层 fixed 定位复刻 antd message 顶部居中浮层（DivMessage 不脱离文档流）。
export default function AppFeedback(){
  const {toastText,toastVersion}=useApp();
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(toastText)setVisible(true);
    else setVisible(false);
  },[toastText,toastVersion]);
  if(!visible||!toastText)return null;
  return <div style={{position:'fixed',top:64,left:'50%',transform:'translateX(-50%)',zIndex:1050}}>
    <DivMessage key={toastVersion} display type="default" text={toastText} disposeTimeOut={3200} onClose={()=>setVisible(false)}/>
  </div>;
}

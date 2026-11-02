import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TipBox from "@nce/eview-react/TipBox";
import { useState } from "react";
import { useApp } from "../../context.jsx";
import LuiGlyph from "./glyph.jsx";

// 默认动作面向配置检查；其他用例通过回调覆盖重放和产物定位，复用同一工具栏。
export default function ResponseTools({ timestamp, duration, text, onRegenerate, onLocate, subject = "检查", locateLabel = "定位检查报告" }) {
  const { runTask, taskPrompt, locate, toast } = useApp();
  const [feedback, setFeedback] = useState(null);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); toast(`已复制${subject}结论`); }
    catch { toast("复制暂不可用，请选择回答文字复制。"); }
  };
  return <div className="response-footer">
    <span>{timestamp}｜用时{duration}秒</span>
    <div className="response-tools">
      <TipBox content="重新生成"><button type="button" aria-label={`重新生成${subject}回答`} onClick={()=>onRegenerate ? onRegenerate() : runTask(taskPrompt)}><LuiGlyph name="regenerate" size="1.25rem"/></button></TipBox>
      <TipBox content="复制"><button type="button" aria-label={`复制${subject}回答`} onClick={copy}><LuiGlyph name="copy" size="1.25rem"/></button></TipBox>
      <TipBox content="点赞"><button type="button" aria-label={`点赞${subject}回答`} aria-pressed={feedback === "like"} onClick={()=>setFeedback(value=>value === "like" ? null : "like")}><LuiGlyph name="like" size="1.25rem"/></button></TipBox>
      <TipBox content="点踩"><button type="button" aria-label={`点踩${subject}回答`} aria-pressed={feedback === "dislike"} onClick={()=>setFeedback(value=>value === "dislike" ? null : "dislike")}><LuiGlyph name="dislike" size="1.25rem"/></button></TipBox>
      <div className="response-more"><PopUpMenu options={[{id:'locate',text:locateLabel,serialno:'locate'}]} onClick={()=>{if(onLocate)onLocate();else locate("report");}}><TipBox content="更多"><button type="button" aria-label={`${subject}回答更多操作`} aria-haspopup="menu"><LuiGlyph name="more" size="1.25rem"/></button></TipBox></PopUpMenu></div>
    </div>
  </div>;
}

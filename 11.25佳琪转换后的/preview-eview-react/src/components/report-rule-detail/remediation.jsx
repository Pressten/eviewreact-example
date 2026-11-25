import {useId, useRef, useState} from 'react';
import { IconPlusIcPublicCopy } from '@hui/icon-plus';
import Button from '@nce/eview-react/Button';
function CommandBlock({label, lines}) {
  const titleId = useId();
  const codeRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const text = lines.join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('已复制');
    } catch {
      const code = codeRef.current;
      if (!code) return;
      const selection = window.getSelection();
      if (selection) {
        code.focus({preventScroll: true});
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        setFeedback('已选中命令，请按 Ctrl+C 或 ⌘C 复制。');
      } else {
        setFeedback('复制不可用，请手动选中命令复制。');
      }
    }
  }

  return <section className="rule-inspection-commands" aria-labelledby={titleId}>
    <header>
      <h5 id={titleId}>{label}</h5>
      <Button status="text" size="small" leftIcon={<IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} />}
        aria-label={'复制' + label} onClick={copy} text="复制"/>
    </header>
    <pre className="rule-inspection-repair-code"><code ref={codeRef} tabIndex={-1}>{text}</code></pre>
    <p role="status" className="rule-inspection-copy-feedback">{feedback}</p>
  </section>;
}

export default function Remediation({suggestion, plan}) {
  const hasCommandPair = [plan?.execute, plan?.rollback].every(lines =>
    Array.isArray(lines) && lines.length > 0 && lines.every(line => typeof line === 'string' && line.trim())
  );
  if (!suggestion && !hasCommandPair) return null;
  return <section className="rule-inspection-remediation">
    <h4>修复建议</h4>
    {suggestion && <p>{suggestion}</p>}
    {hasCommandPair ? <div className="rule-inspection-repair-commands">
      <CommandBlock label="执行命令" lines={plan.execute}/>
      <CommandBlock label="回退命令" lines={plan.rollback}/>
    </div> : <p className="rule-inspection-repair-unavailable">当前报告暂无可用的执行和回退命令。</p>}
  </section>;
}

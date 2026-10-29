const fs = require('fs');
const path = require('path');
const srcBase = 'F:/testOpenCodeSkillUseDSH/second/企业组织权限管理页';
const dstBase = 'F:/testOpenCodeSkillUseDSH/second/企业组织权限管理页-eview-react/src';

function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r.push(...walk(p));
    else if (/\.(jsx?|tsx?|css)$/.test(e.name)) r.push(p);
  }
  return r;
}

const dstFiles = walk(dstBase);
// 典型 GBK-误读乱码指纹字符（正常中文几乎不出现，UTF-8 被当 GBK 读的产物）
const mojibakeFingerprint = /[\u9352\u93c1\u93c9\u93cf\u93dc\u93dd\u93e4\u93e5\u93e8\u93f4\u934c\u934d\u934f\u9350\u9351\u935a\u935b\u935c\u936c\u936d\u936e\u936f\u9375\u937c\u93b0\u93b1\u93b3\u93ba\u93bb\u93c0\u93c2\u93c4\u93c6\u93c8\u93ca\u93cb\u93cc\u93cd\u93ce\u93d1\u93d5\u93d6\u93d8\u93d9\u93db\u93df\u93e0\u93e1\u93e2\u93e3\u93e6\u93e7\u93e9\u93ea\u93eb\u93ec\u93ee\u93ef\u93f0\u93f1\u93f2\u93f5\u93f6\u93f8\u93f9\u93fa\u93fb\u93fc\u93fd\u93fe]/;

const realIssues = [];
for (const df of dstFiles) {
  const rel = path.relative(dstBase, df).replace(/\\/g, '/');
  let srcPath;
  if (rel === 'app.jsx' || rel === 'app.css') srcPath = path.join(srcBase, rel);
  else srcPath = path.join(srcBase, 'src', rel);
  if (!fs.existsSync(srcPath)) continue;
  const srcContent = fs.readFileSync(srcPath, 'utf8');
  const dstContent = fs.readFileSync(df, 'utf8');
  const hasBOM = dstContent.charCodeAt(0) === 0xFEFF;
  // 检测乱码指纹字符
  const hasFingerprint = mojibakeFingerprint.test(dstContent);
  if (hasBOM || hasFingerprint) {
    // 找出第一个指纹字符的上下文
    const m = dstContent.match(mojibakeFingerprint);
    let ctx = '';
    if (m) {
      const idx = dstContent.indexOf(m[0]);
      ctx = dstContent.slice(Math.max(0, idx - 15), idx + 15).replace(/\n/g, '\\n');
    }
    realIssues.push({ rel, hasBOM, hasFingerprint, ctx });
  }
}
console.log('=== Files with BOM or GBK-mojibake fingerprint: ' + realIssues.length + ' ===');
for (const i of realIssues) {
  console.log('  ' + i.rel + ' | BOM=' + i.hasBOM + ' | fingerprint=' + i.hasFingerprint + (i.ctx ? ' | ctx: ...' + i.ctx + '...' : ''));
}

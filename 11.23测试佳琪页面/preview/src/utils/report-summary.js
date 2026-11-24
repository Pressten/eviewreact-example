// 设备数来自报告汇总；规则影响设备数之间可能重叠，不能相加当成设备数。
export function reportSummary(report) {
  const {total, passed, failed} = report.summary;
  return {total, passed, failed,
    compliance: total ? '50' : null,
    ruleCount: report.rules.length,
    failedRules: report.rules.filter(rule => rule.failed > 0).length,
    passedRules: report.rules.filter(rule => rule.failed === 0 && rule.total > 0).length,
  };
}

export function rankedFailedRules(rules) {
  // 先看受影响设备数，并列时按规则优先级排。
  const priorityOrder = {high: 0, medium: 1, low: 2};
  return rules.filter(rule => rule.failed > 0).slice().sort((a, b) =>
    b.failed - a.failed || (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3));
}

export function reportConclusion(summary, rules) {
  if (!summary.total) return '';
  if (!summary.failed) return `本次检查的 ${summary.total} 台设备全部通过。`;
  const ranked = rankedFailedRules(rules);
  const scope = `${summary.failed} 台设备涉及 ${ranked.length} 个不通过检查项`;
  if (!ranked.length) return `本次检查有 ${summary.failed} 台设备不通过。`;
  const shortNames = {timeout: '接口空闲超时', ssh: 'SSH 弱加密'};
  const first = ranked[0];
  const leaders = ranked.filter(rule => rule.failed === first.failed);
  const names = leaders.slice(0, 2).map(rule => shortNames[rule.id] || rule.name).join('、');
  if (ranked.length === 1) return `${scope}（${names}）。`;
  const subjects = leaders.length > 2 ? `${names}等 ${leaders.length} 项` : names;
  return `${scope}，其中${subjects}${leaders.length > 1 ? '各' : ''}影响 ${first.failed} 台。`;
}

export function ruleDeviceRows(rule, devices) {
  // 只纳入实际核验过这条规则的设备，未纳入核验的设备不计为通过。
  const rows = devices.filter(device => device.checkedRuleIds.includes(rule.id)).map(device => {
    const failed = device.failedRuleIds.includes(rule.id);
    return {id: device.id, name: device.name, status: failed ? 'failed' : 'passed',
      findings: failed ? rule.details?.findings?.[device.id] || [] : []};
  });
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', {numeric: true}));
}

// 每台设备按唯一适用规则计数；一条规则多处违规也只计一次。
export function deviceResults(devices) {
  return devices.map(device=>{
    const checked=new Set(device.checkedRuleIds),failedIds=[...new Set(device.failedRuleIds)].filter(id=>checked.has(id));
    const total=checked.size,failed=failedIds.length,passed=total-failed;
    return {...device,total,failed,passed,failedRuleIds:failedIds,passRate:total?passed/total*100:null,status:!total?'unknown':failed?'failed':'passed'};
  });
}

export function rankedFailedDevices(devices) {
  return deviceResults(devices).filter(device=>device.failed>0).sort((a,b)=>b.failed-a.failed||a.id.localeCompare(b.id,'en',{numeric:true}));
}

export function devicePriorityCounts(device,rules) {
  const failed=new Set(device.failedRuleIds),counts={high:0,medium:0,low:0};
  rules.forEach(rule=>{if(failed.has(rule.id)&&Object.hasOwn(counts,rule.priority))counts[rule.priority]++;});
  return counts;
}

export function resultCounts(rows,dimension) {
  const failed=rows.filter(row=>row.failed>0).length;
  const passed=rows.filter(row=>dimension==='devices'?row.status==='passed':row.failed===0&&row.total>0).length;
  // 余下的是无检查结果的记录，需要与通过状态区分。
  return {total:rows.length,failed,passed,unknown:rows.length-failed-passed};
}

export function overviewEmptyState(total,dimension,unknown=0) {
  const unit=dimension==='devices'?'台设备':'条规则',subject=dimension==='devices'?'设备':'规则';
  if(!total)return {title:'暂无检查数据',description:'完成检查后，将展示'+subject+'维度的 TOP 统计。'};
  return {title:'暂无不通过'+subject,description:unknown?'当前没有不通过结果，仍有 '+unknown+' '+unit+'尚无检查结果。':'本次已检查 '+total+' '+unit+'，全部通过。'};
}

import {deviceResults, reportConclusion, reportSummary, ruleDeviceRows} from './report-summary.js';
import {createXlsxBlob} from './xlsx-writer.js';

function auditTime(value) {
  return value ? new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(value)) : '—';
}

export function buildReportWorkbook(report) {
  const summary = reportSummary(report);
  const title = '配置基线检查报告';
  const startTime = auditTime(report.execution?.startedAt);
  const time = auditTime(report.execution?.completedAt || report.checkedAt);
  const scope = `HCS1 演示数据 · 执行时间：${startTime} — ${time}（北京时间）`;
  const note = `完整报告：${summary.total} 台设备，${summary.ruleCount} 项检查；${summary.passed} 台通过，${summary.failed} 台不通过。`;
  // 前三行是报告上下文，第四行留白，第五行是需要冻结的表头。
  const sheet = (name, headers, rows, widths, numberFormats = {}) => ({
    name, rows: [[title + ' · ' + name], [scope], [note], [], headers, ...rows],
    widths, numberFormats, headerRow: 5, freezeRows: 5,
  });
  const names = new Map(report.rules.map(rule => [rule.id, rule.name]));
  const state = item => !item.total ? '无检查结果' : item.failed ? '不通过' : '通过';
  const records = [], findings = [];
  // 核验按“规则 × 设备”记一行；同一次核验命中多个配置位置时，逐条写入证据表。
  for (const rule of report.rules) {
    for (const device of ruleDeviceRows(rule, report.devices)) {
      records.push([device.name, rule.name, device.status === 'failed' ? '不通过' : '通过',
        rule.expected, device.findings.map(item => '第 ' + item.line + ' 行').join('\n'),
        device.findings.map(item => [item.context, item.excerpt].filter(Boolean).join('\n')).join('\n\n')]);
      for (const finding of device.findings) findings.push([rule.name, device.name, finding.line,
        finding.context || '', finding.excerpt, rule.expected, rule.details?.suggestion || '']);
    }
  }
  const datePart = time.replace(/[^0-9]/g, '') || '未审计';
  return {
    title, filename: title + '_' + datePart + '.xlsx', rowCount: records.length, findingCount: findings.length,
    sheets: [
      sheet('报告概览', ['指标', '数值', '单位'], [
        ['执行开始时间', startTime, '北京时间'], ['执行结束时间', time, '北京时间'], ['已检查设备', summary.total, '台'],
        ['已通过设备', summary.passed, '台'], ['不通过设备', summary.failed, '台'],
        ['检查合规率', summary.compliance === null ? '—' : summary.compliance + '%', ''],
        ['检查项', summary.ruleCount, '项'], ['不通过检查项', summary.failedRules, '项'],
        ['通过检查项', summary.passedRules, '项'], ['违规配置位置', findings.length, '处'],
        ['概要', reportConclusion(summary, report.rules), ''],
      ], [24, 90, 16]),
      sheet('检查项明细', ['规则名称', '检查结果', '检查要求', '适用设备', '不通过设备', '通过设备', '合规率', '规则说明', '修复建议'],
        report.rules.map(rule => [rule.name, state(rule), rule.expected, rule.total, rule.failed, rule.passed,
          rule.total ? rule.passed / rule.total : null, rule.details?.description || '', rule.details?.suggestion || '']),
        [42, 15, 66, 15, 15, 15, 15, 66, 66], {6: 'percent'}),
      sheet('设备明细', ['设备名称', '设备IP', '设备型号', '检查结果', '检查项', '不通过检查项', '通过检查项', '合规率', '不通过规则'],
        deviceResults(report.devices).map(device => [device.name,device.managementIp,device.model,state(device),device.total,device.failed,device.passed,
          device.total ? device.passed / device.total : null, device.failedRuleIds.map(id => names.get(id) || id).join('\n')]),
        [26,20,18,15,15,18,18,15,66], {7:'percent'}),
      sheet('核验明细', ['设备名称', '规则名称', '检查结果', '检查要求', '违规行号', '违规配置片段'],
        records, [26, 42, 15, 66, 22, 66]),
      sheet('配置证据', ['规则名称', '设备名称', '行号', '配置上下文', '违规片段', '检查要求', '修复建议'],
        findings, [42, 26, 12, 48, 66, 66, 66]),
    ],
  };
}

export function downloadReport(report) {
  const workbook = buildReportWorkbook(report);
  const url = URL.createObjectURL(createXlsxBlob(workbook));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = workbook.filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  // 给浏览器时间开始读取下载数据，再释放临时 Blob URL。
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

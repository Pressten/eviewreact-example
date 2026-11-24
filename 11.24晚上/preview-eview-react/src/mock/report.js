import {ruleEvidence} from './rule-evidence.js';

// 原 HCS1 汇总和规则统计是演示基准；后段补齐预览需要的设备属性与对比数据。
const demoReport = {
  "checkedAt": "2026-10-21T14:20:00+08:00",
  "execution": {
    "startedAt": "2026-10-21T14:15:00+08:00",
    "completedAt": "2026-10-21T14:20:00+08:00",
    "source": "demo"
  },
  "summary": {
    "total": 380,
    "passed": 375,
    "failed": 5
  },
  "rules": [
    {
      "id": "timeout",
      "name": "用户接口空闲超时时间不能超过10分钟",
      "expected": "空闲超时时间 ≤ 10分钟（600秒）",
      "total": 380,
      "passed": 377,
      "failed": 3,
      "passRate": 99.21052631578947
    },
    {
      "id": "ssh",
      "name": "SSH加密算法存在弱加密",
      "expected": "SSH 加密套件仅允许 aes256_ctr / aes192_ctr；禁用 CBC 与 MD5 系列，HMAC 使用 SHA2。",
      "total": 380,
      "passed": 377,
      "failed": 3,
      "passRate": 99.21052631578947
    },
    {
      "id": "mgmt",
      "name": "管理IP地址必须与规划地址一致",
      "expected": "管理IP地址 = 规划地址",
      "total": 380,
      "passed": 378,
      "failed": 2,
      "passRate": 99.47368421052632
    },
    {
      "id": "ntp3",
      "name": "NTP 备用时钟源符合规划",
      "expected": "备用NTP服务器地址 = 10.10.0.11",
      "total": 380,
      "passed": 378,
      "failed": 2,
      "passRate": 99.47368421052632
    },
    {
      "id": "ntp2",
      "name": "NTP 时钟源地址符合规划",
      "expected": "NTP服务器地址 = 10.10.0.10",
      "total": 380,
      "passed": 378,
      "failed": 2,
      "passRate": 99.47368421052632
    },
    {
      "id": "sec5",
      "name": "管理登录已配置AAA认证",
      "expected": "authentication-mode = aaa",
      "total": 380,
      "passed": 379,
      "failed": 1,
      "passRate": 99.73684210526315
    },
    {
      "id": "addr2",
      "name": "业务接口IP地址与规划一致",
      "expected": "业务接口地址 = 规划地址",
      "total": 380,
      "passed": 379,
      "failed": 1,
      "passRate": 99.73684210526315
    },
    {
      "id": "sec3",
      "name": "账户密码复杂度检查",
      "expected": "启用密码复杂度检查",
      "total": 380,
      "passed": 379,
      "failed": 1,
      "passRate": 99.73684210526315
    },
    {
      "id": "vlan3",
      "name": "Trunk 仅放通规划VLAN",
      "expected": "允许VLAN集合 = {100, 200}",
      "total": 380,
      "passed": 379,
      "failed": 1,
      "passRate": 99.73684210526315
    },
    {
      "id": "sec1",
      "name": "本地用户权限符合分级策略",
      "expected": "运维用户权限等级 = 3",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "vlan4",
      "name": "二层环路保护已启用",
      "expected": "STP模式 = mstp",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "route4",
      "name": "规划的出口路由策略已配置",
      "expected": "存在EXPORT-DC路由策略",
      "total": 228,
      "passed": 228,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "addr3",
      "name": "接口子网掩码符合规划",
      "expected": "业务网段前缀长度 = 24",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "authConsole",
      "name": "控制台登录已配置AAA认证",
      "expected": "authentication-mode = aaa",
      "total": 76,
      "passed": 76,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "route1",
      "name": "默认路由下一跳符合规划",
      "expected": "默认路由下一跳 = 10.10.1.1",
      "total": 304,
      "passed": 304,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "route3",
      "name": "冗余组优先级符合规划",
      "expected": "VRRP主设备优先级 = 120",
      "total": 228,
      "passed": 228,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "vlan2",
      "name": "业务接口模式符合规划",
      "expected": "上联接口模式 = trunk",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "addr4",
      "name": "业务网关地址符合规划",
      "expected": "业务网关地址 = 172.16.100.1",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "vlan1",
      "name": "业务VLAN已按规划创建",
      "expected": "包含业务VLAN 100、200",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "loginType",
      "name": "运维账户仅允许SSH登录",
      "expected": "本地运维用户service-type = ssh",
      "total": 152,
      "passed": 152,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "route2",
      "name": "BGP 对端地址符合规划",
      "expected": "BGP对端地址 = 172.16.0.1",
      "total": 304,
      "passed": 304,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "routerId",
      "name": "BGP Router ID 与规划一致",
      "expected": "Router ID = 设备规划地址",
      "total": 76,
      "passed": 76,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "ntp1",
      "name": "NTP 服务处于启用状态",
      "expected": "已配置NTP时间同步服务",
      "total": 380,
      "passed": 380,
      "failed": 0,
      "passRate": 100
    },
    {
      "id": "sshEnable",
      "name": "SSH 远程管理服务已启用",
      "expected": "已启用SSH远程管理服务",
      "total": 152,
      "passed": 152,
      "failed": 0,
      "passRate": 100
    }
  ]
};

// 保留原 HCS1 设备—规则命中关系。IP、型号为设计稿补充的可检索演示属性。
const sourceRuleOrder=['mgmt','addr2','addr3','addr4','ntp1','ntp2','ntp3','sec1','ssh','sec3','timeout','sec5','vlan1','vlan2','vlan3','vlan4','route1','route2','route3','route4','sshEnable','loginType','authConsole','routerId'];
const sourceFailures=[['timeout','ssh','mgmt','ntp2'],['timeout','ssh','sec3','ntp3'],['ssh','addr2','sec5'],['timeout','ntp2','vlan3'],['mgmt','ntp3']];
// 互换展示编号以对齐原设备名称，内部设备 ID 保持稳定，供规则证据索引使用。
const sourceNameSwaps={2:18,18:2,3:67,67:3,4:126,126:4,5:203,203:5};
const sourceRuleTotals=[24,20,18,22,16];
demoReport.devices=Array.from({length:380},(_,index)=>{
  const number=index+1,failedRuleIds=sourceFailures[index]||[];
  const deviceNumber=sourceNameSwaps[number]||number;
  return {id:'d'+number,name:'SW-HCS1-'+String(deviceNumber).padStart(2,'0'),
    managementIp:'10.10.'+(1+Math.floor((deviceNumber-1)/240))+'.'+(11+(deviceNumber-1)%240),
    model:['CE6857','CE6865','CE6881'][index%3],
    checkedRuleIds:[...new Set([...failedRuleIds,...sourceRuleOrder])].slice(0,sourceRuleTotals[index%5]),failedRuleIds:[...failedRuleIds]};
});

demoReport.comparison={total:380,passed:367};

// 表头数据逐项核对自 Pixso 报告页 455:171725；仅用于规则卡片，不按影响设备数推断优先级。
const reportCardHeaders = {
  timeout: {overviewName: '用户接口空闲超时时间超限', priority: 'high'},
  ssh: {overviewName: 'SSH加密算法存在弱加密', priority: 'high'},
  mgmt: {overviewName: '管理 IP 与规划地址不一致', priority: 'high'},
  ntp2: {overviewName: 'NTP 时钟源地址与规划不一致', priority: 'medium'},
  ntp3: {overviewName: 'NTP 备用时钟源与规划不一致', priority: 'low'},
};
const rulePriorities={timeout:'high',ssh:'high',mgmt:'high',sec5:'high',addr2:'high',sec3:'high',sec1:'high',loginType:'high',authConsole:'high',
  ntp2:'medium',vlan3:'medium',vlan4:'medium',route4:'medium',route1:'medium',route3:'medium',vlan2:'medium',addr3:'medium',addr4:'medium',route2:'medium',routerId:'medium',
  ntp3:'low',ntp1:'low',sshEnable:'low',vlan1:'low'};
demoReport.rules = demoReport.rules.map(rule => ({...rule,priority:rulePriorities[rule.id],...reportCardHeaders[rule.id],details:ruleEvidence[rule.id]||{}}));

// 预览场景从同一份演示数据派生，同时调整设备、规则和汇总三个层级。
export function reportForScenario(scenario) {
  if(scenario==='empty')return {...demoReport,checkedAt:null,execution:null,summary:{total:0,passed:0,failed:0},rules:[],devices:[]};
  if(scenario==='single')return {...demoReport,summary:{total:380,passed:379,failed:1},
    rules:demoReport.rules.map(rule=>{const failed=rule.id==='timeout'?1:0;return {...rule,failed,passed:rule.total-failed,passRate:(rule.total-failed)/rule.total*100};}),
    devices:demoReport.devices.map((device,index)=>({...device,failedRuleIds:index===0?['timeout']:[]}))};
  if(scenario==='passed')return {...demoReport,summary:{total:380,passed:380,failed:0},
    rules:demoReport.rules.map(rule=>({...rule,passed:rule.total,failed:0,passRate:100})),
    devices:demoReport.devices.map(device=>({...device,failedRuleIds:[]}))};
  return demoReport;
}
export const reportData=reportForScenario(typeof window==='undefined'?'current':new URLSearchParams(window.location.search).get('scenario'));

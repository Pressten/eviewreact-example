import { productLineMap } from "./stages.js";
import { ownerMap } from "./salespeople.js";

// 商机详情 — 由商机基础信息 + 阶段化模板生成(跟进记录/联系人/竞争情况)
const timelineByStage = {
  contact: (c) => [
    { date: "2026-10-08", color: "#2070F3", title: "线索建档", desc: `${c} 采购部通过官网提交需求咨询,市场部流转至销售。` },
    { date: "2026-10-12", color: "#2070F3", title: "首次电话沟通", desc: "电话了解客户预算与决策链,确认立项时间窗口。" },
    { date: "2026-10-16", color: "#2070F3", title: "需求初稿确认", desc: "客户反馈核心痛点,输出需求初稿待评审。" },
    { date: "2026-10-20", color: "#2070F3", title: "二面技术对接", desc: "技术负责人参与,约定下周方案宣讲。" },
  ],
  confirm: (c) => [
    { date: "2026-09-28", color: "#7B61FF", title: "需求确认会", desc: `${c} 业务方对需求清单逐条确认,进入方案阶段。` },
    { date: "2026-10-09", color: "#7B61FF", title: "预算冻结", desc: "客户财务完成本季度预算冻结,金额可支撑方案。" },
    { date: "2026-10-15", color: "#7B61FF", title: "决策链梳理", desc: "梳理赞助人/决策人/影响者,关键决策人已锁定。" },
    { date: "2026-10-19", color: "#7B61FF", title: "方案立项", desc: "客户内部立项通过,进入方案报价环节。" },
  ],
  proposal: (c) => [
    { date: "2026-09-20", color: "#00A8A8", title: "方案初稿提交", desc: `${c} 收到方案初稿,技术选型基本认可。` },
    { date: "2026-09-28", color: "#00A8A8", title: "技术答疑", desc: "完成两轮技术答疑,指标达成率 96%。" },
    { date: "2026-10-10", color: "#00A8A8", title: "商务报价", desc: "提交商务报价单,客户启动内部比价。" },
    { date: "2026-10-18", color: "#00A8A8", title: "终版方案确认", desc: "总工确认技术指标,待领导签批。" },
  ],
  negotiate: (c) => [
    { date: "2026-09-15", color: "#F4840C", title: "进入商务谈判", desc: `${c} 谈判小组成立,我司授权折扣底线。` },
    { date: "2026-09-28", color: "#F4840C", title: "付款条款拉锯", desc: "客户要求 3-6-1 付款,法务争取 4-5-1。" },
    { date: "2026-10-12", color: "#F4840C", title: "价格达成一致", desc: "最终成交价较报价下调 8%,进入会签。" },
    { date: "2026-10-19", color: "#F4840C", title: "合同会签中", desc: "双方法务就会签条款做最后确认。" },
  ],
  signing: (c) => [
    { date: "2026-09-10", color: "#09AA71", title: "合同定稿", desc: `${c} 合同条款全部谈妥,进入定稿。` },
    { date: "2026-09-22", color: "#09AA71", title: "双方法务签字", desc: "双方法务完成签字,寄送盖章。" },
    { date: "2026-10-08", color: "#09AA71", title: "客户用印", desc: "客户完成内部用印流程。" },
    { date: "2026-10-19", color: "#09AA71", title: "内部归档", desc: "合同已签,走内部归档与交付对接。" },
  ],
};

const contactsTpl = () => [
  { name: "王建华", title: "采购总监",   phone: "138-0013-8000", role: "决策人",   email: "wangjh@example.com" },
  { name: "李慧敏", title: "技术负责人", phone: "139-0013-9000", role: "技术评估", email: "lihm@example.com" },
  { name: "陈志远", title: "财务经理",   phone: "137-0013-7000", role: "预算审批", email: "chenzy@example.com" },
];

const competitorsTpl = [
  { name: "友商 A · 浪潮", threat: "high",   threatLabel: "高威胁", status: "同档报价,客户在比",       win: "35%" },
  { name: "友商 B · 用友", threat: "medium", threatLabel: "中威胁", status: "方案偏重通用,差异化弱",   win: "20%" },
  { name: "友商 C · 金蝶", threat: "low",    threatLabel: "低威胁", status: "价格更低但服务能力不足", win: "10%" },
];

export function buildOppDetail(opp) {
  const owner = ownerMap[opp.owner];
  return {
    basic: {
      customer: opp.customer,
      amount: opp.amount,
      productLineLabel: productLineMap[opp.productLine] || "—",
      ownerName: owner ? owner.name : "—",
      ownerDept: owner ? owner.deptName : "—",
      ownerColor: owner ? owner.color : "#0067D1",
      closeDate: opp.closeDate,
      stayDays: opp.stayDays,
      actionLabel: opp.actionLabel,
      createdAt: opp.createdAt,
      nearExpiry: opp.nearExpiry,
    },
    timeline: timelineByStage[opp.stage] ? timelineByStage[opp.stage](opp.customer) : [],
    contacts: contactsTpl(opp.customer),
    competitors: competitorsTpl,
  };
}

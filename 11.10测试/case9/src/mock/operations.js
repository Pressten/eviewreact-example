// Layer 2 mock — ⑦ 值班交接 Timeline（今日 6 条）+ ⑧ 变更动态（今日发布 4 条）

export const HANDOVERS = [
  {
    id: "HO-01", time: "00:00", officer: "李婧", shift: "夜班", kind: "交接", result: "ongoing",
    event: "夜班交接：遗留 payment-service 错误率 P0 告警未恢复，payment-mysql 慢查询 DDL 工单待审核",
    detail: {
      process: "与夜班值班工程师逐项核对未关闭告警、进行中变更与待办工单；确认支付服务事故仍处于处置中，暂未达到升级条件。",
      impact: "交接期间告警响应不间断，无新增影响。",
      followup: "下一班次重点跟进慢查询 DDL 工单审核与支付服务恢复情况。",
    },
  },
  {
    id: "HO-02", time: "02:14", officer: "李婧", shift: "夜班", kind: "处置", result: "success",
    event: "CDN 华北节点抖动导致静态资源加载超时，切换备用线路",
    detail: {
      process: "02:05 监测到静态资源 5xx 集中在 CDN 华北节点；02:14 将华北域名切换至备用线路，缓存命中率恢复 98%。",
      impact: "App 首页图片加载受影响约 9 分钟，无订单损失。",
    },
  },
  {
    id: "HO-03", time: "05:37", officer: "李婧", shift: "夜班", kind: "处置", result: "success",
    event: "order-service pod-7 连续 OOM，扩容 10→12 实例并调整堆参数",
    detail: {
      process: "05:20 pod-7 两次 OOMKill，确认为大促缓存预热任务引起内存泄漏；05:37 扩容至 12 实例并临时调大堆上限。",
      impact: "订单提交成功率短暂下降 0.3%，05:55 完全恢复。",
      followup: "缓存预热任务已提交优化工单，待大促前修复。",
    },
  },
  {
    id: "HO-04", time: "08:00", officer: "张伟", shift: "白班", kind: "交接", result: "ongoing",
    event: "白班交接：重点跟进支付服务错误率与 payment-mysql 慢查询工单",
    detail: {
      process: "复核夜班遗留：支付 P0 事故处置中、CDN 已恢复、order-service 扩容完成；确认本班次跟进优先级。",
      impact: "无新增影响。",
      followup: "09:00 前确认 DDL 工单审核状态，必要时升级 DBA。",
    },
  },
  {
    id: "HO-05", time: "09:42", officer: "张伟", shift: "白班", kind: "处置", result: "ongoing",
    event: "payment-mysql 慢查询定位为订单明细表缺索引，DDL 工单已提交待审核",
    detail: {
      process: "慢查询日志显示支付流水按订单号关联查询全表扫描（平均 1.8s）；已提交增加联合索引的 DDL 工单，等待 DBA 审核窗口。",
      impact: "支付成功率受慢查询影响持续下降中，已通知业务侧。",
      followup: "DDL 审核通过后预计 20 分钟内恢复，持续观察错误率。",
    },
  },
  {
    id: "HO-06", time: "11:20", officer: "张伟", shift: "白班", kind: "处置", result: "rollback",
    event: "search-service v2.3.1 灰度引发查询超时，执行回滚",
    detail: {
      process: "11:05 灰度 20% 流量后 P99 超时率超阈值；11:20 确认与新版查询引擎相关，执行回滚至 v2.3.0。",
      impact: "灰度期间约 3% 搜索请求超时，回滚后 5 分钟内恢复。",
      followup: "已通知研发修复，灰度发布窗口暂停。",
    },
  },
];

export const CHANGES = [
  {
    id: "CHG-01", time: "09:30", service: "push-service", version: "v5.0.0", owner: "刘洋", result: "success",
    desc: "消息通道重构，全量发布（耗时 6 分钟）",
  },
  {
    id: "CHG-02", time: "10:05", service: "order-service", version: "v3.4.2", owner: "王磊", result: "success",
    desc: "优惠券分摊逻辑修复，全量发布",
  },
  {
    id: "CHG-03", time: "11:20", service: "search-service", version: "v2.3.1", owner: "陈静", result: "rollback",
    desc: "查询引擎升级，灰度 20% 发布",
    rollbackNote: "灰度流量 P99 超时率超阈值，值班工程师 11:20 执行回滚至 v2.3.0，影响时长约 14 分钟；已确认全量恢复，灰度窗口暂停。",
  },
  {
    id: "CHG-04", time: "11:45", service: "product-service", version: "v6.1.3", owner: "赵敏", result: "failed",
    desc: "商品详情页缓存策略调整，全量发布",
    rollbackNote: "发布后 5 分钟错误率升至 2.1%，触发发布系统自动回滚至 v6.1.2，影响时长 8 分钟；当前流量已恢复，缓存策略待研发修复后重新评审。",
  },
];

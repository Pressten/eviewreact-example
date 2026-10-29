import { useMemo } from "react";
import { Tooltip } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { roleDistribution } from "../../mock/permissions.js";
import { roleConfig } from "../../mock/members.js";
import "./index.css";

// 角色分布卡 — 饼图展示 4 种角色人数构成；hover 显示角色说明
export default function RoleDistribution() {
  const chartOption = useMemo(
    () => ({
      data: roleDistribution.map((r) => ({ name: r.name, value: r.value })),
      title: { text: "61", subtext: "成员总数" },
      legendPosition: "bottomCenter",
    }),
    []
  );

  return (
    <SectionCard
      title="角色分布"
      subtitle="全公司 4 种角色的人数构成"
      icon="chart-pie"
      action={
        <Tooltip title="点击图例可切换显示">
          <button type="button" className="role-dist__help" title="帮助">
            <Icon name="circle-question-mark" size="1rem" />
          </button>
        </Tooltip>
      }
      bodyClassName="role-dist__body"
    >
      <div className="role-dist__chart-wrap">
        <Chart name="PieChart" option={chartOption} style={{ height: "13rem" }} />
      </div>
      <ul className="role-dist__legend">
        {roleDistribution.map((r) => (
          <Tooltip
            key={r.role}
            title={`${r.name}：${roleConfig[r.role]?.desc || ""}`}
            placement="top"
          >
            <li className={`role-dist__item role-dist__item--${r.role}`}>
              <span className="role-dist__dot" />
              <div className="role-dist__item-info">
                <span className="role-dist__item-name">{r.name}</span>
                <span className="role-dist__item-desc">{roleConfig[r.role]?.desc?.slice(0, 16)}…</span>
              </div>
              <span className="role-dist__item-count">{r.value} 人</span>
            </li>
          </Tooltip>
        ))}
      </ul>
    </SectionCard>
  );
}

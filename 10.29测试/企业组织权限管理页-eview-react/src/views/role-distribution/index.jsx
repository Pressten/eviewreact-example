import { useMemo } from "react";
import { IconPlusIcPublicChart, IconPlusIcPublicQuestionmarkCircle } from '@hui/icon-plus';
import TipBox from "@nce/eview-react/TipBox";
import Chart from "@nce/eview-react/Chart";
import SectionCard from "../../components/section-card/index.jsx";

import { useApp } from "../../context.jsx";
import { roleDistribution } from "../../mock/permissions.js";
import { roleConfig } from "../../mock/members.js";
import "./index.css";

// 瑙掕壊鍒嗗竷鍗?鈥?楗煎浘灞曠ず 4 绉嶈鑹蹭汉鏁版瀯鎴愶紱hover 鏄剧ず瑙掕壊璇存槑
export default function RoleDistribution() {
  const { isDark } = useApp();
  const chartBase = useMemo(
    () => ({ a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" }),
    [isDark]
  );
  const chartOption = useMemo(
    () => ({
      ...chartBase,
      data: roleDistribution.map((r) => ({ name: r.name, value: r.value })),
      title: { text: "61", subtext: "鎴愬憳鎬绘暟" },
      legendPosition: "bottomCenter",
    }),
    [chartBase]
  );

  return (
    <SectionCard
      title="瑙掕壊鍒嗗竷"
      subtitle="鍏ㄥ叕鍙?4 绉嶈鑹茬殑浜烘暟鏋勬垚"
      icon={<IconPlusIcPublicChart iconSize="1.25rem" iconColor={['currentcolor']} className="section-card__icon" />}
      action={
        <TipBox type="simple" content="鐐瑰嚮鍥句緥鍙垝鎹㈡樉绀?>
          <button type="button" className="role-dist__help" title="甯姪">
            <IconPlusIcPublicQuestionmarkCircle iconSize="1rem" iconColor={['currentcolor']} />
          </button>
        </TipBox>
      }
      bodyClassName="role-dist__body"
    >
      <div className="role-dist__chart-wrap">
        <Chart name="PieChart" option={chartOption} style={{ height: "13rem" }} />
      </div>
      <ul className="role-dist__legend">
        {roleDistribution.map((r) => (
          <TipBox
            key={r.role}
            type="simple"
            content={`${r.name}锛?{roleConfig[r.role]?.desc || ""}`}
            direction="top"
          >
            <li className={`role-dist__item role-dist__item--${r.role}`}>
              <span className="role-dist__dot" />
              <div className="role-dist__item-info">
                <span className="role-dist__item-name">{r.name}</span>
                <span className="role-dist__item-desc">{roleConfig[r.role]?.desc?.slice(0, 16)}鈥?/span>
              </div>
              <span className="role-dist__item-count">{r.value} 浜?/span>
            </li>
          </TipBox>
        ))}
      </ul>
    </SectionCard>
  );
}

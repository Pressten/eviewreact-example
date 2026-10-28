import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../../src/context.jsx";
import { filterDeals, topCustomers } from "../../../src/mock/selectors.js";
import { timeRangeMap } from "../../../src/mock/stages.js";
import { fmtMoney } from "../../../src/mock/format.js";
import OwnerAvatar from "../../../src/components/owner-avatar/index.jsx";
import "./index.css";

export default function TopCustomers() {
  const { team, productLine, dept, timeRange } = useApp();
  const deals = filterDeals({ team, productLine, dept, timeRange });
  const top = topCustomers(deals, 8);
  const maxAmount = top.length > 0 ? top[0].amount : 1;

  return (
    <div className="tcust">
      <div className="tcust__meta">
        <span className="tcust__range">{timeRangeMap[timeRange]}签约金额 TOP8</span>
        <span className="tcust__total">{top.length} 家客户</span>
      </div>
      <div className="tcust__list">
        {top.map((c) => (
          <div className="tcust__row" key={`${c.customer}-${c.rank}`}>
            <div className={`tcust__rank tcust__rank--${c.rank <= 3 ? "top" : "normal"}`}>
              {c.rank <= 3 ? <Icon name="trophy" size="0.875rem" color="#FFFFFF" /> : c.rank}
            </div>
            <div className="tcust__main">
              <div className="tcust__name-row">
                <span className="tcust__name">{c.customer}</span>
                {c.owner && (
                  <span className="tcust__owner" title={c.owner.name}>
                    <OwnerAvatar person={c.owner} size="1.25rem" />
                    {c.owner.name}
                  </span>
                )}
              </div>
              <div className="tcust__bar-track">
                <div
                  className="tcust__bar-fill"
                  style={{ width: `${(c.amount / maxAmount) * 100}%`, background: c.owner ? c.owner.color : "var(--primary)" }}
                />
              </div>
            </div>
            <div className="tcust__amount">{fmtMoney(c.amount)}</div>
          </div>
        ))}
        {top.length === 0 && (
          <div className="tcust__empty">当前筛选条件下暂无签约客户</div>
        )}
      </div>
    </div>
  );
}

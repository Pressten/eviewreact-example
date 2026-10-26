import { useState } from "react";
import { IconPlusIcIctPointer, IconPlusIcPublicBoardBa, IconPlusIcPublicFunnel, IconPlusIcPublicListBullet, IconPlusIcPublicPlus } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import SelectCard from "@nce/eview-react/SelectCard";
import Select from "@/shared/Select";
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { filterOpps } from "../../mock/selectors.js";
import { deptOptions, productLineOptions, timeRangeOptions, stageMap } from "../../mock/stages.js";
import { ownerMap } from "../../mock/salespeople.js";
import { fmtMoney } from "../../mock/format.js";
import Kanban from "./kanban.jsx";
import ListView from "./list-view.jsx";
import NewOppModal from "./new-opp-modal.jsx";
import DetailDrawer from "./detail-drawer.jsx";
import "./index.css";

export default function OppBoard() {
  const {
    team, productLine, setProductLine,
    dept, setDept, timeRange, setTimeRange,
    funnelStage, setFunnelStage,
  } = useApp();

  const [view, setView] = useState("board");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [created, setCreated] = useState([]);

  const baseOpps = filterOpps({ team, productLine, dept });
  const createdFiltered = created.filter((o) => {
    if (o.team !== team) return false;
    if (productLine !== "all" && o.productLine !== productLine) return false;
    if (dept !== "all") {
      const ow = ownerMap[o.owner];
      if (!ow || ow.dept !== dept) return false;
    }
    return true;
  });
  const opps = [...baseOpps, ...createdFiltered];
  const totalAmount = opps.reduce((s, o) => s + o.amount, 0);

  const handleCreated = (newOpp) => {
    setCreated((prev) => [newOpp, ...prev]);
    setModalOpen(false);
  };

  const viewData = [
    { text: (<span className="ob__seg"><IconPlusIcPublicBoardBa iconSize="0.875rem" iconColor={['currentcolor']} />看板</span>), value: "board" },
    { text: (<span className="ob__seg"><IconPlusIcPublicListBullet iconSize="0.875rem" iconColor={['currentcolor']} />列表</span>), value: "list" },
  ];

  const deptOpts = deptOptions.map((o) => ({ value: o.value, text: o.label }));
  const plOpts = productLineOptions.map((o) => ({ value: o.value, text: o.label }));
  const trOpts = timeRangeOptions.map((o) => ({ value: o.value, text: o.label }));

  return (
    <div className="ob">
      <div className="ob__toolbar">
        <div className="ob__filters">
          <span className="ob__filter-label">
            <IconPlusIcPublicFunnel iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
            筛选
          </span>
          <Select
            size="middle"
            value={dept}
            onChange={(v) => setDept(v)}
            options={deptOpts}
            className="ob__sel"
          />
          <Select
            size="middle"
            value={productLine}
            onChange={(v) => setProductLine(v)}
            options={plOpts}
            className="ob__sel"
          />
          <Select
            size="middle"
            value={timeRange}
            onChange={(v) => setTimeRange(v)}
            options={trOpts}
            className="ob__sel ob__sel--sm"
          />
        </div>

        <div className="ob__actions">
          <span className="ob__count">
            商机 <b>{opps.length}</b> 个 · 合计 <b className="ob__count-amt">{fmtMoney(totalAmount)}</b>
          </span>
          <SelectCard value={view} onChange={(v) => setView(v)} data={viewData} />
          <Button
            status="primary"
            text="新建商机"
            leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['#FFFFFF']} />}
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>

      {funnelStage && (
        <div className="ob__chips">
          <Tag
            closable
            onClose={(e) => { e.preventDefault(); setFunnelStage(null); }}
            color="primary"
            className="ob__chip"
          >
            阶段筛选：{stageMap[funnelStage].label}
          </Tag>
          <span className="ob__chips-hint">
            <IconPlusIcIctPointer iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
            来自销售漏斗 · 点击对应列或此处 ✕ 取消
          </span>
        </div>
      )}

      <div className="ob__body">
        {view === "board" ? (
          <Kanban opps={opps} funnelStage={funnelStage} onSelect={setSelectedOpp} />
        ) : (
          <ListView opps={opps} onSelect={setSelectedOpp} />
        )}
      </div>

      <NewOppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        team={team}
      />
      <DetailDrawer opp={selectedOpp} onClose={() => setSelectedOpp(null)} />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { IconPlusIcPublicClose, IconPlusIcPublicEllipsis, IconPlusIcPublicLists, IconPlusIcPublicMappinOnMap, IconPlusIcPublicPerson, IconPlusIcPublicPower, IconPlusIcPublicSearch, IconPlusIcPublicTxtFileTextured } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import DropDown from "@nce/eview-react/DropDown";
import Dialog from "@nce/eview-react/Dialog";
import MessageDialog from "@nce/eview-react/MessageDialog";
import SelectCard from "@nce/eview-react/SelectCard";
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import { message } from "../../components/notice/index.jsx";
import { BUSINESS_CIRCLES, isStoreAbnormal } from "../../mock/data.js";
import { fmtInt, fmtMoney } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const STATUS_TAG = { 营业中: "success", 歇业: "error", 装修中: "warning" };
const CIRCLE_TAG = { 社区: "blue", 写字楼: "geekblue", 交通枢纽: "cyan", 学校: "purple" };

export default function StoreTable() {
  const {
    region,
    province,
    setProvince,
    abnormalOnly,
    setAbnormalOnly,
    stores,
    setDetailStoreId,
    setRestockStoreId,
    updateStore,
    restockStore,
  } = useApp();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [circleFilter, setCircleFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [checkedIndexes, setCheckedIndexes] = useState([]);

  // 修改店长弹窗（H5 表单骨架）
  const [mgrStore, setMgrStore] = useState(null);
  const [mgrName, setMgrName] = useState("");
  const [mgrError, setMgrError] = useState("");

  // 临时歇业确认（Modal.confirm → MessageDialog 声明式 state）
  const [closePending, setClosePending] = useState(null);
  // 批量补货确认（Modal.confirm → MessageDialog 声明式 state）
  const [batchPending, setBatchPending] = useState(false);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return stores.filter((s) => {
      if (region !== "全部" && s.region !== region) return false;
      if (province && s.province !== province) return false;
      if (abnormalOnly && !isStoreAbnormal(s)) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (circleFilter && s.businessCircle !== circleFilter) return false;
      if (kw) {
        const hit =
          s.storeName.includes(kw) ||
          s.storeId.toLowerCase().includes(kw) ||
          s.city.includes(kw) ||
          s.province.includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [stores, region, province, abnormalOnly, statusFilter, circleFilter, keyword]);

  // 筛选条件变化回到第一页并清空勾选
  useEffect(() => {
    setPage(1);
    setCheckedIndexes([]);
  }, [region, province, abnormalOnly, statusFilter, circleFilter, keyword]);

  // 行点击 → 高亮并滚动到所属省份卡
  useEffect(() => {
    if (!province) return;
    const el = document.querySelector(`[data-province="${province}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [province]);

  const openDetail = (r) => setDetailStoreId(r.storeId);

  const handleRowRestock = (r) => {
    if (r.stockoutSku === 0) {
      message.info(`${r.storeName} 当前无缺货商品，无需补货`);
      return;
    }
    setRestockStoreId(r.storeId);
  };

  const handleMore = (key, r) => {
    if (key === "manager") {
      setMgrName(r.managerName);
      setMgrError("");
      setMgrStore(r);
    } else if (key === "close") {
      setClosePending(r);
    } else if (key === "license") {
      message.info(`${r.storeName} 证照状态：${r.licenseStatus}（档案已推送至证照专员）`);
    }
  };

  // 临时歇业确认回调（MessageDialog ok）
  const confirmClose = () => {
    if (!closePending) return;
    const r = closePending;
    updateStore(r.storeId, { status: "歇业", dailySales: 0, customerCount: 0 });
    message.success(`${r.storeName} 已设为临时歇业`);
    setClosePending(null);
  };

  const saveManager = () => {
    const name = mgrName.trim();
    if (!name) {
      setMgrError("请输入店长姓名");
      return;
    }
    updateStore(mgrStore.storeId, { managerName: name });
    message.success(`已将 ${mgrStore.storeName} 店长变更为 ${name}`);
    setMgrStore(null);
  };

  // 批量补货：仅对勾选中且存在缺货的门店生成补货单（按区域中心仓 · 全品类）
  const selectedStores = checkedIndexes.map((i) => filtered[i]).filter(Boolean);
  const restockable = selectedStores.filter((s) => s.stockoutSku > 0 && !s.restocked);

  const handleBatchRestock = () => {
    if (restockable.length === 0) {
      message.info("所选门店均无缺货商品，无需补货");
      return;
    }
    setBatchPending(true);
  };

  // 批量补货确认回调（MessageDialog ok）
  const confirmBatchRestock = () => {
    restockable.forEach((s) => restockStore(s.storeId));
    message.success(`已为 ${restockable.length} 家门店生成补货单，补给看板已同步更新`);
    setCheckedIndexes([]);
    setBatchPending(false);
  };

  const columns = [
    {
      title: "门店编号",
      key: "storeId",
      render: (v) => <span className="cell-id">{v}</span>,
    },
    {
      title: "门店名",
      key: "storeName",
      ellipsis: true,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <a
            onClick={(e) => {
              e.stopPropagation();
              openDetail(r);
            }}
          >
            {r?.storeName}
          </a>
        );
      },
    },
    { title: "城市", key: "city", allowSort: false },
    {
      title: "商圈类型",
      key: "businessCircle",
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return <Tag color={CIRCLE_TAG[r?.businessCircle]}>{r?.businessCircle}</Tag>;
      },
    },
    {
      title: "营业状态",
      key: "status",
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return <Tag color={STATUS_TAG[r?.status]}>{r?.status}</Tag>;
      },
    },
    {
      title: "今日营业额",
      key: "dailySales",
      align: "right",
      render: (v) => (v > 0 ? fmtMoney(v) : <span className="cell-dim">—</span>),
    },
    {
      title: "今日客流",
      key: "customerCount",
      align: "right",
      render: (v) => (v > 0 ? fmtInt(v) : <span className="cell-dim">—</span>),
    },
    {
      title: "缺货 SKU",
      key: "stockoutSku",
      align: "right",
      render: (v) => (v > 20 ? <b className="cell-danger">{v}</b> : v > 0 ? v : <span className="cell-dim">0</span>),
    },
    {
      title: "操作",
      key: "action",
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <div className="row-actions" onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: "0.5rem" }}>
            <a onClick={() => openDetail(r)}>详情</a>
            <a onClick={() => handleRowRestock(r)}>一键补货</a>
            <DropDown
              trigger="click"
              position="right"
              popupDirection="bottom"
              data={[
                { value: "manager", icon: <IconPlusIcPublicPerson iconSize="0.875rem" iconColor={['currentcolor']} />, text: "修改店长" },
                { value: "close", icon: <IconPlusIcPublicPower iconSize="0.875rem" iconColor={['currentcolor']} />, text: "临时歇业", disabled: r?.status === "歇业" },
                { value: "license", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, text: "查看证照" },
              ]}
              onItemClick={(item) => handleMore(item.value, r)}
            >
              <span className="more-trigger">
                <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} title="更多操作" />
              </span>
            </DropDown>
          </div>
        );
      },
    },
  ];

  return (
    <SectionCard
      className="st-card"
      title="门店明细"
      icon={<IconPlusIcPublicLists iconSize="1rem" iconColor={['currentcolor']} />}
      extra={
        <div className="st-meta">
          {checkedIndexes.length > 0 && (
            <Button size="small" status="primary" onClick={handleBatchRestock}>
              批量补货 · 已选 {checkedIndexes.length}
            </Button>
          )}
          {province && (
            <button type="button" className="pv-chip" onClick={() => setProvince(null)} title="清除省份联动">
              <IconPlusIcPublicMappinOnMap iconSize="0.75rem" iconColor={['currentcolor']} />
              {province}
              <IconPlusIcPublicClose iconSize="0.75rem" iconColor={['currentcolor']} />
            </button>
          )}
          <span className="st-count">
            当前大区 {region} · 匹配 {filtered.length} 家门店
          </span>
        </div>
      }
      bodyClassName="st-body"
    >
      <div className="st-toolbar">
        <SelectCard
          type="small"
          value={abnormalOnly}
          onChange={(v) => setAbnormalOnly(v)}
          data={[
            { text: "全部门店", value: false },
            { text: "异常门店", value: true },
          ]}
        />
        <TextField
          size="small"
          style={{ width: "15rem" }}
          placeholder="搜索门店名 / 编号 / 城市"
          value={keyword}
          onChange={(v) => setKeyword(v)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['#AEAEAE']} />}
        />
        <Select
          size="small"
          enableClear
          style={{ width: "8rem" }}
          defaultLabel="营业状态"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          options={["营业中", "歇业", "装修中"].map((v) => ({ value: v, text: v }))}
        />
        <Select
          size="small"
          enableClear
          style={{ width: "8.5rem" }}
          defaultLabel="商圈类型"
          value={circleFilter}
          onChange={(v) => setCircleFilter(v)}
          options={BUSINESS_CIRCLES.map((v) => ({ value: v, text: v }))}
        />
      </div>

      <Table
        className="st-table"
        width="unset"
        columns={columns}
        dataset={filtered}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, rows) => setCheckedIndexes(rows)}
        onHeaderCheck={(rows) => setCheckedIndexes(rows)}
        onRowClick={(row) => {
          const r = row?.rawData;
          if (r) setProvince(r.province);
        }}
        enablePagination
        enableAutoPaging
        currentPage={page}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(ps) => {
          setPageSize(ps);
          setPage(1);
        }}
      />

      <Dialog
        isOpen={!!mgrStore}
        title={`修改店长 — ${mgrStore ? mgrStore.storeName : ""}`}
        onClose={() => setMgrStore(null)}
        destroyOnClose
        buttons={[
          { text: "取消", onClick: () => setMgrStore(null) },
          { text: "保存", status: "primary", onClick: saveManager },
        ]}
      >
        <form className="mgr-form" onSubmit={(e) => e.preventDefault()}>
          <label className="form-label required" htmlFor="mgr-name">
            新任店长
          </label>
          <div className="form-field">
            <TextField
              id="mgr-name"
              value={mgrName}
              hintType="tip"
              placeholder="请输入新任店长姓名"
              style={{ width: "100%" }}
              onChange={(v) => {
                setMgrName(v);
                setMgrError("");
              }}
            />
            {mgrError && <div className="form-error">{mgrError}</div>}
          </div>
        </form>
      </Dialog>

      <MessageDialog
        type="confirm"
        iconLocation="title"
        isOpen={!!closePending}
        title="临时歇业确认"
        content={closePending ? `确认将「${closePending.storeName}」设为临时歇业？歇业期间营业额与客流将停止统计，门店计入异常门店数。` : ""}
        onClose={() => setClosePending(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setClosePending(null) },
          ok: { text: "确认歇业", onClick: confirmClose },
        }}
      />

      <MessageDialog
        type="confirm"
        iconLocation="title"
        isOpen={batchPending}
        title="批量生成补货单"
        content={batchPending ? `已选 ${selectedStores.length} 家门店，其中 ${restockable.length} 家存在缺货（合计缺货 ${restockable.reduce(
          (a, s) => a + s.stockoutSku,
          0
        )} 个 SKU），将按各门店所属区域中心仓 · 全品类自动补货。` : ""}
        onClose={() => setBatchPending(false)}
        buttons={{
          cancel: { text: "取消", onClick: () => setBatchPending(false) },
          ok: { text: "确认生成", onClick: confirmBatchRestock },
        }}
      />
    </SectionCard>
  );
}

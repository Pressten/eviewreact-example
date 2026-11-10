import { useEffect, useMemo, useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import TextField from "@cloudsop/eview-ui/TextField";
import DialogPro from "@cloudsop/eview-ui/DialogPro";
import MessageDialogPro from "@cloudsop/eview-ui/MessageDialogPro";
import SelectCard from "@cloudsop/eview-ui/SelectCard";
import SelectPro from "@cloudsop/eview-ui/SelectPro";
import TablePro from "@cloudsop/eview-ui/TablePro";
import Tag from "@cloudsop/eview-ui/Tag";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { useToast } from "../../components/toast/index.jsx";
import { BUSINESS_CIRCLES, isStoreAbnormal } from "../../mock/data.js";
import { fmtInt, fmtMoney } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const STATUS_TAG = { 营业中: "success", 歇业: "danger", 装修中: "warning" };
const CIRCLE_TAG = { 社区: "primary", 写字楼: "caution", 交通枢纽: "warning", 学校: "success" };

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
  const notify = useToast();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [circleFilter, setCircleFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 修改店长弹窗（H5 表单骨架）
  const [mgrStore, setMgrStore] = useState(null);
  const [mgrName, setMgrName] = useState("");
  const [mgrError, setMgrError] = useState("");

  // Modal.confirm → 受控 MessageDialogPro（命令式脱离 context，优先受控形态）
  const [confirm, setConfirm] = useState(null); // { title, content, onOk }

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
    setSelectedRowKeys([]);
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
      notify("default", `${r.storeName} 当前无缺货商品，无需补货`);
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
      setConfirm({
        title: "临时歇业确认",
        okText: "确认歇业",
        content: `确认将「${r.storeName}」设为临时歇业？歇业期间营业额与客流将停止统计，门店计入异常门店数。`,
        onOk: () => {
          updateStore(r.storeId, { status: "歇业", dailySales: 0, customerCount: 0 });
          notify("success", `${r.storeName} 已设为临时歇业`);
          setConfirm(null);
        },
      });
    } else if (key === "license") {
      notify("default", `${r.storeName} 证照状态：${r.licenseStatus}（档案已推送至证照专员）`);
    }
  };

  const saveManager = () => {
    const name = mgrName.trim();
    if (!name) {
      setMgrError("请输入店长姓名");
      return;
    }
    updateStore(mgrStore.storeId, { managerName: name });
    notify("success", `已将 ${mgrStore.storeName} 店长变更为 ${name}`);
    setMgrStore(null);
  };

  // 批量补货：仅对勾选中且存在缺货的门店生成补货单（按区域中心仓 · 全品类）
  const selectedStores = stores.filter((s) => selectedRowKeys.includes(s.storeId));
  const restockable = selectedStores.filter((s) => s.stockoutSku > 0 && !s.restocked);

  const handleBatchRestock = () => {
    if (restockable.length === 0) {
      notify("default", "所选门店均无缺货商品，无需补货");
      return;
    }
    setConfirm({
      title: "批量生成补货单",
      okText: "确认生成",
      content: `已选 ${selectedStores.length} 家门店，其中 ${restockable.length} 家存在缺货（合计缺货 ${restockable.reduce(
        (a, s) => a + s.stockoutSku,
        0
      )} 个 SKU），将按各门店所属区域中心仓 · 全品类自动补货。`,
      onOk: () => {
        restockable.forEach((s) => restockStore(s.storeId));
        notify("success", `已为 ${restockable.length} 家门店生成补货单，补给看板已同步更新`);
        setSelectedRowKeys([]);
        setConfirm(null);
      },
    });
  };

  const columns = [
    {
      title: "门店编号",
      dataIndex: "storeId",
      width: 104,
      render: (v) => <span className="cell-id">{v}</span>,
    },
    {
      title: "门店名",
      dataIndex: "storeName",
      ellipsis: true,
      render: (_, r) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            openDetail(r);
          }}
        >
          {r.storeName}
        </a>
      ),
    },
    { title: "城市", dataIndex: "city", width: 88 },
    {
      title: "商圈类型",
      dataIndex: "businessCircle",
      width: 104,
      render: (v) => <Tag type="status" color={CIRCLE_TAG[v]}>{v}</Tag>,
    },
    {
      title: "营业状态",
      dataIndex: "status",
      width: 96,
      render: (v) => <Tag type="status" color={STATUS_TAG[v]}>{v}</Tag>,
    },
    {
      title: "今日营业额",
      dataIndex: "dailySales",
      width: 116,
      align: "right",
      sorter: (a, b) => a.dailySales - b.dailySales,
      render: (v) => (v > 0 ? fmtMoney(v) : <span className="cell-dim">—</span>),
    },
    {
      title: "今日客流",
      dataIndex: "customerCount",
      width: 96,
      align: "right",
      sorter: (a, b) => a.customerCount - b.customerCount,
      render: (v) => (v > 0 ? fmtInt(v) : <span className="cell-dim">—</span>),
    },
    {
      title: "缺货 SKU",
      dataIndex: "stockoutSku",
      width: 96,
      align: "right",
      sorter: (a, b) => a.stockoutSku - b.stockoutSku,
      render: (v) => (v > 20 ? <b className="cell-danger">{v}</b> : v > 0 ? v : <span className="cell-dim">0</span>),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, r) => (
        <span className="row-actions" onClick={(e) => e.stopPropagation()}>
          <a onClick={() => openDetail(r)}>详情</a>
          <a onClick={() => handleRowRestock(r)}>一键补货</a>
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            overlay={
              <div className="st-more-menu" style={{ minWidth: "9rem" }}>
                <a className="st-more-item" onClick={() => handleMore("manager", r)}>
                  <Icon name="user-round" size="0.875rem" /> 修改店长
                </a>
                <a
                  className={`st-more-item${r.status === "歇业" ? " st-more-disabled" : ""}`}
                  onClick={r.status === "歇业" ? undefined : () => handleMore("close", r)}
                >
                  <Icon name="power" size="0.875rem" /> 临时歇业
                </a>
                <a className="st-more-item" onClick={() => handleMore("license", r)}>
                  <Icon name="file-text" size="0.875rem" /> 查看证照
                </a>
              </div>
            }
          >
            <span className="more-trigger">
              <Icon name="ellipsis" size="0.875rem" title="更多操作" />
            </span>
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <SectionCard
      className="st-card"
      title="门店明细"
      icon="layout-list"
      extra={
        <div className="st-meta">
          {selectedRowKeys.length > 0 && (
            <Button size="small" status="primary" onClick={handleBatchRestock}>
              批量补货 · 已选 {selectedRowKeys.length}
            </Button>
          )}
          {province && (
            <button type="button" className="pv-chip" onClick={() => setProvince(null)} title="清除省份联动">
              <Icon name="map-pin" size="0.75rem" />
              {province}
              <Icon name="x" size="0.75rem" />
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
          style={{ width: "15rem" }}
          placeholder="搜索门店名 / 编号 / 城市"
          value={keyword}
          onChange={(value) => setKeyword(value)}
        />
        <SelectPro
          style={{ width: "8rem" }}
          placeholder="营业状态"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          options={["营业中", "歇业", "装修中"].map((v) => ({ value: v, text: v }))}
        />
        <SelectPro
          style={{ width: "8.5rem" }}
          placeholder="商圈类型"
          value={circleFilter}
          onChange={(v) => setCircleFilter(v)}
          options={BUSINESS_CIRCLES.map((v) => ({ value: v, text: v }))}
        />
      </div>

      <TablePro
        className="st-table"
        rowKey="storeId"
        columns={columns}
        dataset={filtered}
        columnResizable={false}
        sortOrderList={["ascend", "descend"]}
        selection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        onRow={(r) => ({
          onClick: (e) => {
            // 勾选框点击不触发行联动（eview-ui 选择列结构与 antd 不同，用 input/label 兜底判断）
            if (e.target.closest('input[type="checkbox"], label')) return;
            setProvince(r.province);
          },
          style: r.stockoutSku > 20 ? { background: "var(--error-container)" } : undefined,
        })}
        pagination={{
          recordCount: filtered.length,
          currentPage: page,
          pageSize,
          pageSizeOptions: [10, 20, 50],
          recordCountDisp:
            selectedRowKeys.length > 0
              ? `总记录数：${filtered.length} 已选中行数：${selectedRowKeys.length}`
              : `总记录数：${filtered.length}`,
          onPageChange: (p) => setPage(p),
          onPageSizeChange: (ps) => setPageSize(ps),
        }}
      />

      <DialogPro
        isOpen={!!mgrStore}
        title={`修改店长 — ${mgrStore ? mgrStore.storeName : ""}`}
        onClose={() => setMgrStore(null)}
        destroyOnClose
      >
        <form className="mgr-form" onSubmit={(e) => e.preventDefault()}>
          <label className="form-label required" htmlFor="mgr-name">
            新任店长
          </label>
          <div className="form-field">
            <TextField
              id="mgr-name"
              value={mgrName}
              placeholder="请输入新任店长姓名"
              style={{ width: "100%" }}
              onChange={(value) => {
                setMgrName(value);
                setMgrError("");
              }}
            />
            {mgrError && <div className="form-error">{mgrError}</div>}
          </div>
          <div className="mgr-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
            <Button text="取消" onClick={() => setMgrStore(null)} />
            <Button text="保存" status="primary" onClick={saveManager} />
          </div>
        </form>
      </DialogPro>

      <MessageDialogPro
        type="confirm"
        isOpen={!!confirm}
        title={confirm ? confirm.title : ""}
        content={confirm ? confirm.content : ""}
        onClose={() => setConfirm(null)}
        buttons={{
          ok: {
            text: confirm ? confirm.okText : "确认",
            status: "primary",
            onClick: () => confirm && confirm.onOk(),
          },
          cancel: {
            text: "取消",
            onClick: () => setConfirm(null),
          },
        }}
      />
    </SectionCard>
  );
}

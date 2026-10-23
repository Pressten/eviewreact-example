// Layer 4: ⑤⑥ 主表格 + 工具栏 + 批量操作栏 + 分页
// 排序外部受控（跨页全局排序），选择/分页状态由容器 order-console 持有
import { useMemo, useState } from "react";
import { IconPlusIcIctCellColumn, IconPlusIcIctECommerceDualDelivery, IconPlusIcPublicCheckmark, IconPlusIcPublicCloseCircle, IconPlusIcPublicDownload, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicMappinOnMap, IconPlusIcPublicNotes, IconPlusIcPublicPrinter, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Checkbox from "@nce/eview-react/Checkbox";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Dialog from "@nce/eview-react/Dialog";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Table from "@nce/eview-react/Table";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import Icon from "@/shared/Icon";
import { CATEGORY_STYLE, fmtMoney, maskPhone } from "../../mock/order.js";
import { OrderStatusTag } from "../../components/status-tag/index.jsx";
// 表单骨架 .fm 定义于 order-console/index.css（页面级共享）
import "./index.css";

// 跨页排序比较器
const COMPARE = {
  orderNo: (a, b) => a.orderNo.localeCompare(b.orderNo),
  receiver: (a, b) => a.receiver.localeCompare(b.receiver, "zh"),
  paidAmount: (a, b) => a.paidAmount - b.paidAmount,
  payMethod: (a, b) => a.payMethod.localeCompare(b.payMethod, "zh"),
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
};

const canShip = (o) => o.status === "pendingShipment";
const canCancel = (o) => o.status === "pendingPayment" || o.status === "pendingShipment";

// 可隐藏的数据列（订单号 / 实付金额 / 订单状态 / 操作 始终保留）
const OPTIONAL_COLS = [
  { key: "items", label: "商品摘要" },
  { key: "receiver", label: "客户" },
  { key: "payMethod", label: "支付方式" },
  { key: "logistics", label: "物流状态" },
  { key: "createdAt", label: "下单时间" },
];

export default function OrderTable({
  data,
  page,
  pageSize,
  sorter,
  selectedRowKeys,
  onPageChange,
  onSorterChange,
  onSelectionChange,
  onShipOrders,
  onCancelOrders,
  onViewOrder,
  onOpenLogistics,
  onExportOrder,
  onUpdateAddress,
  onUpdateRemark,
}) {
  // 修改地址弹窗（H5 表单骨架）
  const [addressTarget, setAddressTarget] = useState(null);
  const [addressForm, setAddressForm] = useState({ receiver: "", phone: "", address: "" });
  const [addressErrors, setAddressErrors] = useState({});
  // 备注弹窗
  const [remarkTarget, setRemarkTarget] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  // 工具栏：列显隐 + 刷新 loading
  const [hiddenCols, setHiddenCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [colMenuOpen, setColMenuOpen] = useState(false);
  // DivMessage 提示
  const [notice, setNotice] = useState(null);
  // MessageDialog 确认
  const [confirm, setConfirm] = useState(null);

  const selectedOrders = useMemo(
    () => data.filter((o) => selectedRowKeys.includes(o.orderNo)),
    [data, selectedRowKeys]
  );

  // 全局排序后切片分页
  const sortedData = useMemo(() => {
    const arr = [...data];
    if (sorter && sorter.order && COMPARE[sorter.field]) {
      const cmp = COMPARE[sorter.field];
      arr.sort((a, b) => (sorter.order === "ascend" ? cmp(a, b) : -cmp(a, b)));
    }
    return arr;
  }, [data, sorter]);

  const pageData = useMemo(
    () => sortedData.slice((page - 1) * pageSize, page * pageSize),
    [sortedData, page, pageSize]
  );

  // 行数据查找辅助：row.rawData 可能不含非列 key 字段，从源数组补齐
  const getRowData = (row) => {
    const r = row?.rawData;
    return pageData.find((d) => d.orderNo === r?.orderNo) || r;
  };

  // selectedRowKeys（订单号字符串）→ eview 行序号数组
  const checkedIndexes = useMemo(() => {
    return pageData
      .map((o, i) => (selectedRowKeys.includes(o.orderNo) ? i : -1))
      .filter((i) => i >= 0);
  }, [pageData, selectedRowKeys]);

  const handleRowCheck = (row, checkedRows) => {
    const currentPageKeys = pageData.map((o) => o.orderNo);
    const newKeys = checkedRows.map((i) => pageData[i]?.orderNo).filter(Boolean);
    const otherPageKeys = selectedRowKeys.filter((k) => !currentPageKeys.includes(k));
    onSelectionChange([...otherPageKeys, ...newKeys]);
  };

  const handleHeaderCheck = (checkedRows) => {
    const currentPageKeys = pageData.map((o) => o.orderNo);
    if (checkedRows.length > 0) {
      const otherPageKeys = selectedRowKeys.filter((k) => !currentPageKeys.includes(k));
      onSelectionChange([...otherPageKeys, ...currentPageKeys]);
    } else {
      const otherPageKeys = selectedRowKeys.filter((k) => !currentPageKeys.includes(k));
      onSelectionChange(otherPageKeys);
    }
  };

  const colSort = (field) => {
    if (!sorter || sorter.field !== field || !sorter.order) return undefined;
    return sorter.order === "ascend" ? "asc" : "desc";
  };

  // ---- 工具栏 ----
  const toggleCol = (key) => {
    setHiddenCols((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotice({ type: "success", text: `列表已刷新，当前共 ${sortedData.length} 单`, key: Date.now() });
    }, 600);
  };

  const handleExportList = () => {
    setNotice({ type: "success", text: `已导出 ${sortedData.length} 条订单明细（Excel）`, key: Date.now() });
  };

  // ---- 行内操作 ----
  const confirmShipOne = (r) => {
    setConfirm({
      content: `确认发货订单 ${r.orderNo}？`,
      detail: `收货人 ${r.receiver}，实付 ¥${fmtMoney(r.paidAmount)}。发货后订单进入「已发货」状态。`,
      okText: "确认发货",
      danger: false,
      onConfirm: () => {
        onShipOrders([r.orderNo]);
        setNotice({ type: "success", text: `订单 ${r.orderNo} 已发货，物流单已生成`, key: Date.now() });
      },
    });
  };

  const confirmCancelOne = (r) => {
    if (!canCancel(r)) {
      setNotice({ type: "warn", text: "当前订单状态不可取消", key: Date.now() });
      return;
    }
    setConfirm({
      content: `确认取消订单 ${r.orderNo}？`,
      detail: "取消后订单将关闭，占用库存自动回滚，已付款项原路退回。",
      okText: "确认取消",
      danger: true,
      onConfirm: () => {
        onCancelOrders([r.orderNo]);
        setNotice({ type: "success", text: `订单 ${r.orderNo} 已取消`, key: Date.now() });
      },
    });
  };

  const openAddress = (r) => {
    setAddressTarget(r);
    setAddressForm({ receiver: r.receiver, phone: r.phone, address: r.address });
    setAddressErrors({});
  };

  const saveAddress = () => {
    const errs = {};
    if (!addressForm.receiver.trim()) errs.receiver = "请输入收货人姓名";
    if (!/^1[3-9]\d{9}$/.test(addressForm.phone.trim())) errs.phone = "请输入 11 位有效手机号";
    if (!addressForm.address.trim()) errs.address = "请输入详细收货地址";
    setAddressErrors(errs);
    if (Object.keys(errs).length) return;
    onUpdateAddress(addressTarget.orderNo, {
      receiver: addressForm.receiver.trim(),
      phone: addressForm.phone.trim(),
      address: addressForm.address.trim(),
    });
    setNotice({ type: "success", text: `订单 ${addressTarget.orderNo} 收货地址已更新`, key: Date.now() });
    setAddressTarget(null);
  };

  const openRemark = (r) => {
    setRemarkTarget(r);
    setRemarkText(r.remark || "");
  };

  const saveRemark = () => {
    onUpdateRemark(remarkTarget.orderNo, remarkText.trim());
    setNotice({ type: "success", text: `订单 ${remarkTarget.orderNo} 备注已保存`, key: Date.now() });
    setRemarkTarget(null);
  };

  const handleMenu = (key, r) => {
    if (key === "detail") onViewOrder(r.orderNo);
    if (key === "logistics") onOpenLogistics(r);
    if (key === "address") openAddress(r);
    if (key === "cancel") confirmCancelOne(r);
    if (key === "export") onExportOrder(r.orderNo);
  };

  const renderOps = (r) => (
    <div className="ot-ops">
      <IconPlusIcIctECommerceDualDelivery
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className={canShip(r) ? "ot-op" : "ot-op ot-op-disabled"}
        title={canShip(r) ? "发货" : "仅待发货订单可发货"}
        onClick={canShip(r) ? () => confirmShipOne(r) : undefined}
      />
      <IconPlusIcPublicNotes
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className="ot-op"
        title="备注"
        onClick={() => openRemark(r)}
      />
      <PopUpMenu
        options={[
          { id: "detail", text: "查看详情", serialno: "detail", iconUrl: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { id: "logistics", text: "物流轨迹", serialno: "logistics", iconUrl: <IconPlusIcIctECommerceDualDelivery iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { id: "address", text: "修改地址", serialno: "address", iconUrl: <IconPlusIcPublicMappinOnMap iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { id: "cancel", text: "取消订单", serialno: "cancel", iconUrl: <IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { id: "export", text: "导出该单", serialno: "export", iconUrl: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} /> },
        ]}
        onClick={(evt) => handleMenu(evt.value, r)}
      >
        <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} className="ot-op" />
      </PopUpMenu>
    </div>
  );

  const columns = [
    {
      title: "订单号",
      key: "orderNo",
      width: 180,
      allowSort: true,
      sort: colSort("orderNo"),
      render: (cell, _rowData, _options, row) => {
        const r = getRowData(row);
        return (
          <span className="ot-no">
            <a className="ot-link" onClick={() => onViewOrder(r?.orderNo)}>
              {cell}
            </a>
            {r?.remark && (
              <IconPlusIcPublicNotes
                iconSize="0.75rem"
                iconColor={['currentcolor']}
                className="ot-flag"
                title={`备注：${r.remark}`}
              />
            )}
          </span>
        );
      },
    },
    {
      title: "商品摘要",
      key: "items",
      width: 268,
      allowSort: false,
      render: (items, _rowData, _options, row) => {
        const r = getRowData(row);
        const first = items[0];
        const cat = CATEGORY_STYLE[first.cat];
        const totalQty = items.reduce((s, x) => s + x.qty, 0);
        const pop = (
          <div className="ot-pop">
            {items.map((x) => (
              <div className="ot-pop-row" key={x.name}>
                <span className="ot-pop-name">
                  {x.name}（{x.spec}）
                </span>
                <span className="ot-pop-num">
                  ×{x.qty}　¥{fmtMoney(x.price * x.qty)}
                </span>
              </div>
            ))}
            <div className="ot-pop-total">
              共 {totalQty} 件商品 · 实付 ¥{fmtMoney(r?.paidAmount)}
            </div>
          </div>
        );
        return (
          <TipBox content={pop} direction="topLeft" type="simple">
            <div className="ot-goods">
              <span className="ot-thumb" style={{ background: cat.bg, color: cat.text }}>
                <Icon name={cat.icon} size="0.875rem" />
              </span>
              <span className="ot-goods-info">
                <span className="ot-goods-name">{first.name}</span>
                <span className="ot-goods-sub">
                  ×{first.qty}
                  {items.length > 1 ? ` 等 ${items.length} 种共 ${totalQty} 件` : ` · ${first.spec}`}
                </span>
              </span>
            </div>
          </TipBox>
        );
      },
    },
    {
      title: "客户",
      key: "receiver",
      width: 128,
      allowSort: true,
      sort: colSort("receiver"),
      render: (cell, _rowData, _options, row) => {
        const r = getRowData(row);
        return (
          <div className="ot-cust">
            <span className="ot-cust-name">{cell}</span>
            <span className="ot-cust-phone">{maskPhone(r?.phone)}</span>
          </div>
        );
      },
    },
    {
      title: "实付金额",
      key: "paidAmount",
      width: 112,
      align: "right",
      allowSort: true,
      sort: colSort("paidAmount"),
      render: (cell) => <span className="ot-amount">¥{fmtMoney(cell)}</span>,
    },
    {
      title: "支付方式",
      key: "payMethod",
      width: 100,
      allowSort: true,
      sort: colSort("payMethod"),
    },
    {
      title: "物流状态",
      key: "logistics",
      width: 96,
      allowSort: false,
      render: (cell, _rowData, _options, row) => {
        const r = getRowData(row);
        return (
          <a
            className={cell === "异常" ? "ot-logi-link ot-logi-error" : "ot-logi-link"}
            onClick={() => onOpenLogistics(r)}
            title="查看物流轨迹"
          >
            {cell}
          </a>
        );
      },
    },
    {
      title: "订单状态",
      key: "status",
      width: 112,
      allowSort: false,
      render: (cell, _rowData, _options, row) => {
        const r = getRowData(row);
        return <OrderStatusTag status={cell} timeout={r?.shippingTimeout} />;
      },
    },
    {
      title: "下单时间",
      key: "createdAt",
      width: 150,
      allowSort: true,
      sort: colSort("createdAt"),
      render: (cell) => <span className="ot-time">{cell}</span>,
    },
    {
      title: "操作",
      key: "ops",
      width: 132,
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const r = getRowData(row);
        return renderOps(r);
      },
    },
  ].filter((c) => !hiddenCols.includes(c.key));

  // ---- 批量操作 ----
  const handleBatchShip = () => {
    const shippable = selectedOrders.filter(canShip);
    if (!shippable.length) {
      setNotice({ type: "warn", text: "选中订单中没有「待发货」订单，无法批量发货", key: Date.now() });
      return;
    }
    setConfirm({
      content: `确认批量发货 ${shippable.length} 个订单？`,
      detail: "发货后订单状态变更为「已发货」，物流单号将同步推送至买家。",
      okText: "确认发货",
      danger: false,
      onConfirm: () => {
        onShipOrders(shippable.map((o) => o.orderNo));
        setNotice({ type: "success", text: `已批量发货 ${shippable.length} 单，物流单已生成`, key: Date.now() });
        onSelectionChange([]);
      },
    });
  };

  const handleBatchCancel = () => {
    const cancellable = selectedOrders.filter(canCancel);
    if (!cancellable.length) {
      setNotice({ type: "warn", text: "选中订单中没有可取消的订单（仅待付款/待发货可取消）", key: Date.now() });
      return;
    }
    const skipped = selectedOrders.length - cancellable.length;
    setConfirm({
      content: `确认批量取消 ${cancellable.length} 个订单？`,
      detail: `取消后订单将关闭、库存回滚、款项原路退回。${
        skipped ? `另有 ${skipped} 单当前状态不可取消，将自动跳过。` : ""
      }`,
      okText: "确认取消",
      danger: true,
      onConfirm: () => {
        onCancelOrders(cancellable.map((o) => o.orderNo));
        setNotice({ type: "success", text: `已批量取消 ${cancellable.length} 单${skipped ? `，跳过 ${skipped} 单` : ""}`, key: Date.now() });
        onSelectionChange([]);
      },
    });
  };

  const handleBatchPrint = () => {
    setNotice({ type: "success", text: `已将 ${selectedOrders.length} 个订单加入打印队列`, key: Date.now() });
    onSelectionChange([]);
  };

  return (
    <div className="order-table">
      {notice && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
      <div className="ot-toolbar">
        <span className="ot-result">
          共 <b>{sortedData.length}</b> 单
          {selectedRowKeys.length > 0 && (
            <span className="ot-result-sel"> · 已选 {selectedRowKeys.length} 单</span>
          )}
        </span>
        <div className="ot-tools">
          <IconPlusIcPublicRefreshClockwise
            iconSize="0.875rem"
            iconColor={['currentcolor']}
            className={loading ? "ot-tool ot-tool-spin" : "ot-tool"}
            title="刷新列表"
            onClick={handleRefresh}
          />
          <div className="ot-col-wrapper">
            <IconPlusIcIctCellColumn
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              className="ot-tool"
              title="列显示设置"
              onClick={() => setColMenuOpen(!colMenuOpen)}
            />
            {colMenuOpen && (
              <>
                <div className="ot-col-backdrop" onClick={() => setColMenuOpen(false)} />
                <div className="ot-col-menu">
                  {OPTIONAL_COLS.map((c) => (
                    <Checkbox
                      key={c.key}
                      value={c.key}
                      checked={!hiddenCols.includes(c.key)}
                      onChange={() => toggleCol(c.key)}
                      label={c.label}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <Button
            size="small"
            text="导出"
            leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />}
            onClick={handleExportList}
          />
        </div>
      </div>
      {selectedOrders.length > 0 && (
        <div className="ot-batch">
          <div className="ot-batch-left">
            <IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} />
            <span>
              已选 <b className="ot-batch-n">{selectedOrders.length}</b> 单
            </span>
            <a className="ot-batch-clear" onClick={() => onSelectionChange([])}>
              取消选择
            </a>
          </div>
          <div className="ot-batch-actions">
            <Button
              size="small"
              status="primary"
              text="批量发货"
              leftIcon={<IconPlusIcIctECommerceDualDelivery iconSize="0.875rem" iconColor={['currentcolor']} />}
              onClick={handleBatchShip}
            />
            <Button
              size="small"
              text="批量打印"
              leftIcon={<IconPlusIcPublicPrinter iconSize="0.875rem" iconColor={['currentcolor']} />}
              onClick={handleBatchPrint}
            />
            <Button
              size="small"
              status="risk"
              text="批量取消"
              leftIcon={<IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />}
              onClick={handleBatchCancel}
            />
          </div>
        </div>
      )}
      <Table
        className="ot-table"
        columns={columns}
        dataset={pageData}
        enableLoading={loading}
        emptyTableMsg="暂无订单"
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={handleRowCheck}
        onHeaderCheck={handleHeaderCheck}
        disableEviewSort
        onColumnSort={(sortColumn, sortType) => {
          if (sortType && sortType !== "origin" && sortColumn) {
            onSorterChange({ field: sortColumn, order: sortType === "asc" ? "ascend" : "descend" });
          } else {
            onSorterChange({});
          }
        }}
        enablePagination
        pagingProps={{
          currentPage: page,
          pageSize: pageSize,
          recordCount: sortedData.length,
          pageSizeOptions: [10, 20, 50],
          onPageSizeChange: (size) => onPageChange(1, size),
        }}
        onPageChange={(currentPage) => onPageChange(currentPage, pageSize)}
      />

      {/* 修改地址弹窗 — H5 表单骨架（标签居上 + 必填星号 + 控件下方校验文案） */}
      <Dialog
        isOpen={!!addressTarget}
        title={addressTarget ? `修改收货地址 · ${addressTarget.orderNo}` : ""}
        onClose={() => setAddressTarget(null)}
        size={[480, "auto"]}
        buttons={[
          { text: "取消", onClick: () => setAddressTarget(null) },
          { text: "保存地址", status: "primary", onClick: saveAddress },
        ]}
      >
        <form
          className="fm"
          onSubmit={(e) => {
            e.preventDefault();
            saveAddress();
          }}
        >
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-receiver">
              收货人
            </label>
            <TextField
              id="fm-receiver"
              value={addressForm.receiver}
              placeholder="请输入收货人姓名"
              onChange={(value) => {
                setAddressForm({ ...addressForm, receiver: value });
                if (addressErrors.receiver) setAddressErrors({ ...addressErrors, receiver: "" });
              }}
            />
            {addressErrors.receiver && <div className="fm-error">{addressErrors.receiver}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-phone">
              手机号
            </label>
            <TextField
              id="fm-phone"
              value={addressForm.phone}
              placeholder="请输入 11 位手机号"
              onChange={(value) => {
                setAddressForm({ ...addressForm, phone: value });
                if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: "" });
              }}
            />
            {addressErrors.phone && <div className="fm-error">{addressErrors.phone}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="fm-address">
              详细地址
            </label>
            <TextField
              id="fm-address"
              value={addressForm.address}
              placeholder="省 / 市 / 区 + 街道门牌"
              onChange={(value) => {
                setAddressForm({ ...addressForm, address: value });
                if (addressErrors.address) setAddressErrors({ ...addressErrors, address: "" });
              }}
            />
            {addressErrors.address && <div className="fm-error">{addressErrors.address}</div>}
          </div>
        </form>
      </Dialog>

      {/* 备注弹窗 */}
      <Dialog
        isOpen={!!remarkTarget}
        title={remarkTarget ? `订单备注 · ${remarkTarget.orderNo}` : ""}
        onClose={() => setRemarkTarget(null)}
        size={[480, "auto"]}
        buttons={[
          { text: "取消", onClick: () => setRemarkTarget(null) },
          { text: "保存备注", status: "primary", onClick: saveRemark },
        ]}
      >
        <form
          className="fm"
          onSubmit={(e) => {
            e.preventDefault();
            saveRemark();
          }}
        >
          <div className="fm-field">
            <label className="fm-label" htmlFor="fm-remark">
              备注内容
            </label>
            <TextArea
              id="fm-remark"
              rows={3}
              maxLength={80}
              value={remarkText}
              placeholder="输入发货 / 客服备注，保存后在详情中可见"
              onChange={(targetValue) => setRemarkText(targetValue)}
            />
          </div>
        </form>
      </Dialog>

      {/* 确认弹窗（发货 / 取消 单个 + 批量） */}
      <MessageDialog
        type={confirm?.danger ? "risk" : "confirm"}
        isOpen={!!confirm}
        content={confirm?.content}
        detail={confirm?.detail}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { text: "再想想", onClick: () => setConfirm(null) },
          ok: {
            text: confirm?.okText || "确定",
            focused: true,
            onClick: () => {
              if (confirm?.onConfirm) confirm.onConfirm();
              setConfirm(null);
            },
          },
        }}
      />
    </div>
  );
}

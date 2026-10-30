import { useState } from "react";
import { IconPlusIcPublicBuilding, IconPlusIcPublicCreditcard, IconPlusIcPublicDownload, IconPlusIcPublicInfo } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionBlock from "../../components/section-block/index.jsx";
import { payment, invoices, invoiceInfo } from "../../mock/data.js";
import "./index.css";

const TYPE_MAP = {
  special: { color: "blue", text: "专票" },
  general: { color: "default", text: "普票" },
};
const STATUS_MAP = {
  issued: { color: "success", text: "已开具" },
  shipping: { color: "processing", text: "寄送中" },
  void: { color: "error", text: "已作废" },
};

function formatMoney(n) {
  return "￥" + Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PaymentInvoice() {
  // DivMessage 渲染式通知（替代 antd 命令式 message）
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const closeNotice = () => setNotice(null);

  const columns = [
    { title: "发票号", key: "invoiceNo", allowSort: false },
    {
      title: "发票类型",
      key: "type",
      allowSort: false,
      render: (v) => <Tag color={TYPE_MAP[v].color}>{TYPE_MAP[v].text}</Tag>,
    },
    {
      title: "金额",
      key: "amount",
      align: "right",
      allowSort: true,
      render: (v) => formatMoney(v),
    },
    {
      title: "开具日期",
      key: "issueDate",
      allowSort: true,
    },
    {
      title: "状态",
      key: "status",
      allowSort: false,
      render: (v) => <Tag color={STATUS_MAP[v].color}>{STATUS_MAP[v].text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <IconPlusIcPublicDownload
            iconSize="1rem"
            iconColor={['currentcolor']}
            className="cb-pi-download"
            title="下载发票"
            onClick={() =>
              record?.status === "void"
                ? notify("warn", "该发票已作废，无法下载")
                : notify("success", `发票 ${record?.invoiceNo} 已开始下载`)
            }
          />
        );
      },
    },
  ];

  const infoContent = (
    <div className="cb-pi-info">
      <div className="cb-pi-info-title">开票信息（完整抬头）</div>
      <div className="cb-pi-info-row"><span>名称</span><strong>{invoiceInfo.title}</strong></div>
      <div className="cb-pi-info-row"><span>税号</span><strong>{invoiceInfo.taxNo}</strong></div>
      <div className="cb-pi-info-row"><span>地址电话</span><strong>{invoiceInfo.address} · {invoiceInfo.phone}</strong></div>
      <div className="cb-pi-info-row"><span>开户行</span><strong>{invoiceInfo.bank}</strong></div>
      <div className="cb-pi-info-row"><span>账号</span><strong>{invoiceInfo.account}</strong></div>
      <div className="cb-pi-info-tip">如需修改开票信息，请联系客户经理审核后更新</div>
    </div>
  );

  return (
    <SectionBlock
      id="payment-invoice"
      title="付款与发票"
      icon={<IconPlusIcPublicCreditcard iconSize="1.25rem" iconColor={['#0067D1']} />}
      extra={
        <TipBox
          content={infoContent}
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose={false}
          isClosable
        >
          <span className="cb-pi-edit-trigger">
            <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
            查看 / 编辑开票信息
          </span>
        </TipBox>
      }
    >
      <div className="cb-pi-pay-card">
        <div className="cb-pi-pay-block">
          <div className="cb-pi-pay-label">企业对公账户</div>
          <div className="cb-pi-pay-value">
            <IconPlusIcPublicBuilding iconSize="1rem" iconColor={['#0067D1']} />
            <span>{payment.accountHolder}</span>
            <span className="cb-pi-pay-sep">|</span>
            <span>{payment.bank}</span>
            <span className="cb-pi-pay-sep">|</span>
            <span className="cb-pi-pay-acct">{payment.account}</span>
          </div>
        </div>
        <div className="cb-pi-pay-block">
          <div className="cb-pi-pay-label">默认发票类型</div>
          <div className="cb-pi-pay-value">
            <Tag color="blue">{payment.defaultInvoiceType}</Tag>
            <span className="cb-pi-pay-note">已累计开具 6 张发票</span>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataset={invoices}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        width="unset"
      />

      {notice ? (
        <div className="cb-notice-floating">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={closeNotice}
          />
        </div>
      ) : null}
    </SectionBlock>
  );
}

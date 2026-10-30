import { Table, Tag, Popover, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
  const columns = [
    { title: "发票号", dataIndex: "invoiceNo", key: "invoiceNo" },
    {
      title: "发票类型",
      dataIndex: "type",
      key: "type",
      render: (v) => <Tag color={TYPE_MAP[v].color}>{TYPE_MAP[v].text}</Tag>,
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (v) => formatMoney(v),
    },
    {
      title: "开具日期",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => a.issueDate.localeCompare(b.issueDate),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (v) => <Tag color={STATUS_MAP[v].color}>{STATUS_MAP[v].text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Icon
          name="download"
          size="1rem"
          title="下载发票"
          className="cb-pi-download"
          onClick={() =>
            record.status === "void"
              ? message.warning("该发票已作废，无法下载")
              : message.success(`发票 ${record.invoiceNo} 已开始下载`)
          }
        />
      ),
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
      icon={<Icon name="credit-card" size="1.25rem" color="#0067D1" />}
      extra={
        <Popover content={infoContent} trigger="click" placement="bottomRight" title={null}>
          <span className="cb-pi-edit-trigger">
            <Icon name="contact" size="0.875rem" />
            查看 / 编辑开票信息
          </span>
        </Popover>
      }
    >
      <div className="cb-pi-pay-card">
        <div className="cb-pi-pay-block">
          <div className="cb-pi-pay-label">企业对公账户</div>
          <div className="cb-pi-pay-value">
            <Icon name="landmark" size="1rem" color="#0067D1" />
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
        size="large"
        rowKey="key"
        columns={columns}
        dataSource={invoices}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={false}
        scroll={{ x: 760 }}
      />
    </SectionBlock>
  );
}

// Layer 4: 错误码章节 — 可搜索的错误码速查表（antd Table：左侧展开指示 + 排序 + 筛选）
import { useState, useMemo } from "react";
import { Input, Table } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { ERROR_CODES } from "../../mock/error-codes.js";
import CodeBlock from "../../components/code-block/index.jsx";
import "./index.css";

// 生成该错误码的响应体示例
function buildErrorSample(item) {
  const body = {
    code: Number(item.code),
    message: item.meaning,
  };
  if (item.code === "40001") {
    body.details = [{ field: "order_id", issue: "required" }];
  }
  if (item.code === "42901") {
    body.retry_after = 3;
  }
  body.trace_id = "9f2c-4a71-bd3e";
  return JSON.stringify(body, null, 2);
}

// HTTP 状态取值有限，按规范启用筛选
const HTTP_FILTERS = ["400", "401", "403", "404", "429", "500", "504"].map((value) => ({
  text: value,
  value,
}));

export default function SectionErrors() {
  const [keyword, setKeyword] = useState("");
  // 展开的错误码行（点击行或左侧展开图标切换，支持多行展开）
  const [expandedKeys, setExpandedKeys] = useState([]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return ERROR_CODES;
    return ERROR_CODES.filter(
      (item) =>
        item.code.toLowerCase().includes(kw) ||
        item.http.includes(kw) ||
        item.meaning.toLowerCase().includes(kw) ||
        item.suggestion.toLowerCase().includes(kw)
    );
  }, [keyword]);

  const columns = [
    {
      title: "错误码",
      dataIndex: "code",
      key: "code",
      width: 120,
      sorter: (a, b) => Number(a.code) - Number(b.code),
      render: (code) => <span className="err-code">{code}</span>,
    },
    {
      title: "HTTP",
      dataIndex: "http",
      key: "http",
      width: 120,
      sorter: (a, b) => Number(a.http) - Number(b.http),
      filters: HTTP_FILTERS,
      onFilter: (value, record) => record.http === value,
      render: (http) => <span className="err-http">{http}</span>,
    },
    {
      title: "含义",
      dataIndex: "meaning",
      key: "meaning",
      width: 200,
      sorter: (a, b) => a.meaning.localeCompare(b.meaning, "zh-Hans-CN"),
      render: (text) => <span className="err-meaning">{text}</span>,
    },
    {
      title: "处理建议",
      dataIndex: "suggestion",
      key: "suggestion",
      render: (text) => <span className="err-suggestion">{text}</span>,
    },
  ];

  return (
    <section id="errors" className="doc-section">
      <div className="section-head">
        <span className="section-no">03</span>
        <h2 className="section-title">错误码</h2>
      </div>
      <p className="section-lead">
        业务错误通过响应体中的 code 字段返回（HTTP 状态码同步语义化）。支持按错误码、
        含义或处理建议即时搜索；点击行可在左侧展开错误响应示例。
      </p>

      <div className="err-toolbar">
        <Input
          className="err-search"
          placeholder="搜索错误码、含义或处理建议"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
          suffix={<Icon name="search" size="0.875rem" className="err-search-icon" />}
        />
        <span className="err-count">
          共 {filtered.length} 条
          {keyword.trim() && (
            <a className="err-clear" onClick={() => setKeyword("")}>
              <Icon name="x" size="0.75rem" />
              清除
            </a>
          )}
        </span>
        <span className="err-expand-hint">
          <Icon name="chevron-down" size="0.75rem" />
          点击行查看响应示例
        </span>
      </div>

      <Table
        className="err-table"
        rowKey="code"
        columns={columns}
        dataSource={filtered}
        pagination={false}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        expandable={{
          // 展开指示：箭头符号（收起 chevron-down / 展开 chevron-up）
          expandIcon: ({ expanded, onExpand, record }) => (
            <Icon
              name={expanded ? "chevron-up" : "chevron-down"}
              size="0.875rem"
              className="err-expand-icon"
              onClick={(e) => {
                e.stopPropagation();
                onExpand(record, e);
              }}
            />
          ),
          expandedRowRender: (record) => (
            <div className="err-detail">
              <div className="err-detail-label">HTTP {record.http} · 响应体示例</div>
              <CodeBlock lang="json" code={buildErrorSample(record)} />
            </div>
          ),
          expandRowByClick: true,
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            setExpandedKeys((prev) =>
              expanded
                ? [...prev, record.code]
                : prev.filter((key) => key !== record.code)
            );
          },
        }}
      />
    </section>
  );
}

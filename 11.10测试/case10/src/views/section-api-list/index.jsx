// Layer 4: 接口列表章节 — 方法筛选（即时生效）+ 关键词过滤 + 分页（每页 8 条）+ 详情 Drawer + 目录树定位联动
import { useState, useEffect, useMemo } from "react";
import { Pagination, Empty } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { getStatusInVersion, isNewInVersion } from "../../mock/api-registry.js";
import MethodTag from "../../components/method-tag/index.jsx";
import StatusTag, { NewTag } from "../../components/status-tag/index.jsx";
import "./index.css";

const METHOD_CHIPS = [
  { key: "ALL", label: "全部" },
  { key: "GET", label: "GET" },
  { key: "POST", label: "POST" },
  { key: "PUT", label: "PUT" },
  { key: "DELETE", label: "DELETE" },
];

export default function SectionApiList() {
  const {
    version,
    versionApis,
    methodFilter,
    setMethodFilter,
    apiKeyword,
    setApiKeyword,
    selectedApiId,
    openApiDrawer,
    focusApiId,
    clearFocusApi,
  } = useApp();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // 关键词匹配：名称 / 路径 / 描述
  const matchesKeyword = (api, kw) =>
    !kw ||
    api.name.toLowerCase().includes(kw) ||
    api.path.toLowerCase().includes(kw) ||
    api.description.toLowerCase().includes(kw);

  const keyword = apiKeyword.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      versionApis.filter(
        (api) =>
          (methodFilter === "ALL" || api.method === methodFilter) &&
          matchesKeyword(api, keyword)
      ),
    [versionApis, methodFilter, keyword]
  );

  // 筛选 / 关键词 / 版本变化时回到第 1 页
  useEffect(() => {
    setPage(1);
  }, [methodFilter, keyword, version]);

  // 目录树「定位到接口」信号：翻到接口所在页并滚动到列表
  useEffect(() => {
    if (!focusApiId) return undefined;
    const index = versionApis.findIndex((api) => api.apiId === focusApiId);
    if (index >= 0) {
      setPage(Math.floor(index / pageSize) + 1);
      const target = document.getElementById("apis");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    clearFocusApi();
    return undefined;
  }, [focusApiId, versionApis, pageSize, clearFocusApi]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const methodCounts = useMemo(() => {
    const counts = { ALL: versionApis.length };
    ["GET", "POST", "PUT", "DELETE"].forEach((m) => {
      counts[m] = versionApis.filter((api) => api.method === m).length;
    });
    return counts;
  }, [versionApis]);

  return (
    <section id="apis" className="doc-section">
      <div className="section-head">
        <span className="section-no">04</span>
        <h2 className="section-title">接口列表</h2>
        <span className="api-total">共 {filtered.length} 个接口</span>
      </div>

      {/* 方法筛选：即时生效 */}
      <div className="api-toolbar">
        <div className="method-filter">
          {METHOD_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={`method-chip${methodFilter === chip.key ? " active" : ""}`}
              onClick={() => setMethodFilter(chip.key)}
            >
              {chip.key !== "ALL" && (
                <span className={`chip-dot cd-${chip.key.toLowerCase()}`} />
              )}
              {chip.label}
              <span className="chip-count">{methodCounts[chip.key]}</span>
            </button>
          ))}
        </div>
        {apiKeyword && (
          <div className="kw-bar">
            「{apiKeyword}」的搜索结果 {filtered.length} 条
            <a className="kw-clear" onClick={() => setApiKeyword("")}>
              <Icon name="x" size="0.75rem" />
              清除
            </a>
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <>
          <table className="api-table">
            <thead>
              <tr>
                <th className="col-name">接口名称</th>
                <th className="col-method">方法</th>
                <th className="col-path">路径</th>
                <th>描述</th>
                <th className="col-time">更新时间</th>
                <th className="col-status">状态</th>
                <th className="col-op">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((api) => {
                const status = getStatusInVersion(api, version);
                const isNew = isNewInVersion(api, version);
                const rowClass = [
                  status === "deprecating" ? "row-deprecating" : "",
                  status === "sunset" ? "row-sunset" : "",
                  api.apiId === selectedApiId ? "row-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <tr key={api.apiId} className={rowClass}>
                    <td>
                      <a
                        className="api-name-link"
                        onClick={() => openApiDrawer(api.apiId)}
                        title="点击查看接口详情与在线调试"
                      >
                        {api.name}
                      </a>
                      {isNew && <NewTag />}
                    </td>
                    <td>
                      <MethodTag method={api.method} />
                    </td>
                    <td>
                      <span className="api-path">{api.path}</span>
                    </td>
                    <td className="api-desc">{api.description}</td>
                    <td className="api-time">{api.updatedAt}</td>
                    <td>
                      <StatusTag status={status} />
                    </td>
                    <td className="api-op">
                      <Icon
                        name="play"
                        size="0.875rem"
                        className="api-op-icon"
                        title="打开接口详情与在线调试"
                        onClick={() => openApiDrawer(api.apiId)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="api-pagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filtered.length}
              showTotal={(total, range) =>
                `总记录数：${total}`
              }
              showSizeChanger
              showQuickJumper={{ goButton: "跳转" }}
              pageSizeOptions={["8", "16", "32"]}
              onChange={(nextPage, nextSize) => {
                setPage(nextPage);
                setPageSize(nextSize);
              }}
            />
          </div>
        </>
      ) : (
        <div className="api-empty">
          <Empty description={`未找到与「${apiKeyword}」匹配的接口`} />
          <a className="api-empty-clear" onClick={() => setApiKeyword("")}>
            清除关键词
          </a>
        </div>
      )}
    </section>
  );
}

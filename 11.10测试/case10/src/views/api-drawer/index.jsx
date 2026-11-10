// Layer 4: 接口详情 Drawer — 请求参数 / 响应示例 / 在线调试（Tabs 切换）
import { useState, useEffect } from "react";
import { Drawer, Tabs, Segmented, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import {
  getStatusInVersion,
  isNewInVersion,
  getGroupPath,
} from "../../mock/api-registry.js";
import { getRequestParams, getResponseSample, buildCurl, simulateDebugResponse } from "../../mock/api-details.js";
import MethodTag from "../../components/method-tag/index.jsx";
import StatusTag, { NewTag } from "../../components/status-tag/index.jsx";
import CodeBlock from "../../components/code-block/index.jsx";
import "./index.css";

function ParamsTab({ api }) {
  const params = getRequestParams(api);
  const pathParams = params.filter((item) => item.in === "path");
  const restParams = params.filter((item) => item.in !== "path");

  if (params.length === 0) {
    return (
      <div className="drawer-empty-hint">
        该接口无需额外参数{api.method === "GET" ? "，直接携带令牌调用即可" : ""}。
      </div>
    );
  }

  return (
    <div className="params-panel">
      {pathParams.length > 0 && (
        <div className="params-group">
          <div className="params-group-title">路径参数</div>
          <table className="params-table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>必填</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {pathParams.map((item) => (
                <tr key={item.name}>
                  <td className="param-name">{item.name}</td>
                  <td className="param-type">{item.type}</td>
                  <td>
                    <span className="param-required">必填</span>
                  </td>
                  <td className="param-desc">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {restParams.length > 0 && (
        <div className="params-group">
          <div className="params-group-title">
            {restParams[0].in === "query" ? "查询参数（Query）" : "请求体（Body · JSON）"}
          </div>
          <table className="params-table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>必填</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {restParams.map((item) => (
                <tr key={item.name}>
                  <td className="param-name">{item.name}</td>
                  <td className="param-type">{item.type}</td>
                  <td>
                    {item.required ? (
                      <span className="param-required">必填</span>
                    ) : (
                      <span className="param-optional">可选</span>
                    )}
                  </td>
                  <td className="param-desc">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DebugTab({ api, version }) {
  const [env, setEnv] = useState("sandbox");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const sendRequest = () => {
    setSending(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateDebugResponse(api));
      setSending(false);
    }, 700 + Math.floor(Math.random() * 400));
  };

  return (
    <div className="debug-panel">
      <div className="debug-env-row">
        <span className="debug-env-label">调试环境</span>
        <Segmented
          value={env}
          onChange={(value) => setEnv(value)}
          options={[
            { value: "sandbox", label: "沙箱" },
            { value: "production", label: "生产" },
          ]}
        />
        {env === "production" && (
          <span className="debug-env-warn">
            <Icon name="triangle-alert" size="0.75rem" />
            生产环境将产生真实数据与真实扣款
          </span>
        )}
      </div>

      <Button
        type="primary"
        className="send-btn"
        loading={sending}
        onClick={sendRequest}
        icon={!sending ? <Icon name="play" size="0.875rem" /> : undefined}
      >
        {sending ? "请求发送中…" : "发送请求"}
      </Button>

      {result && (
        <div className={`debug-result${result.ok ? "" : " debug-result-error"}`}>
          <div className="result-head">
            <span className="result-status">
              {result.ok ? "HTTP 200 · OK" : `HTTP ${result.httpStatus} · ${result.message}`}
            </span>
            <span className="result-meta">
              {result.durationMs}ms · {result.requestId}
            </span>
          </div>
          {!result.ok && (
            <div className="result-headers">
              {Object.entries(result.headers).map(([key, value]) => (
                <span key={key} className="result-header-item">
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
          <CodeBlock lang="json" code={result.body} />
          {!result.ok && (
            <div className="result-hint">
              <Icon name="info" size="0.875rem" />
              演示环境会随机返回错误响应，帮助你在接入阶段验证错误处理分支。
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiDrawer() {
  const { selectedApi, selectedApiId, version, drawerOpen, closeApiDrawer } = useApp();

  // 切换接口后重置调试状态由 DebugTab 自身卸载完成（destroyOnClose）
  const drawerTitle = selectedApi ? (
    <div className="drawer-title">
      <MethodTag method={selectedApi.method} />
      <span className="drawer-title-path">{selectedApi.path}</span>
    </div>
  ) : null;

  const tabItems = selectedApi
    ? [
        {
          key: "params",
          label: "请求参数",
          children: <ParamsTab api={selectedApi} />,
        },
        {
          key: "response",
          label: "响应示例",
          children: (
            <div className="response-panel">
              <p className="response-lead">
                统一信封结构：code 为 0 表示成功，data 为业务数据，trace_id 用于问题排查。
              </p>
              <CodeBlock lang="json" code={getResponseSample(selectedApi)} />
            </div>
          ),
        },
        {
          key: "debug",
          label: "在线调试",
          children: <DebugTab api={selectedApi} version={version} />,
        },
      ]
    : [];

  return (
    <Drawer
      open={drawerOpen && Boolean(selectedApi)}
      onClose={closeApiDrawer}
      width={720}
      placement="right"
      title={drawerTitle}
      destroyOnClose
      className="api-detail-drawer"
    >
      {selectedApi && (
        <div className="drawer-body">
          {/* 概要信息 */}
          <div className="drawer-brief">
            <div className="brief-head">
              <span className="brief-name">{selectedApi.name}</span>
              {isNewInVersion(selectedApi, version) && <NewTag />}
              <StatusTag status={getStatusInVersion(selectedApi, version)} />
            </div>
            <p className="brief-desc">{selectedApi.description}</p>
            <dl className="brief-meta">
              <div className="meta-row">
                <dt>所属分组</dt>
                <dd>
                  {getGroupPath(selectedApi).groupName} / {getGroupPath(selectedApi).subgroupName}
                </dd>
              </div>
              <div className="meta-row">
                <dt>引入版本</dt>
                <dd>{selectedApi.since}</dd>
              </div>
              <div className="meta-row">
                <dt>HMAC 签名</dt>
                <dd className={selectedApi.requiresHmac ? "meta-hmac-required" : "meta-hmac-optional"}>
                  {selectedApi.requiresHmac ? "需要" : "不需要"}
                </dd>
              </div>
              <div className="meta-row">
                <dt>权限点</dt>
                <dd className="brief-scopes">{selectedApi.scopes.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <Tabs items={tabItems} defaultActiveKey="params" className="drawer-tabs" />

          <div className="drawer-curl">
            <div className="drawer-curl-label">请求示例（{version}）</div>
            <CodeBlock lang="bash" code={buildCurl(selectedApi, version)} />
          </div>
        </div>
      )}
    </Drawer>
  );
}

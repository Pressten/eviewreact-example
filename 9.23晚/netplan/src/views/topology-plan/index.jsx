import { useRef, useState } from "react";
import { Button, Segmented, Form, Input, Select, Radio } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import NoticeBar from "../../components/notice-bar/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  planModes,
  topologyTemplates,
  siteScales,
  deviceForms,
  uplinkTypes,
  templateFile,
  uploadHint,
  managementModes,
  importedFiles,
} from "../../mock/topology.js";
import "./index.css";

// Layer 4-1: 经典配置规划（系统模板自动生成）
function ClassicConfig() {
  return (
    <div className="plan-block">
      <NoticeBar
        type="info"
        title="经典配置规划按系统内置模板生成整网结构"
        desc="选择模板与站点规模后，系统自动生成拓扑结构、设备连接关系与链路配置，生成结果可在「自定义规划」中继续微调。"
      />
      <Form layout="vertical" className="plan-form" requiredMark={false}>
        <Form.Item label="规划名称">
          <Input placeholder="请输入规划名称" defaultValue="2026 年总部园区整网规划" />
        </Form.Item>
        <Form.Item label="拓扑模板">
          <Select options={topologyTemplates} defaultValue="dual-core" />
        </Form.Item>
        <Form.Item label="站点规模">
          <Select options={siteScales} defaultValue="medium" />
        </Form.Item>
        <Form.Item label="核心设备形态">
          <Select options={deviceForms} defaultValue="chassis" />
        </Form.Item>
        <Form.Item label="出口链路类型" className="plan-form-wide">
          <Radio.Group options={uplinkTypes} defaultValue="fiber" />
        </Form.Item>
      </Form>
    </div>
  );
}

// Layer 4-2: 自定义规划（下载模版 → 导入文件 → 组网管理方式）
function CustomConfig() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState(importedFiles);
  const [manageMode, setManageMode] = useState("centralized");
  const [dragging, setDragging] = useState(false);

  function appendFiles(fileList) {
    const picked = Array.from(fileList || []).map((file, index) => ({
      uid: "upload-" + Date.now() + "-" + index,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      sheets: 4,
    }));
    if (picked.length) {
      setFiles((prev) => prev.concat(picked));
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    appendFiles(event.dataTransfer.files);
  }

  function removeFile(uid) {
    setFiles((prev) => prev.filter((item) => item.uid !== uid));
  }

  return (
    <div className="plan-block">
      {/* 1. 下载模版 */}
      <div className="plan-block-section">
        <div className="plan-block-head">
          <h3 className="plan-block-title">
            <span className="plan-block-title-icon">
              <Icon name="file-spreadsheet" size={16} />
            </span>
            下载模版
          </h3>
          <p className="plan-block-desc">
            按模版填写站点、设备与链路信息后再导入，可减少在线校验报错。
          </p>
        </div>
        <div className="template-file">
          <span className="template-file-icon">
            <Icon name="file-spreadsheet" size={20} />
          </span>
          <div className="template-file-meta">
            <p className="template-file-name">{templateFile.name}</p>
            <p className="template-file-sub">
              {templateFile.size} · {templateFile.version} · 更新于 {templateFile.updatedAt}
            </p>
          </div>
          <div className="template-file-sheets">
            {templateFile.sheets.map((sheet) => (
              <span className="sheet-chip" key={sheet}>
                {sheet}
              </span>
            ))}
          </div>
          <Button icon={<Icon name="download" size={14} />}>下载模版</Button>
        </div>
      </div>

      {/* 2. 导入规划文件 */}
      <div className="plan-block-section">
        <div className="plan-block-head">
          <h3 className="plan-block-title">
            <span className="plan-block-title-icon">
              <Icon name="upload" size={16} />
            </span>
            导入规划文件
          </h3>
          <p className="plan-block-desc">支持拖拽上传，导入后系统会按模版自动校验字段完整性与地址冲突。</p>
        </div>

        <div
          className={"upload-zone" + (dragging ? " is-dragging" : "")}
          onClick={() => inputRef.current && inputRef.current.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <span className="upload-zone-icon">
            <Icon name="cloud-upload" size={26} strokeWidth={1.5} />
          </span>
          <p className="upload-zone-title">点击或拖拽文件到此处上传</p>
          <p className="upload-zone-hint">{uploadHint}</p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            multiple
            className="upload-zone-input"
            onChange={(event) => appendFiles(event.target.files)}
          />
        </div>

        {files.length ? (
          <div className="upload-list">
            {files.map((file) => (
              <div className="upload-file" key={file.uid}>
                <span className="upload-file-icon">
                  <Icon name="file-spreadsheet" size={16} />
                </span>
                <span className="upload-file-name">{file.name}</span>
                <span className="upload-file-size">{file.size}</span>
                <span className="upload-file-sheets">已解析 {file.sheets} 个工作表</span>
                <StatusTag status="解析通过" tone="success" />
                <button
                  type="button"
                  className="plain-icon-btn"
                  title="移除文件"
                  onClick={() => removeFile(file.uid)}
                >
                  <Icon name="trash-2" size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* 3. 组网管理方式 */}
      <div className="plan-block-section">
        <div className="plan-block-head">
          <h3 className="plan-block-title">
            <span className="plan-block-title-icon">
              <Icon name="git-branch" size={16} />
            </span>
            组网管理方式
          </h3>
          <p className="plan-block-desc">决定设备由哪一层控制器纳管，影响配置文件下发路径与后续运维方式。</p>
        </div>
        <Radio.Group
          className="mode-group"
          value={manageMode}
          onChange={(event) => setManageMode(event.target.value)}
        >
          {managementModes.map((mode) => (
            <Radio
              key={mode.value}
              value={mode.value}
              className={"mode-option" + (manageMode === mode.value ? " is-active" : "")}
            >
              <span className="mode-option-body">
                <span className="mode-option-label">{mode.label}</span>
                <span className="mode-option-desc">{mode.desc}</span>
              </span>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="plan-block-actions">
        <Button icon={<Icon name="refresh-cw" size={14} />}>重置</Button>
        <Button icon={<Icon name="eye" size={14} />}>预览拓扑结构</Button>
        <Button type="primary" icon={<Icon name="cloud-upload" size={14} />}>
          导入并解析
        </Button>
      </div>
    </div>
  );
}

// Layer 4: 拓扑规划区块
export default function TopologyPlan() {
  const [mode, setMode] = useState("custom");

  return (
    <SectionCard
      title="拓扑规划"
      subtitle="确定组网结构与设备连接关系，可使用系统经典模板，或按模版文件自定义规划"
      extra={
        <Segmented
          options={planModes}
          value={mode}
          onChange={(value) => setMode(value)}
        />
      }
    >
      {mode === "classic" ? <ClassicConfig /> : <CustomConfig />}
    </SectionCard>
  );
}

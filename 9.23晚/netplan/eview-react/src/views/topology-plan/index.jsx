import { useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import SelectCard from "@nce/eview-react/SelectCard";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import RadioGroup from "@nce/eview-react/RadioGroup";
import { Icon } from "../../shared/icon.jsx";
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
  const templateOptions = topologyTemplates.map((o) => ({ value: o.value, text: o.label }));
  const scaleOptions = siteScales.map((o) => ({ value: o.value, text: o.label }));
  const formOptions = deviceForms.map((o) => ({ value: o.value, text: o.label }));
  const uplinkData = uplinkTypes.map((o) => ({ value: o.value, text: o.label }));

  return (
    <div className="plan-block">
      <NoticeBar
        type="info"
        title="经典配置规划按系统内置模板生成整网结构"
        desc="选择模板与站点规模后，系统自动生成拓扑结构、设备连接关系与链路配置，生成结果可在「自定义规划」中继续微调。"
      />
      <Form
        layout="vertical"
        itemCol={12}
        initialValues={{
          name: "2026 年总部园区整网规划",
          template: "dual-core",
          scale: "medium",
          deviceForm: "chassis",
          uplink: "fiber",
        }}
        className="plan-form"
      >
        <Form.Item label="规划名称" name="name">
          <TextField placeholder="请输入规划名称" />
        </Form.Item>
        <Form.Item label="拓扑模板" name="template">
          <Select options={templateOptions} />
        </Form.Item>
        <Form.Item label="站点规模" name="scale">
          <Select options={scaleOptions} />
        </Form.Item>
        <Form.Item label="核心设备形态" name="deviceForm">
          <Select options={formOptions} />
        </Form.Item>
        <Form.Item label="出口链路类型" name="uplink" col={24}>
          <RadioGroup data={uplinkData} />
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
          <Button leftIcon={<Icon name="download" size={14} />} text="下载模版" />
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
                {/* TODO(eview-react): 纯图标按钮可改用 IconButton + icon+ 静态导入 */}
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
        {/* TODO(eview-react): RadioGroup 不支持自定义 children，当前手写卡片单选 */}
        <div className="mode-group">
          {managementModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={"mode-option" + (manageMode === mode.value ? " is-active" : "")}
              onClick={() => setManageMode(mode.value)}
            >
              <span className="mode-option-body">
                <span className="mode-option-label">{mode.label}</span>
                <span className="mode-option-desc">{mode.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="plan-block-actions">
        <Button leftIcon={<Icon name="refresh-cw" size={14} />} text="重置" />
        <Button leftIcon={<Icon name="eye" size={14} />} text="预览拓扑结构" />
        <Button status="primary" leftIcon={<Icon name="cloud-upload" size={14} />} text="导入并解析" />
      </div>
    </div>
  );
}

// Layer 4: 拓扑规划区块
export default function TopologyPlan() {
  const [mode, setMode] = useState("custom");
  const planModesData = planModes.map((o) => ({ value: o.value, text: o.label }));

  return (
    <SectionCard
      title="拓扑规划"
      subtitle="确定组网结构与设备连接关系，可使用系统经典模板，或按模版文件自定义规划"
      extra={
        <SelectCard
          data={planModesData}
          value={mode}
          onChange={(value) => setMode(value)}
        />
      }
    >
      {mode === "classic" ? <ClassicConfig /> : <CustomConfig />}
    </SectionCard>
  );
}

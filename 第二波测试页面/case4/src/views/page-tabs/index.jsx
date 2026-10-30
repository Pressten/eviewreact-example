// ② 页面页签：首页/商品详情页/活动页/自定义页，各带草稿数角标；页签切换联动表格与预览
// 右侧：保存草稿 / 发布（发布说明 Modal）
import { useState } from "react";
import { Badge, Button, Input, Modal, Tabs, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import "./index.css";

export default function PageTabsBar() {
  const { state, dispatch, pages, hasUnpublished, totalDrafts } = useDecoration();
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishNote, setPublishNote] = useState("");

  const items = Object.values(pages).map((page) => ({
    key: page.key,
    label: (
      <Badge count={page.draftCount} size="small" showZero offset={[8, -2]}>
        <span className="page-tab-label">{page.title}</span>
      </Badge>
    ),
  }));

  const handlePublishClick = () => {
    if (!hasUnpublished) {
      message.info("当前没有未发布的更改");
      return;
    }
    setPublishNote("");
    setPublishOpen(true);
  };

  const handlePublishOk = () => {
    dispatch({ type: "PUBLISH", note: publishNote.trim() || "楼层配置更新发布" });
    setPublishOpen(false);
    message.success("装修配置已发布，买家端已生效");
  };

  return (
    <div className="page-tabs-bar">
      <Tabs
        className="page-tabs"
        activeKey={state.activePageKey}
        items={items}
        onChange={(key) => dispatch({ type: "SET_PAGE", pageKey: key })}
      />
      <div className="page-tabs-actions">
        <span className="draft-hint">
          <Icon name="info" size="0.875rem" />
          未发布更改将以草稿保留
        </span>
        <Button icon={<Icon name="save" size="0.875rem" />} onClick={() => message.success("草稿已保存")}>
          保存草稿
        </Button>
        <Button type="primary" icon={<Icon name="cloud-upload" size="0.875rem" />} onClick={handlePublishClick}>
          发布
        </Button>

        <Modal
          open={publishOpen}
          title="发布装修配置"
          okText="确认发布"
          cancelText="取消"
          onOk={handlePublishOk}
          onCancel={() => setPublishOpen(false)}
          width={440}
        >
          <p className="publish-summary">
            即将发布全部 4 个页面的装修配置，共 <em>{totalDrafts}</em> 处未发布更改；发布后生成新版本号并写入发布记录。
          </p>
          <label className="publish-label" htmlFor="publish-note">
            发布说明
          </label>
          <Input
            id="publish-note"
            value={publishNote}
            onChange={(e) => setPublishNote(e.target.value)}
            maxLength={60}
            showCount
            placeholder="选填，将记录到发布记录中，如：大促冲刺楼层更新"
          />
        </Modal>
      </div>
    </div>
  );
}

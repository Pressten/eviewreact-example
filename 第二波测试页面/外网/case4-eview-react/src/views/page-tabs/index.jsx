// ② 页面页签：首页/商品详情页/活动页/自定义页，各带草稿数角标；页签切换联动表格与预览
// 右侧：保存草稿 / 发布（发布说明 Modal）
import { useState } from "react";
import { IconPlusIcPublicDisk, IconPlusIcPublicInfo, IconPlusIcPublicUpload } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import TextField from "@/shared/TextField";
import { toast } from "@/shared/AppToast";
import { useDecoration } from "../../context.jsx";
import "./index.css";

export default function PageTabsBar() {
  const { state, dispatch, pages, hasUnpublished, totalDrafts } = useDecoration();
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishNote, setPublishNote] = useState("");

  const tabs = Object.values(pages).map((page) => ({
    key: page.key,
    title: page.title,
    badge: page.draftCount,
  }));

  const handlePublishClick = () => {
    if (!hasUnpublished) {
      toast.info("当前没有未发布的更改");
      return;
    }
    setPublishNote("");
    setPublishOpen(true);
  };

  const handlePublishOk = () => {
    dispatch({ type: "PUBLISH", note: publishNote.trim() || "楼层配置更新发布" });
    setPublishOpen(false);
    toast.success("装修配置已发布，买家端已生效");
  };

  return (
    <div className="page-tabs-bar">
      <Tab
        className="page-tabs"
        selectedIndex={tabs.findIndex((t) => t.key === state.activePageKey)}
        draggable={false}
        onClick={(index) => {
          const t = tabs[index];
          if (t) dispatch({ type: "SET_PAGE", pageKey: t.key });
        }}
      >
        {tabs.map((t) => (
          <TabItem key={t.key} title={t.title} titleExtraContent={<Badge content={t.badge} showZero offset={[8, -2]} />}>
            {null}
          </TabItem>
        ))}
      </Tab>
      <div className="page-tabs-actions">
        <span className="draft-hint">
          <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
          未发布更改将以草稿保留
        </span>
        <Button leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />} text="保存草稿" onClick={() => toast.success("草稿已保存")} />
        <Button status="primary" leftIcon={<IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />} text="发布" onClick={handlePublishClick} />

        <Dialog
          isOpen={publishOpen}
          title="发布装修配置"
          onClose={() => setPublishOpen(false)}
          size={[440, "auto"]}
          buttons={[
            { text: "取消", onClick: () => setPublishOpen(false) },
            { text: "确认发布", status: "primary", onClick: handlePublishOk },
          ]}
        >
          <p className="publish-summary">
            即将发布全部 4 个页面的装修配置，共 <em>{totalDrafts}</em> 处未发布更改；发布后生成新版本号并写入发布记录。
          </p>
          <label className="publish-label" htmlFor="publish-note">
            发布说明
          </label>
          <TextField
            id="publish-note"
            value={publishNote}
            onChange={(value) => setPublishNote(value)}
            maxLength={60}
            placeholder="选填，将记录到发布记录中，如：大促冲刺楼层更新"
          />
        </Dialog>
      </div>
    </div>
  );
}

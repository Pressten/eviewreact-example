// Layer 4 view — 3. 数据展示 (Data Display)
import { useState } from "react";
import { Table, Tabs, Collapse, Empty, Badge, Tag, Tooltip, Popover, Carousel, Timeline, Segmented, Button, Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { Section, SubCard, Demo, TText, TLink, HStack, VStack, Wrap, HList, HDescriptions, HStatistic, HSkeleton, HAvatar, HAvatarGroup, HImage, HCard, HComment } from "../../components/showcase/index.jsx";
import { tableData, statusMap, listData, descItems, carouselSlides } from "../../mock/showcase.js";
import "./index.css";

const statusColor = (s) => statusMap[s].color;

export default function DataDisplayView() {
  const [selected, setSelected] = useState([]);
  const [tabPos, setTabPos] = useState("left");
  const [activeKey, setActiveKey] = useState("1");
  const [tipOpen, setTipOpen] = useState(false);

  const columns = [
    { title: "设备名称", dataIndex: "name", width: 180, render: (t) => <a className="sc-link" style={{ cursor: "pointer" }}>{t}</a> },
    { title: "ID", dataIndex: "id", width: 120 },
    { title: "区域", dataIndex: "region", width: 130 },
    { title: "状态", dataIndex: "status", width: 90, render: (s) => <Tag color={statusColor(s)}>{statusMap[s].text}</Tag> },
    { title: "CPU %", dataIndex: "cpu", width: 100, sorter: (a, b) => a.cpu - b.cpu, render: (v) => <span style={{ color: v > 80 ? "var(--error)" : "var(--on-surface)" }}>{v}</span> },
    { title: "责任人", dataIndex: "owner", width: 90 },
    { title: "操作", width: 120, fixed: "right", render: () => (
      <HStack gap="1rem" style={{ display: "inline-flex" }}>
        <Icon name="eye" size="0.875rem" title="查看" color="var(--on-surface-variant)" style={{ cursor: "pointer" }} />
        <Icon name="pencil" size="0.875rem" title="编辑" color="var(--on-surface-variant)" style={{ cursor: "pointer" }} />
        <Icon name="trash-2" size="0.875rem" title="删除" color="var(--on-surface-variant)" style={{ cursor: "pointer" }} />
      </HStack>
    ) },
  ];

  const tabItems = [
    { key: "1", label: "设备概览", children: <TText>设备概览内容区。</TText> },
    { key: "2", label: "告警", children: <TText type="warning">告警内容区。</TText> },
    { key: "3", label: "日志", children: <TText type="secondary">日志内容区。</TText> },
  ];

  const collapseItems = [
    { key: "1", label: "网络层", children: <TText>交换机、路由器、防火墙共 48 台。</TText> },
    { key: "2", label: "计算层", children: <TText>服务器 16 台,边缘节点 8 个。</TText> },
    { key: "3", label: "存储层(已禁用)", children: <TText>不可展开。</TText>, disabled: true },
  ];

  return (
    <Section id="data" title="3. 数据展示" desc="Table/Tabs/Collapse/Empty/Badge/Tag/Tooltip/Popover/Carousel/Timeline 为真实 antd;List/Descriptions/Statistic/Skeleton/Avatar/Image/Card/Popconfirm/Transfer/Comment 已禁用 → H5 替代。">
      {/* Table */}
      <SubCard title="Table" extra={<TText type="secondary">size=large · bordered · scroll.x</TText>}>
        <Demo label="完整表格: render(Tag+操作图标) / fixed=right+scroll.x / sorter(CPU) / rowSelection 受控 / pagination" block>
          <Table
            dataSource={tableData}
            columns={columns}
            rowSelection={{ type: "checkbox", selectedRowKeys: selected, onChange: setSelected }}
            scroll={{ x: 1000 }}
            size="large"
            bordered
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
          />
        </Demo>
        <Demo label="rowSelection type=radio" block>
          <Table dataSource={tableData.slice(0, 4)} columns={columns.slice(0, 4)} rowSelection={{ type: "radio" }} pagination={false} size="middle" />
        </Demo>
        <Demo label="empty 空态(dataSource=[])" block>
          <Table dataSource={[]} columns={columns.slice(0, 4)} />
        </Demo>
        <Demo label="expandable 展开行" block>
          <Table
            dataSource={tableData.slice(0, 4)}
            columns={columns.slice(0, 4)}
            expandable={{ expandedRowRender: (r) => <TText type="secondary">设备 {r.id} 详情:{r.name} / {r.region} / CPU {r.cpu}%</TText> }}
            pagination={false}
            size="middle"
          />
        </Demo>
        <Demo label="size: small / middle / large" block>
          <Table dataSource={tableData.slice(0, 2)} columns={columns.slice(0, 4)} pagination={false} size="small" />
        </Demo>
      </SubCard>

      {/* Tabs */}
      <SubCard title="Tabs">
        <Demo label="items 写法 + type=line + 受控">
          <Tabs items={tabItems} activeKey={activeKey} onChange={setActiveKey} />
        </Demo>
        <Demo label="TabPane 写法(v5 已废弃 → 统一用 items)">
          <TText type="secondary">antd 5 推荐 items 写法;TabPane 已废弃。</TText>
        </Demo>
        <Demo label="tabPosition(用 Segmented 切换)+ size">
          <Segmented options={["top", "left", "right", "bottom"]} value={tabPos} onChange={setTabPos} />
          <Tabs items={tabItems} tabPosition={tabPos} size="small" style={{ minHeight: "6rem" }} />
        </Demo>
        <Demo label="type=card + editable(addIcon)">
          <Tabs type="editable-card" items={tabItems} addIcon={<Icon name="plus" size="0.875rem" />} onEdit={() => {}} />
        </Demo>
      </SubCard>

      {/* Collapse */}
      <SubCard title="Collapse">
        <Demo label="accordion(只展开一个)+ onChange 受控">
          <Collapse accordion items={collapseItems.slice(0, 2)} />
        </Demo>
        <Demo label="ghost + 可禁用面板 + extra">
          <Collapse ghost items={[
            { key: "1", label: "网络层", extra: <TLink onClick={() => {}}>配置</TLink>, children: <TText>内容…</TText> },
            { key: "2", label: "存储层(禁用)", disabled: true, children: null },
          ]} />
        </Demo>
      </SubCard>

      {/* List / Descriptions (H5) */}
      <SubCard title="List(H5 替代)">
        <Demo label="基础 + split + renderItem(Avatar+Title+Description)">
          <HList dataSource={listData} split size="default" renderItem={(item) => (
            <HStack gap="0.75rem" style={{ width: "100%" }}>
              <HAvatar src="./assets/uploads/user.png" />
              <VStack gap="0.125rem" style={{ flex: 1 }}>
                <TText strong>{item.title}</TText>
                <TText type="secondary">{item.desc}</TText>
              </VStack>
              <TText type="secondary">{item.time}</TText>
            </HStack>
          )} />
        </Demo>
        <Demo label="size + grid(2 列)">
          <HList dataSource={listData.slice(0, 4)} grid={2} split={false} renderItem={(item) => (
            <div className="sc-subcard" style={{ padding: "0.75rem" }}>
              <TText strong>{item.title}</TText>
              <TText type="secondary">{item.desc}</TText>
            </div>
          )} />
        </Demo>
      </SubCard>

      <SubCard title="Descriptions(H5 替代)">
        <Demo label="bordered + column=2 + extra">
          <HDescriptions title="设备详情" extra={<TLink onClick={() => {}}>编辑</TLink>} items={descItems} column={2} bordered />
        </Demo>
      </SubCard>

      {/* Empty */}
      <SubCard title="Empty">
        <Demo label="基础">
          <Empty description="暂无告警数据" />
        </Demo>
        <Demo label="description 自定义 + image=SIMPLE">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<TText type="secondary">自定义描述文案</TText>} />
        </Demo>
      </SubCard>

      {/* Statistic (H5) */}
      <SubCard title="Statistic(H5 替代)">
        <Demo label="value + precision + leading/trailing + valueStyle">
          <HStack gap="2rem">
            <HStatistic title="在线设备" value={48} trailing="台" />
            <HStatistic title="CPU 均值" value={42.6} precision={1} trailing="%" valueStyle={{ color: "var(--warning)" }} />
            <HStatistic title="本月营收" leading="￥" value={128050} />
          </HStack>
        </Demo>
      </SubCard>

      {/* Skeleton (H5) */}
      <SubCard title="Skeleton(H5 替代)">
        <Demo label="active + avatar + paragraph">
          <HSkeleton active avatar paragraph rows={3} />
        </Demo>
        <Demo label="button / input 形态">
          <HStack gap="2rem" align="center"><HSkeleton active paragraph={false} type="button" /><HSkeleton active paragraph={false} type="input" style={{ width: "12rem" }} /></HStack>
        </Demo>
      </SubCard>

      {/* Avatar (H5) */}
      <SubCard title="Avatar(H5 替代)">
        <Demo label="size + shape(circle/square) + src + icon">
          <HStack gap="0.75rem">
            <HAvatar size="large" src="./assets/uploads/user.png" />
            <HAvatar size="default" src="./assets/uploads/user.png" />
            <HAvatar size="small" shape="square" icon="user" />
          </HStack>
        </Demo>
        <Demo label="group(max 折叠)">
          <HAvatarGroup max={3}>
            <HAvatar src="./assets/uploads/user.png" />
            <HAvatar src="./assets/uploads/user.png" />
            <HAvatar src="./assets/uploads/user.png" />
            <HAvatar src="./assets/uploads/user.png" />
            <HAvatar src="./assets/uploads/user.png" />
          </HAvatarGroup>
        </Demo>
      </SubCard>

      {/* Badge */}
      <SubCard title="Badge">
        <Demo label="count / dot / overflowCount">
          <HStack gap="1.5rem">
            <Badge count={5}><div className="fv-badge-box"><Icon name="bell" size="1.25rem" /></div></Badge>
            <Badge dot><div className="fv-badge-box"><Icon name="bell" size="1.25rem" /></div></Badge>
            <Badge count={200} overflowCount={99}><div className="fv-badge-box"><Icon name="bell" size="1.25rem" /></div></Badge>
          </HStack>
        </Demo>
        <Demo label="status(success/error/default/warning/processing)+ text">
          <HStack gap="1rem">
            <Badge status="success" text="在线" />
            <Badge status="error" text="故障" />
            <Badge status="default" text="离线" />
            <Badge status="warning" text="告警" />
            <Badge status="processing" text="处理中" />
          </HStack>
        </Demo>
        <Demo label="size + offset">
          <Badge count={9} size="small" offset={[6, -6]}><div className="fv-badge-box"><Icon name="bell" size="1.25rem" /></div></Badge>
        </Demo>
      </SubCard>

      {/* Tag */}
      <SubCard title="Tag">
        <Demo label="color 预设(success/processing/error/default/warning)">
          <Wrap gap="0.5rem"><Tag color="success">成功</Tag><Tag color="processing">处理中</Tag><Tag color="error">错误</Tag><Tag color="default">默认</Tag><Tag color="warning">警告</Tag></Wrap>
        </Demo>
        <Demo label="自定义色 + bordered">
          <Wrap gap="0.5rem"><Tag color="#f50">#f50</Tag><Tag color="#2db7f5">#2db7f5</Tag><Tag color="#87d068" bordered={false}>无边框</Tag></Wrap>
        </Demo>
        <Demo label="closable + onClose + icon">
          <Tag color="blue" closable onClose={() => {}} icon={<Icon name="circle-question-mark" size="0.75rem" />}>可关闭</Tag>
        </Demo>
        <Demo label="CheckableTag">
          <Tag.CheckableTag checked>已选标签</Tag.CheckableTag>
          <Tag.CheckableTag>未选标签</Tag.CheckableTag>
        </Demo>
      </SubCard>

      {/* Tooltip / Popover */}
      <SubCard title="Tooltip / Popover / Popconfirm(H5 替代)">
        <Demo label="Tooltip placement(上/下/左/右)">
          <HStack gap="0.5rem">
            {["top", "bottom", "left", "right"].map((p) => (
              <Tooltip key={p} placement={p} title={p + " 提示"}><Button>{p}</Button></Tooltip>
            ))}
          </HStack>
        </Demo>
        <Demo label="Tooltip trigger=click + open 受控">
          <Tooltip trigger="click" open={tipOpen} onOpenChange={setTipOpen} title="点击触发,受控 open"><Button>click 受控</Button></Tooltip>
        </Demo>
        <Demo label="Popover trigger=click + content + title + placement">
          <Popover trigger="click" placement="bottom" title="操作确认" content={<VStack gap="0.5rem"><TText>确定执行该操作?</TText><HStack gap="0.5rem"><Button size="small" type="primary" onClick={() => setTipOpen(false)}>确定</Button><Button size="small">取消</Button></HStack></VStack>}>
            <Button>点击弹出(Popconfirm 替代)</Button>
          </Popover>
        </Demo>
      </SubCard>

      {/* Image (H5) */}
      <SubCard title="Image(H5 替代)">
        <Demo label="src + preview + placeholder + fallback">
          <HImage src="./assets/uploads/image.jpg" width="6rem" height="6rem" preview placeholder={<TText type="secondary">加载中…</TText>} fallback="./assets/uploads/empty.svg" />
        </Demo>
      </SubCard>

      {/* Carousel */}
      <SubCard title="Carousel">
        <Demo label="autoplay + dots + effect=scrollx" block>
          <Carousel autoplay dots effect="scrollx" className="fv-carousel">
            {carouselSlides.map((s, i) => (
              <div key={i} className="fv-slide" style={{ background: s.bg }}>
                <div className="fv-slide-title">{s.title}</div>
                <div className="fv-slide-sub">{s.sub}</div>
              </div>
            ))}
          </Carousel>
        </Demo>
        <Demo label="effect=fade">
          <Carousel autoplay dots effect="fade" className="fv-carousel">
            {carouselSlides.slice(0, 2).map((s, i) => (
              <div key={i} className="fv-slide" style={{ background: s.bg }}><div className="fv-slide-title">{s.title}</div></div>
            ))}
          </Carousel>
        </Demo>
      </SubCard>

      {/* Card (H5) */}
      <SubCard title="Card(H5 替代)">
        <Demo label="title + extra + cover + actions + bordered + size">
          <HCard
            title="网络设备卡片"
            extra={<TLink onClick={() => {}}>更多</TLink>}
            cover={<img src="./assets/uploads/background.jpg" alt="" />}
            actions={[<a key="a" className="sc-link" style={{ cursor: "pointer" }}>刷新</a>, <a key="b" className="sc-link" style={{ cursor: "pointer" }}>编辑</a>, <a key="c" className="sc-link" style={{ cursor: "pointer" }}>分享</a>]}
            size="default"
          >
            <TText type="secondary">卡片正文内容,展示设备概要信息。</TText>
          </HCard>
        </Demo>
      </SubCard>

      {/* Timeline */}
      <SubCard title="Timeline">
        <Demo label="mode: left / right / alternate + color + dot 自定义">
          <HStack gap="3rem" align="flex-start">
            <Timeline mode="left" items={[{ color: "green", children: "工单创建" }, { color: "blue", children: "接单定位" }, { color: "red", children: "更换部件" }]} />
            <Timeline mode="alternate" items={[{ color: "green", dot: <Icon name="check" size="0.75rem" />, children: "已完成" }, { color: "blue", dot: <Icon name="loader" size="0.75rem" />, children: "进行中" }, { color: "gray", children: "待处理" }]} />
          </HStack>
        </Demo>
      </SubCard>

      {/* Comment (H5) */}
      <SubCard title="Comment(H5 替代)">
        <Demo label="author + avatar + content + datetime + actions + children 嵌套" block>
          <HComment
            author="张伟"
            avatar={<HAvatar src="./assets/uploads/user.png" />}
            content={<TText>核心交换机端口已更换,业务恢复验证中。</TText>}
            datetime="2025-10-11 14:22"
            actions={[<TLink key="a" onClick={() => {}}>回复</TLink>, <TLink key="b" onClick={() => {}}>点赞</TLink>]}
          >
            <HComment
              author="李娜"
              avatar={<HAvatar src="./assets/uploads/user.png" />}
              content={<TText type="secondary">收到,我跟进验证结果。</TText>}
              datetime="2025-10-11 14:30"
            />
          </HComment>
        </Demo>
      </SubCard>

      {/* Transfer (banned → note) */}
      <SubCard title="Transfer(已禁用 → H5 替代)">
        <Demo label="设计系统已禁用 antd Transfer" note="建议用 TreeSelect(treeCheckable) 或左右两列自实现列表 + 勾选迁移">
          <TLink onClick={() => {}}>查看 TreeCheckable 方案</TLink>
        </Demo>
      </SubCard>
    </Section>
  );
}

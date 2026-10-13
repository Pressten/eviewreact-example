// Layer 4 view — 2. 表单与输入 (Forms & Input)
// Form/Form.Item banned → H5 form skeleton (controlled + rules + error text).
import { useState } from "react";
import dayjs from "dayjs";
import { Input, InputNumber, Select, Cascader, TreeSelect, Checkbox, Radio, Switch, Slider, Rate, DatePicker, TimePicker, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { Section, SubCard, Demo, TText, TLink, HStack, VStack, HUpload } from "../../components/showcase/index.jsx";
import { regionOptions, cascaderOptions, treeData, checkboxOptions, radioOptions } from "../../mock/showcase.js";
import "./index.css";

const { TextArea, Search, Password } = Input;

/* ---------- H5 form (Form alternative) with rules + submit/reset ---------- */
function H5Form() {
  const [v, setV] = useState({ name: "", email: "", count: 3, region: undefined, notify: ["email"], agree: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!v.name || v.name.trim().length < 2) e.name = "名称至少 2 个字符";
    if (!v.email) e.email = "邮箱必填";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "邮箱格式不正确";
    if (!v.region) e.region = "请选择区域";
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setSubmitted(null); message.warning("校验未通过,请修正标红字段"); return; }
    setSubmitted(JSON.stringify(v));
    message.success("提交成功:" + v.name);
  };
  const onReset = () => { setV({ name: "", email: "", count: 3, region: undefined, notify: [], agree: false }); setErrors({}); setSubmitted(null); };

  return (
    <form className="fv-form-h" onSubmit={onSubmit}>
      <label className="fv-label required" htmlFor="f-name">名称</label>
      <div className="fv-field">
        <Input id="f-name" value={v.name} onChange={(e) => set("name", e.target.value)} status={errors.name ? "error" : undefined} placeholder="2 字以上" style={{ width: "100%" }} />
        {errors.name ? <div className="fv-error">{errors.name}</div> : null}
      </div>

      <label className="fv-label required" htmlFor="f-email">邮箱</label>
      <div className="fv-field">
        <Input id="f-email" value={v.email} onChange={(e) => set("email", e.target.value)} status={errors.email ? "error" : undefined} placeholder="name@huawei.com" style={{ width: "100%" }} />
        {errors.email ? <div className="fv-error">{errors.email}</div> : null}
      </div>

      <label className="fv-label" htmlFor="f-count">数量</label>
      <div className="fv-field">
        <InputNumber id="f-count" mode="spinner" variant="outlined" min={1} max={999} step={1} value={v.count} onChange={(n) => set("count", n)} style={{ width: "8rem" }} />
      </div>

      <label className="fv-label required" htmlFor="f-region">区域</label>
      <div className="fv-field">
        <Select id="f-region" value={v.region} onChange={(val) => set("region", val)} options={regionOptions} placeholder="选择区域" allowClear status={errors.region ? "error" : undefined} style={{ width: "100%" }} />
        {errors.region ? <div className="fv-error">{errors.region}</div> : null}
      </div>

      <label className="fv-label">通知</label>
      <div className="fv-field">
        <Checkbox.Group options={checkboxOptions} value={v.notify} onChange={(arr) => set("notify", arr)} />
      </div>

      <label className="fv-label">协议</label>
      <div className="fv-field">
        <Switch checkedChildren="同意" unCheckedChildren="拒绝" checked={v.agree} onChange={(b) => set("agree", b)} />
      </div>

      <div className="fv-actions">
        <Button type="primary" htmlType="submit">提交</Button>
        <Button onClick={onReset}>重置</Button>
      </div>
      {submitted ? <div className="fv-actions"><TText type="success">onFinish 值: {submitted}</TText></div> : null}
    </form>
  );
}

/* ---------- AutoComplete H5 alternative (AutoComplete banned) ---------- */
function H5AutoComplete() {
  const [text, setText] = useState("");
  const opts = ["huawei.com", "huaweicloud.com", "hdesign.huawei.com", "octo.hdesign.huawei.com"].filter((s) => s.includes(text));
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", width: "16rem" }}>
      <Input value={text} onChange={(e) => { setText(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="输入 huawei…" allowClear />
      {open && opts.length ? (
        <ul className="fv-ac-list">
          {opts.map((o) => (
            <li key={o} className="fv-ac-item" onMouseDown={() => { setText(o); setOpen(false); }}>{o}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function FormsView() {
  const [cascaderText, setCascaderText] = useState("");
  const [multiVal, setMultiVal] = useState(["east", "north"]);
  const [tags, setTags] = useState(["告警", "工单"]);
  const [radioVal, setRadioVal] = useState("now");
  const [sliderVal, setSliderVal] = useState(30);
  const [rangeVal, setRangeVal] = useState([20, 60]);
  const [rateVal, setRateVal] = useState(3.5);

  // DatePicker helpers
  const disabledPast = (current) => current && current.isBefore(new Date().setHours(0, 0, 0, 0), "day");
  const rangePresets = [
    { label: "今天", value: [dayjs(), dayjs()] },
    { label: "本周", value: [dayjs().subtract(6, "day"), dayjs()] },
  ];

  return (
    <Section id="forms" title="2. 表单与输入" desc="Form/Form.Item 已禁用 → H5 骨架(受控 + rules + 错误文案);Mentions / AutoComplete / Upload 已禁用 → H5 替代。">
      {/* H5 Form */}
      <SubCard title="Form 表单骨架(H5 + 受控 + rules 校验)" extra={<TLink onClick={() => {}}>布局: horizontal</TLink>}>
        <H5Form />
      </SubCard>

      {/* Input */}
      <SubCard title="Input">
        <Demo label="基础 + allowClear">
          <Input allowClear placeholder="请输入设备名称" style={{ width: "14rem" }} />
        </Demo>
        <Demo label="maxLength + showCount">
          <Input maxLength={20} showCount placeholder="最多 20 字" style={{ width: "14rem" }} />
        </Demo>
        <Demo label="disabled">
          <Input disabled defaultValue="不可编辑" style={{ width: "14rem" }} />
        </Demo>
        <Demo label="size: large / middle / small">
          <Input size="large" placeholder="large" style={{ width: "10rem" }} />
          <Input placeholder="middle" style={{ width: "10rem" }} />
          <Input size="small" placeholder="small" style={{ width: "10rem" }} />
        </Demo>
        <Demo label="addonBefore(尾附加内容请用 suffix 或控件外文本)" note="设计规范: 控件尾附加与左侧图标装饰均已禁用">
          <Input addonBefore="https://" placeholder="域名" style={{ width: "16rem" }} />
        </Demo>
        <Demo label="搜索框: Input + suffix(规范推荐,替代 Input.Search)">
          <Input suffix={<span className="fv-search-suffix">↵</span>} placeholder="搜索名称、ID 或 IP" allowClear style={{ width: "16rem" }} onPressEnter={() => message.info("回车搜索")} />
        </Demo>
      </SubCard>

      {/* TextArea / Search / Password */}
      <SubCard title="Input.TextArea / Search / Password">
        <Demo label="TextArea: showCount + maxLength + autoSize">
          <TextArea showCount maxLength={120} autoSize={{ minRows: 2, maxRows: 4 }} placeholder="描述…" style={{ width: "20rem" }} />
        </Demo>
        <Demo label="TextArea: rows 固定行数">
          <TextArea rows={3} placeholder="固定 3 行" style={{ width: "20rem" }} />
        </Demo>
        <Demo label="Input.Search: enterButton + loading + onSearch">
          <Search enterButton="搜索" loading={false} placeholder="关键词" onSearch={(q) => message.success("搜索: " + q)} style={{ width: "18rem" }} />
        </Demo>
        <Demo label="Input.Password: visibilityToggle">
          <Password placeholder="密码" style={{ width: "14rem" }} />
        </Demo>
      </SubCard>

      {/* InputNumber */}
      <SubCard title="InputNumber">
        <Demo label="min/max/step + precision(mode=spinner variant=outlined)">
          <InputNumber mode="spinner" variant="outlined" min={0} max={100} step={0.5} precision={1} defaultValue={12.5} style={{ width: "8rem" }} />
        </Demo>
        <Demo label="disabled">
          <InputNumber mode="spinner" variant="outlined" disabled defaultValue={0} style={{ width: "8rem" }} />
        </Demo>
        <Demo label="单位放控件外(控件尾附加内容已禁用)">
          <HStack gap="0.25rem"><InputNumber mode="spinner" variant="outlined" defaultValue={60} style={{ width: "6rem" }} /><TText type="secondary">%</TText></HStack>
        </Demo>
      </SubCard>

      {/* Select */}
      <SubCard title="Select">
        <Demo label="基础 options(label/value/disabled) + placeholder + allowClear">
          <Select options={regionOptions} placeholder="选择区域" allowClear style={{ width: "12rem" }} />
        </Demo>
        <Demo label="Select.Option 写法 + filterOption">
          <Select showSearch placeholder="搜索区域" optionFilterProp="label" style={{ width: "12rem" }} filterOption={(input, opt) => String(opt.label).includes(input)}>
            {regionOptions.map((o) => <Select.Option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</Select.Option>)}
          </Select>
        </Demo>
        <Demo label="mode=multiple + maxTagCount + allowClear">
          <Select mode="multiple" value={multiVal} onChange={setMultiVal} options={regionOptions} maxTagCount={2} allowClear style={{ width: "16rem" }} />
        </Demo>
        <Demo label="mode=tags(自由输入)">
          <Select mode="tags" value={tags} onChange={setTags} placeholder="输入标签回车" style={{ width: "16rem" }} />
        </Demo>
        <Demo label="showSearch + filterSort(按字母排序)">
          <Select showSearch optionFilterProp="label" style={{ width: "12rem" }} options={[...regionOptions].sort((a, b) => a.label.localeCompare(b.label))} filterSort={(a, b) => a.label.localeCompare(b.label)} placeholder="排序后可搜索" />
        </Demo>
        <Demo label="loading">
          <Select loading placeholder="加载中…" style={{ width: "12rem" }} />
        </Demo>
      </SubCard>

      {/* Cascader / TreeSelect */}
      <SubCard title="Cascader / TreeSelect">
        <Demo label="Cascader 包裹形态(children 触发器) + onChange 回显">
          <Cascader options={cascaderOptions} onChange={(_val, labels) => setCascaderText(labels.join(" / "))}>
            <Input value={cascaderText} readOnly placeholder="请选择省市区" style={{ width: "16rem" }} />
          </Cascader>
        </Demo>
        <Demo label="Cascader multiple + showCheckedStrategy">
          <Cascader options={cascaderOptions} multiple maxTagCount="responsive" style={{ width: "16rem" }} placeholder="多选省市区" />
        </Demo>
        <Demo label="TreeSelect: treeData + treeCheckable + multiple">
          <TreeSelect treeData={treeData} treeCheckable multiple showCheckedStrategy="SHOW_CHILD" placeholder="选择设备类型" style={{ width: "16rem" }} maxTagCount={3} />
        </Demo>
      </SubCard>

      {/* Checkbox / Radio / Switch */}
      <SubCard title="Checkbox / Radio / Switch">
        <Demo label="Checkbox: 基础 / indeterminate / disabled">
          <Checkbox>独立项</Checkbox>
          <Checkbox indeterminate>半选</Checkbox>
          <Checkbox disabled>禁用</Checkbox>
        </Demo>
        <Demo label="Checkbox.Group(options + defaultValue)">
          <Checkbox.Group options={checkboxOptions} defaultValue={["email", "sms"]} />
        </Demo>
        <Demo label="Radio.Group(options) + 受控">
          <Radio.Group options={radioOptions} value={radioVal} onChange={(e) => setRadioVal(e.target.value)} />
        </Demo>
        <Demo label="按钮形态(规范: 按钮式单选已禁用 → Segmented 替代)">
          <TText type="secondary">视图/模式切换请用 </TText><TLink onClick={() => {}}>Segmented</TLink>
        </Demo>
        <Demo label="Radio.Group size">
          <Radio.Group options={radioOptions} defaultValue="now" size="small" />
          <Radio.Group options={radioOptions} defaultValue="now" />
        </Demo>
        <Demo label="Switch: checked / loading / disabled + checkedChildren/unCheckedChildren">
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
          <Switch loading />
          <Switch disabled />
        </Demo>
      </SubCard>

      {/* Slider / Rate */}
      <SubCard title="Slider / Rate">
        <Demo label="Slider: 基础 + 受控">
          <Slider value={sliderVal} onChange={setSliderVal} style={{ width: "16rem" }} />
        </Demo>
        <Demo label="Slider: range + marks + step">
          <Slider range value={rangeVal} onChange={setRangeVal} marks={{ 0: "0", 50: "中", 100: "满" }} step={10} style={{ width: "16rem" }} />
        </Demo>
        <Demo label="Slider: vertical">
          <div style={{ height: "8rem" }}><Slider vertical defaultValue={40} style={{ height: "8rem" }} /></div>
        </Demo>
        <Demo label="Rate: allowHalf + count">
          <Rate allowHalf count={10} value={rateVal} onChange={setRateVal} />
        </Demo>
        <Demo label="Rate: character + disabled">
          <Rate character={<span>★</span>} defaultValue={3} disabled />
        </Demo>
      </SubCard>

      {/* DatePicker / TimePicker */}
      <SubCard title="DatePicker / RangePicker / TimePicker">
        <Demo label="DatePicker: 基础">
          <DatePicker style={{ width: "12rem" }} />
        </Demo>
        <Demo label="showTime + disabledDate(禁选今天之前)">
          <DatePicker showTime disabledDate={disabledPast} style={{ width: "14rem" }} />
        </Demo>
        <Demo label="picker=month / year">
          <DatePicker picker="month" style={{ width: "10rem" }} />
          <DatePicker picker="year" style={{ width: "10rem" }} />
        </Demo>
        <Demo label="RangePicker: showTime + disabledDate + presets">
          <DatePicker.RangePicker showTime disabledDate={disabledPast} presets={rangePresets} style={{ width: "20rem" }} />
        </Demo>
        <Demo label="TimePicker: use12Hours + format">
          <TimePicker use12Hours format="h:mm A" style={{ width: "10rem" }} />
          <TimePicker format="HH:mm:ss" style={{ width: "10rem" }} />
        </Demo>
      </SubCard>

      {/* Mentions / AutoComplete / Upload (banned → H5 alternatives) */}
      <SubCard title="Mentions / AutoComplete / Upload(已禁用 → H5 替代)">
        <Demo label="AutoComplete 替代: Input + 过滤建议下拉">
          <H5AutoComplete />
        </Demo>
        <Demo label="Mentions(@ 触发): H5 Input + 过滤">
          <MentionsAlt />
        </Demo>
        <Demo label="Upload HUpload: listType=text + multiple">
          <HUpload listType="text" multiple><Button icon={<Icon name="upload" size="0.875rem" />}>选择文件</Button></HUpload>
        </Demo>
        <Demo label="Upload HUpload: picture-card(拖拽)">
          <HUpload listType="picture-card"><div className="fv-dragger"><TText type="secondary">点击或拖拽上传</TText></div></HUpload>
        </Demo>
      </SubCard>
    </Section>
  );
}

/* small inline helpers specific to this view */
function MentionsAlt() {
  const [text, setText] = useState("");
  const members = ["张伟", "李娜", "王强", "陈芳", "刘洋"];
  const m = text.match(/@([^\s@]*)$/);
  const suggestions = m ? members.filter((n) => n.includes(m[1])) : [];
  const insert = (name) => setText((t) => t.replace(/@([^\s@]*)$/, "@" + name + " "));
  return (
    <div style={{ position: "relative", width: "18rem" }}>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="输入 @ 提及成员" rows={2} />
      {suggestions.length ? (
        <ul className="fv-ac-list">
          {suggestions.map((n) => <li key={n} className="fv-ac-item" onMouseDown={() => insert(n)}>{n}</li>)}
        </ul>
      ) : null}
    </div>
  );
}

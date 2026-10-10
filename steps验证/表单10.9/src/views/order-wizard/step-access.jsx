import { Input, Select, Radio, DatePicker } from "antd";
import dayjs from "dayjs";
import FormField from "../../components/form-field/index.jsx";
import {
  provinceOptions,
  getCities,
  roomOptions,
  surveyOptions,
  appointSlotOptions,
} from "../../mock/order.js";

const { TextArea } = Input;

// 步骤三 — 接入信息
export default function StepAccess({ form, update, errors }) {
  const err = (k) => (errors[k] ? "error" : undefined);

  const handleProvince = (v) => {
    update("province", v);
    update("city", undefined);
  };

  return (
    <div className="form-grid">
      <FormField label="所属省份" required htmlFor="province" error={errors.province}>
        <Select
          id="province"
          value={form.province}
          status={err("province")}
          placeholder="请选择所属省份"
          options={provinceOptions}
          onChange={handleProvince}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="所属城市" required htmlFor="city" error={errors.city}>
        <Select
          id="city"
          value={form.city}
          status={err("city")}
          placeholder={form.province ? "请选择所属城市" : "请先选择省份"}
          disabled={!form.province}
          options={getCities(form.province)}
          onChange={(v) => update("city", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="安装地址" required htmlFor="address" error={errors.address} full>
        <Input
          id="address"
          value={form.address}
          status={err("address")}
          placeholder="请输入详细安装地址，精确到门牌号或机房位置"
          onChange={(e) => update("address", e.target.value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="接入机房" htmlFor="room">
        <Select
          id="room"
          value={form.room}
          placeholder="请选择就近接入机房"
          options={roomOptions}
          onChange={(v) => update("room", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="是否需要现场勘查" htmlFor="survey">
        <div className="field-inline">
          <Radio.Group
            id="survey"
            value={form.survey}
            options={surveyOptions}
            onChange={(e) => update("survey", e.target.value)}
          />
        </div>
      </FormField>

      <FormField label="预约安装日期" required htmlFor="appointDate" error={errors.appointDate}>
        <DatePicker
          id="appointDate"
          value={form.appointDate}
          status={err("appointDate")}
          format="YYYY-MM-DD"
          placeholder="请选择预约安装日期"
          disabledDate={(cur) => cur && cur < dayjs().startOf("day")}
          onChange={(d) => update("appointDate", d)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="预约时段" htmlFor="appointSlot">
        <Select
          id="appointSlot"
          value={form.appointSlot}
          placeholder="请选择上门时段"
          options={appointSlotOptions}
          onChange={(v) => update("appointSlot", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="现场联系人" required htmlFor="siteName" error={errors.siteName}>
        <Input
          id="siteName"
          value={form.siteName}
          status={err("siteName")}
          placeholder="请输入现场联系人姓名"
          onChange={(e) => update("siteName", e.target.value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="现场联系电话" required htmlFor="sitePhone" error={errors.sitePhone}>
        <Input
          id="sitePhone"
          value={form.sitePhone}
          status={err("sitePhone")}
          maxLength={11}
          placeholder="请输入 11 位手机号"
          onChange={(e) => update("sitePhone", e.target.value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="施工特殊要求" htmlFor="buildRemark" full>
        <TextArea
          id="buildRemark"
          value={form.buildRemark}
          rows={3}
          maxLength={200}
          showCount
          placeholder="如准入登记、走线要求、夜间施工限制等"
          onChange={(e) => update("buildRemark", e.target.value)}
        />
      </FormField>
    </div>
  );
}

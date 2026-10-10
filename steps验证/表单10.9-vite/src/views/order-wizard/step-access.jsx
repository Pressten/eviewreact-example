import TextField from "@/shared/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@/shared/Select";
import { RadioGroup } from "@nce/eview-react/Radio";
import DatePicker from "@nce/eview-react/DatePicker";
import FormField from "../../components/form-field/index.jsx";
import {
  provinceOptions,
  getCities,
  roomOptions,
  surveyOptions,
  appointSlotOptions,
} from "../../mock/order.js";

const toOpts = (opts) => opts.map((o) => ({ text: o.label, value: o.value }));

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
          defaultLabel="请选择所属省份"
          options={toOpts(provinceOptions)}
          onChange={handleProvince}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="所属城市" required htmlFor="city" error={errors.city}>
        <Select
          id="city"
          value={form.city}
          status={err("city")}
          defaultLabel={form.province ? "请选择所属城市" : "请先选择省份"}
          disabled={!form.province}
          options={toOpts(getCities(form.province))}
          onChange={(v) => update("city", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="安装地址" required htmlFor="address" error={errors.address} full>
        <TextField
          id="address"
          value={form.address}
          status={err("address")}
          placeholder="请输入详细安装地址，精确到门牌号或机房位置"
          onChange={(value) => update("address", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="接入机房" htmlFor="room">
        <Select
          id="room"
          value={form.room}
          defaultLabel="请选择就近接入机房"
          options={toOpts(roomOptions)}
          onChange={(v) => update("room", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="是否需要现场勘查" htmlFor="survey">
        <div className="field-inline">
          <RadioGroup
            id="survey"
            value={form.survey}
            data={toOpts(surveyOptions)}
            isControlled
            onChange={(a, b) => update("survey", a === form.survey ? b : a)}
          />
        </div>
      </FormField>

      <FormField label="预约安装日期" required htmlFor="appointDate" error={errors.appointDate}>
        <DatePicker
          id="appointDate"
          type="date"
          format="yyyy-MM-dd"
          value={form.appointDate}
          placeholder="请选择预约安装日期"
          dateRange={{ dateFrom: new Date(), dateTo: new Date(new Date().getFullYear() + 10, 0, 1) }}
          ifTriggerOnChangeWithCalender={false}
          onChange={(_dateString, date) => { if (date) update("appointDate", date); }}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="预约时段" htmlFor="appointSlot">
        <Select
          id="appointSlot"
          value={form.appointSlot}
          defaultLabel="请选择上门时段"
          options={toOpts(appointSlotOptions)}
          onChange={(v) => update("appointSlot", v)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="现场联系人" required htmlFor="siteName" error={errors.siteName}>
        <TextField
          id="siteName"
          value={form.siteName}
          status={err("siteName")}
          placeholder="请输入现场联系人姓名"
          onChange={(value) => update("siteName", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="现场联系电话" required htmlFor="sitePhone" error={errors.sitePhone}>
        <TextField
          id="sitePhone"
          value={form.sitePhone}
          status={err("sitePhone")}
          maxLength={11}
          placeholder="请输入 11 位手机号"
          onChange={(value) => update("sitePhone", value)}
          style={{ width: "100%" }}
        />
      </FormField>

      <FormField label="施工特殊要求" htmlFor="buildRemark" full>
        <TextArea
          id="buildRemark"
          value={form.buildRemark}
          rows={3}
          maxLength={200}
          placeholder="如准入登记、走线要求、夜间施工限制等"
          onChange={(value) => update("buildRemark", value)}
        />
      </FormField>
    </div>
  );
}

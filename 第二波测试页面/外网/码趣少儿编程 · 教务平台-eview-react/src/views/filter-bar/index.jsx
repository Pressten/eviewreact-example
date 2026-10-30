// Layer 4: 筛选栏（校区 / 课程 / 班级 / 关键词 / 待续费快捷）
import Select from "@/shared/Select";
import { IconPlusIcPublicSearch, IconPlusIcPublicAlert, IconPlusIcPublicResetting } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import Button from "@nce/eview-react/Button";
import { CAMPUSES, COURSES, CLASSES } from "../../mock/student.js";
import "./index.css";

export default function FilterBar({ filters, onChange, onReset }) {
  const classOptions = CLASSES.filter(
    (c) => !filters.course || c.course === filters.course
  );

  const handleCourseChange = (val) => {
    onChange({ course: val, classId: undefined });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__fields">
        <Select
          className="filter-bar__select"
          defaultLabel="全部校区"
          enableClear
          value={filters.campus}
          onChange={(v) => onChange({ campus: v })}
          data={CAMPUSES.map((o) => ({ value: o.value, text: o.label }))}
        />
        <Select
          className="filter-bar__select"
          defaultLabel="全部课程"
          enableClear
          value={filters.course}
          onChange={handleCourseChange}
          data={COURSES.map((o) => ({ value: o.value, text: o.label }))}
        />
        <Select
          className="filter-bar__select filter-bar__select--class"
          defaultLabel="全部班级"
          enableClear
          value={filters.classId}
          onChange={(v) => onChange({ classId: v })}
          data={classOptions.map((o) => ({ value: o.value, text: o.label }))}
        />
        <TextField
          className="filter-bar__search"
          placeholder="搜索学员姓名、编号、课程或联系电话"
          value={filters.keyword}
          onChange={(value) => onChange({ keyword: value })}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['#AEAEAE']} />}
        />
      </div>
      <div className="filter-bar__actions">
        <Button
          status={filters.lowHoursOnly ? "primary" : "default"}
          leftIcon={<IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="仅看待续费"
          onClick={() => onChange({ lowHoursOnly: !filters.lowHoursOnly })}
        />
        <Button leftIcon={<IconPlusIcPublicResetting iconSize="0.875rem" iconColor={['currentcolor']} />} text="重置" onClick={onReset} />
      </div>
    </div>
  );
}

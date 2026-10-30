// Layer 4: 筛选栏（校区 / 课程 / 班级 / 关键词 / 待续费快捷）
import { Select, Input, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
          placeholder="全部校区"
          allowClear
          value={filters.campus}
          onChange={(v) => onChange({ campus: v })}
          options={CAMPUSES}
        />
        <Select
          className="filter-bar__select"
          placeholder="全部课程"
          allowClear
          value={filters.course}
          onChange={handleCourseChange}
          options={COURSES}
        />
        <Select
          className="filter-bar__select filter-bar__select--class"
          placeholder="全部班级"
          allowClear
          value={filters.classId}
          onChange={(v) => onChange({ classId: v })}
          options={classOptions}
        />
        <Input
          className="filter-bar__search"
          allowClear
          placeholder="搜索学员姓名、编号、课程或联系电话"
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          suffix={<Icon name="search" size="0.875rem" color="#AEAEAE" />}
        />
      </div>
      <div className="filter-bar__actions">
        <Button
          type={filters.lowHoursOnly ? "primary" : "default"}
          icon={<Icon name="triangle-alert" size="0.875rem" />}
          onClick={() => onChange({ lowHoursOnly: !filters.lowHoursOnly })}
        >
          仅看待续费
        </Button>
        <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={onReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

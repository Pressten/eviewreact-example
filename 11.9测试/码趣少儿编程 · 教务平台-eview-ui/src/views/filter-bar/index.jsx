import Select from "eview-ui/Select";
import TextField from "eview-ui/TextField";
import Button from "eview-ui/Button";
import Icon from "@/shared/Icon";
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
          value={filters.campus}
          onChange={(v) => onChange({ campus: v })}
          options={CAMPUSES}
        />
        <Select
          className="filter-bar__select"
          defaultLabel="全部课程"
          value={filters.course}
          onChange={handleCourseChange}
          options={COURSES}
        />
        <Select
          className="filter-bar__select filter-bar__select--class"
          defaultLabel="全部班级"
          value={filters.classId}
          onChange={(v) => onChange({ classId: v })}
          options={classOptions}
        />
        <div className="filter-bar__search-wrap">
          <Icon name="search" size="0.875rem" color="#AEAEAE" style={{ marginRight: "0.25rem" }} />
          <TextField
            className="filter-bar__search"
            placeholder="搜索学员姓名、编号、课程或联系电话"
            value={filters.keyword}
            onChange={(v) => onChange({ keyword: v })}
          />
        </div>
      </div>
      <div className="filter-bar__actions">
        <Button
          status={filters.lowHoursOnly ? "primary" : "default"}
          onClick={() => onChange({ lowHoursOnly: !filters.lowHoursOnly })}
        >
          <Icon name="triangle-alert" size="0.875rem" />
          <span style={{ marginLeft: "0.25rem" }}>仅看待续费</span>
        </Button>
        <Button onClick={onReset}>
          <Icon name="rotate-ccw" size="0.875rem" />
          <span style={{ marginLeft: "0.25rem" }}>重置</span>
        </Button>
      </div>
    </div>
  );
}

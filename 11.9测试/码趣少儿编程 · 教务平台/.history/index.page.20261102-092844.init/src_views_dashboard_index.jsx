// Layer 4: 学员数据看板（课程分布饼图 / 校区分布柱图 / 周新增趋势折线）
import Chart from "../../../assets/shared/chart.jsx";
import { COURSE_DIST, CAMPUS_DIST, WEEKLY_NEW, TOTAL_STUDENTS } from "../../mock/student.js";
import "./index.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__head">
        <span className="dashboard__title">学员数据看板</span>
        <span className="dashboard__desc">课程与校区分布、近期增长趋势一览</span>
      </div>
      <div className="dashboard__grid">
        <div className="chart-panel">
          <div className="chart-panel__title">课程分布</div>
          <Chart
            name="PieChart"
            option={{
              data: COURSE_DIST,
              title: { text: "在读学员", subtext: `共 ${TOTAL_STUDENTS} 人` },
              legendPosition: "centerRight",
            }}
            style={{ height: "15rem" }}
          />
        </div>
        <div className="chart-panel">
          <div className="chart-panel__title">校区学员分布</div>
          <Chart
            name="BarChart"
            option={{ data: CAMPUS_DIST, xAxis: { data: "校区" }, yAxisTitle: "学员数" }}
            style={{ height: "15rem" }}
          />
        </div>
        <div className="chart-panel">
          <div className="chart-panel__title">近 8 周新增学员趋势</div>
          <Chart
            name="LineChart"
            option={{ data: WEEKLY_NEW, xAxis: { data: "周" }, yAxisTitle: "新增学员", smooth: true }}
            style={{ height: "15rem" }}
          />
        </div>
      </div>
    </div>
  );
}

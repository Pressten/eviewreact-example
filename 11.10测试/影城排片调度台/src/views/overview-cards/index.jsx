import StatCard from "../../components/stat-card/index.jsx";
import "./index.css";

export default function OverviewCards({ overview }) {
  const occ = overview.avgOccupancy;
  let occCls = "occ-green";
  let occColor = "#09AA71";
  if (occ < 30) { occCls = "occ-red"; occColor = "#E02128"; }
  else if (occ <= 50) { occCls = "occ-yellow"; occColor = "#F4840C"; }

  return (
    <div className="overview-row">
      <StatCard
        label="今日场次总数"
        value={overview.totalShowtimes}
        unit="场"
        deltaDir="up"
        deltaLabel="较昨日 +4 场"
        icon="film"
      />
      <StatCard
        label="总座位数"
        value={overview.totalSeats}
        unit="座"
        deltaDir="flat"
        deltaLabel="与昨日持平"
        icon="armchair"
      />
      <StatCard
        label="预售票房金额"
        value={overview.preSaleBoxOffice}
        unit="万元"
        deltaDir="up"
        deltaLabel="较昨日 +12.5%"
        icon="banknote"
      />
      <StatCard
        label="综合上座率"
        value={occ}
        unit="%"
        valueClassName={occCls}
        deltaDir="up"
        deltaLabel="较昨日 +8%"
        icon="percent"
      />
    </div>
  );
}

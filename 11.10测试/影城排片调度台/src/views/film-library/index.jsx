import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { films } from "../../mock/film.js";
import "./index.css";

const VERSION_COLOR = { "2D": undefined, "3D": "blue", "IMAX": "purple", "激光": "cyan" };

function occColor(occ) {
  if (occ < 30) return "#E02128";
  if (occ <= 50) return "#F4840C";
  return "#09AA71";
}

export default function FilmLibrary({ onQuickNew }) {
  return (
    <div className="film-lib-section">
      <div className="film-lib-header">
        <div className="section-title">
          <Icon name="clapperboard" size="1.25rem" color="#0067D1" />
          <span>在映影片库（按累计票房降序）</span>
        </div>
      </div>
      <div className="film-lib-grid">
        {films.map(function (f) {
          return (
            <div key={f.filmId} className="film-card" onClick={function () { onQuickNew(f); }}>
              <div className="film-poster" style={{ background: f.posterColor }}>
                <span className="film-poster-text">{f.filmName.charAt(0)}</span>
                <Tag color="gold" className="film-poster-badge" style={{ fontSize: "0.625rem", margin: 0 }}>上映{f.daysInRelease}天</Tag>
              </div>
              <div className="film-info">
                <div className="film-name-row">
                  <span className="film-name">{f.filmName}</span>
                  <span className="film-duration">{f.duration}min</span>
                </div>
                <div className="film-tags-row">
                  <Tag style={{ fontSize: "0.625rem", margin: 0 }}>{f.genre}</Tag>
                  {f.supportedVersions.map(function (v) {
                    return <Tag key={v} color={VERSION_COLOR[v]} style={{ fontSize: "0.625rem", margin: 0 }}>{v}</Tag>;
                  })}
                </div>
                <div className="film-stats-row">
                  <div className="film-stat">
                    <span className="film-stat-value">{f.cumulativeBoxOffice}</span>
                    <span className="film-stat-label">累计票房(万)</span>
                  </div>
                  <div className="film-stat">
                    <span className="film-stat-value" style={{ color: occColor(f.avgOccupancy) }}>{f.avgOccupancy}%</span>
                    <span className="film-stat-label">场均上座率</span>
                  </div>
                </div>
                <div className="film-quick-add">
                  <Icon name="plus" size="0.75rem" color="#0067D1" />
                  <span>快速排片</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

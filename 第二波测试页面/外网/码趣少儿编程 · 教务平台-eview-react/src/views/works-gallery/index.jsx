// Layer 4: 优秀作品墙（高分学员作品网格展示）
import { IconPlusIcPublicImage } from '@hui/icon-plus';
import { OUTSTANDING_WORKS } from "../../mock/student.js";
import "./index.css";

export default function WorksGallery() {
  return (
    <div className="gallery-card">
      <div className="gallery-card__head">
        <span className="gallery-card__title">
          <IconPlusIcPublicImage iconSize="0.875rem" iconColor={['currentcolor']} /> 优秀作品墙
        </span>
        <span className="gallery-card__hint">精选近期高分学员作品</span>
      </div>
      <div className="gallery-grid">
        {OUTSTANDING_WORKS.map((w, i) => (
          <div className="gallery-item" key={i}>
            <div className="gallery-item__img">
              <img src={w.image} alt={w.title} />
              <span className="gallery-item__badge">{w.rating}★</span>
            </div>
            <div className="gallery-item__body">
              <div className="gallery-item__title">{w.title}</div>
              <div className="gallery-item__author">{w.studentName} · {w.courseLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

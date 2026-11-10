import { useState, useEffect } from "react";
import { Modal, Select, TimePicker, InputNumber, Tag, Button } from "antd";
import dayjs from "dayjs";
import { Icon } from "../../../assets/shared/icon.jsx";
import { films, filmMap } from "../../mock/film.js";
import { halls } from "../../mock/hall.js";
import { toMin, fmtTime } from "../../mock/showtime.js";
import "./index.css";

const VERSION_COLOR = { "2D": undefined, "3D": "blue", "IMAX": "purple", "激光": "cyan" };

export default function NewShowtimeModal({ open, preSelectedFilmId, cinemaId, existingShowtimes, onClose, onSave }) {
  const [form, setForm] = useState({
    filmId: undefined,
    hallNo: undefined,
    version: undefined,
    startTime: null,
    normalPrice: 45,
    memberPrice: 38,
    vipPrice: 68,
  });
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);

  useEffect(function () {
    if (open) {
      setForm({
        filmId: preSelectedFilmId || undefined,
        hallNo: undefined,
        version: undefined,
        startTime: null,
        normalPrice: 45,
        memberPrice: 38,
        vipPrice: 68,
      });
      setErrors({});
      setConflicts([]);
    }
  }, [open, preSelectedFilmId]);

  function update(patch) {
    setForm(function (prev) {
      const next = Object.assign({}, prev, patch);
      if (patch.filmId) {
        next.version = undefined;
      }
      return next;
    });
    setErrors({});
    setConflicts([]);
  }

  const selectedFilm = form.filmId ? filmMap[form.filmId] : null;
  const selectedHall = form.hallNo ? halls.find(function (h) { return h.hallNo === form.hallNo; }) : null;
  const versionOptions = selectedFilm && selectedHall
    ? selectedFilm.supportedVersions.filter(function (v) { return selectedHall.supportedVersions.indexOf(v) >= 0; })
    : [];

  const endTimeText = (selectedFilm && form.startTime)
    ? fmtTime(form.startTime.hour() * 60 + form.startTime.minute() + selectedFilm.duration)
    : "--:--";

  function validate() {
    const errs = {};
    if (!form.filmId) errs.filmId = "请选择影片";
    if (!form.hallNo) errs.hallNo = "请选择影厅";
    if (!form.version) errs.version = "请选择版本";
    if (!form.startTime) errs.startTime = "请选择开始时间";
    if (!form.normalPrice && form.normalPrice !== 0) errs.normalPrice = "请输入票价";
    if (!form.memberPrice && form.memberPrice !== 0) errs.memberPrice = "请输入票价";
    if (!form.vipPrice && form.vipPrice !== 0) errs.vipPrice = "请输入票价";

    const newConflicts = [];
    if (Object.keys(errs).length === 0 && form.startTime && form.filmId && form.hallNo) {
      const startMin = form.startTime.hour() * 60 + form.startTime.minute();
      const endMin = startMin + selectedFilm.duration;
      const hallShowtimes = existingShowtimes.filter(function (st) { return st.hallNo === form.hallNo; });
      hallShowtimes.forEach(function (st) {
        const stStart = toMin(st.startTime);
        const stEnd = toMin(st.endTime);
        if (startMin < stEnd && stStart < endMin) {
          newConflicts.push("与「" + st.filmName + "」（" + st.startTime + "-" + st.endTime + "）时段重叠");
        }
        const gapBefore = startMin - stEnd;
        if (gapBefore > 0 && gapBefore < 15) {
          newConflicts.push("与上一场「" + st.filmName + "」间隔仅 " + gapBefore + " 分钟，清洁时间不足（需≥15分钟）");
        }
        const gapAfter = stStart - endMin;
        if (gapAfter > 0 && gapAfter < 15) {
          newConflicts.push("与下一场「" + st.filmName + "」间隔仅 " + gapAfter + " 分钟，清洁时间不足（需≥15分钟）");
        }
      });
    }

    setErrors(errs);
    setConflicts(newConflicts);
    return Object.keys(errs).length === 0 && newConflicts.length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const startMin = form.startTime.hour() * 60 + form.startTime.minute();
    const endMin = startMin + selectedFilm.duration;
    const hall = halls.find(function (h) { return h.hallNo === form.hallNo; });
    const newShowtime = {
      showtimeId: "ST-NEW-" + Date.now(),
      cinemaId: cinemaId,
      hallNo: form.hallNo,
      filmId: form.filmId,
      filmName: selectedFilm.filmName,
      startTime: fmtTime(startMin),
      endTime: fmtTime(endMin),
      duration: selectedFilm.duration,
      version: form.version,
      priceTiers: [
        { tier: "普通", price: form.normalPrice, sold: 0 },
        { tier: "会员", price: form.memberPrice, sold: 0 },
        { tier: "VIP", price: form.vipPrice, sold: 0 },
      ],
      seatSold: 0,
      seatTotal: hall.seatCount,
      occupancy: 0,
      status: "草稿",
    };
    onSave(newShowtime);
  }

  const filmOptions = films.map(function (f) {
    return { value: f.filmId, label: f.filmName + "（" + f.duration + "分钟 · " + f.genre + "）" };
  });
  const hallOptions = halls.map(function (h) {
    return { value: h.hallNo, label: h.hallName + "（" + h.seatCount + "座）" };
  });

  return (
    <Modal
      open={open}
      title="新建场次"
      width={580}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>确认新建</Button>,
      ]}
    >
      <div className="ns-form-grid">
        <div className="ns-field">
          <label className={"ns-form-label required"}>影片</label>
          <div className="ns-form-field">
            <Select
              value={form.filmId}
              onChange={function (v) { update({ filmId: v }); }}
              options={filmOptions}
              placeholder="请选择影片"
              style={{ width: "100%" }}
              status={errors.filmId ? "error" : undefined}
            />
            {errors.filmId && <div className="ns-form-error">{errors.filmId}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>影厅</label>
          <div className="ns-form-field">
            <Select
              value={form.hallNo}
              onChange={function (v) { update({ hallNo: v }); }}
              options={hallOptions}
              placeholder="请选择影厅"
              style={{ width: "100%" }}
              status={errors.hallNo ? "error" : undefined}
            />
            {errors.hallNo && <div className="ns-form-error">{errors.hallNo}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>放映版本</label>
          <div className="ns-form-field">
            <Select
              value={form.version}
              onChange={function (v) { update({ version: v }); }}
              options={versionOptions.map(function (v) { return { value: v, label: v }; })}
              placeholder={versionOptions.length === 0 ? "请先选择影片和影厅" : "请选择版本"}
              style={{ width: "100%" }}
              disabled={versionOptions.length === 0}
              status={errors.version ? "error" : undefined}
            />
            {errors.version && <div className="ns-form-error">{errors.version}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>开始时间</label>
          <div className="ns-form-field">
            <TimePicker
              value={form.startTime}
              onChange={function (t) { update({ startTime: t }); }}
              format="HH:mm"
              minuteStep={5}
              placeholder="09:00"
              status={errors.startTime ? "error" : undefined}
            />
            {errors.startTime && <div className="ns-form-error">{errors.startTime}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className="ns-form-label">结束时间（自动计算）</label>
          <div className="ns-end-time-display">{endTimeText}</div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>影厅座位数</label>
          <div className="ns-end-time-display">{selectedHall ? selectedHall.seatCount + " 座" : "请先选择影厅"}</div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>普通票价（元）</label>
          <div className="ns-form-field">
            <div className="ns-price-row">
              <InputNumber
                mode="spinner"
                variant="outlined"
                value={form.normalPrice}
                onChange={function (v) { update({ normalPrice: v }); }}
                min={0}
                max={500}
                placeholder="45"
                status={errors.normalPrice ? "error" : undefined}
              />
            </div>
            {errors.normalPrice && <div className="ns-form-error">{errors.normalPrice}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>会员票价（元）</label>
          <div className="ns-form-field">
            <div className="ns-price-row">
              <InputNumber
                mode="spinner"
                variant="outlined"
                value={form.memberPrice}
                onChange={function (v) { update({ memberPrice: v }); }}
                min={0}
                max={500}
                placeholder="38"
                status={errors.memberPrice ? "error" : undefined}
              />
            </div>
            {errors.memberPrice && <div className="ns-form-error">{errors.memberPrice}</div>}
          </div>
        </div>

        <div className="ns-field">
          <label className={"ns-form-label required"}>VIP 票价（元）</label>
          <div className="ns-form-field">
            <div className="ns-price-row">
              <InputNumber
                mode="spinner"
                variant="outlined"
                value={form.vipPrice}
                onChange={function (v) { update({ vipPrice: v }); }}
                min={0}
                max={500}
                placeholder="68"
                status={errors.vipPrice ? "error" : undefined}
              />
            </div>
            {errors.vipPrice && <div className="ns-form-error">{errors.vipPrice}</div>}
          </div>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="ns-conflict-box">
          {conflicts.map(function (c, i) {
            return (
              <div key={i} className="ns-conflict-line">
                <Icon name="triangle-alert" size="0.875rem" color="#E02128" />
                <span>{c}</span>
              </div>
            );
          })}
        </div>
      )}
      {conflicts.length === 0 && form.filmId && form.hallNo && form.version && form.startTime && (
        <div className="ns-ok-box">
          <Icon name="circle-check" size="0.875rem" color="#09AA71" />
          <span>校验通过，无时段冲突</span>
        </div>
      )}
    </Modal>
  );
}

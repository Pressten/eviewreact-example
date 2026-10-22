import { useState, useEffect, useRef } from "react";
import InfoBanner from "../info-banner/index.jsx";
import "./index.css";

const deployStages = [
  "初始化资源池",
  "启动DHCP和SFTP服务器",
  "生成模板与脚本",
  "启动极简部署",
  "部署完成",
];

const INITIAL_PROGRESS = 36;
const FINAL_PROGRESS = 100;
const TOTAL_DEVICES = 8;

/* Stage k lights up as progress passes k×20% (stage 1 already lit at 36%) */
const getActiveStageCount = (progress) => {
  if (progress >= 100) return 5;
  if (progress >= 80) return 4;
  if (progress >= 60) return 3;
  if (progress >= 40) return 2;
  return 1;
};

export default function DeploymentStatus({ onProgress, onComplete }) {
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [completed, setCompleted] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const tickerRef = useRef(null);

  /* Dwell 2s after entering step 4, then start the progress ticker */
  useEffect(() => {
    const startTimer = setTimeout(() => {
      tickerRef.current = setInterval(() => {
        setProgress((p) => Math.min(p + 1, FINAL_PROGRESS));
      }, 50);
    }, 2000);

    return () => {
      clearTimeout(startTimer);
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    };
  }, []);

  /* At 100%: stop the ticker, dwell 1s, then flip to the success state */
  useEffect(() => {
    if (progress < FINAL_PROGRESS) return undefined;
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    const doneTimer = setTimeout(() => {
      setCompleted(true);
      if (onComplete) onComplete();
    }, 1000);
    return () => clearTimeout(doneTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  /* Report progress upward so the device table can follow along */
  useEffect(() => {
    if (onProgress) onProgress(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const activeStageCount = getActiveStageCount(progress);

  /* Success / in-progress counters grow with the progress, not at the end */
  const successCount = Math.round(
    (TOTAL_DEVICES * (progress - INITIAL_PROGRESS)) /
      (FINAL_PROGRESS - INITIAL_PROGRESS)
  );
  const inProgressCount = TOTAL_DEVICES - successCount;

  return (
    <div className="deployment-status">
      <InfoBanner type="info" icon="circle-alert">
        1、若部署中某台设备的进度一直未达到100%，可手动单击"完成"，结束流程，在设备侧清理执行的极简部署任务，处理报错后重新启动。上线失败，请参考
        <a>在线帮助</a>
        <a
          className="dep-more-link"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? "收起" : "更多"}
        </a>
        {showMore && (
          <div className="dep-more-tips">
            <p>
              2、待上线MLAG设备组的上行端口范围需保持一致，以及设备组件peerlink需保持一致，否则可能导致设备上线失败或互联配置及peerlink口配置下发失败。
            </p>
            <p>
              3、使用内置DHCP服务时，请确保组网环境中无其它DHCP服务器，否则设备可能会上线失败。
            </p>
            <p>4、对多层级设备ZTP上线，由于设备避退算法，推荐逐层对设备上电。</p>
          </div>
        )}
      </InfoBanner>

      <div className="dep-panel">
        <div className="dep-panel-top">
          <div className="dep-rate">
            <span
              className={"dep-rate-value" + (completed ? " completed" : "")}
            >
              <span className="dep-rate-num">{progress}</span>
              <span className="dep-rate-unit">%</span>
            </span>
            <span className="dep-rate-label">部署进度</span>
          </div>
          <div className="dep-stats">
            <div className="dep-stat">
              <span className="dep-stat-num">{successCount}</span>
              <span className="dep-stat-item">
                <span className="dep-dot dep-dot-success" />
                <span className="dep-stat-text success">成功</span>
              </span>
            </div>
            <div className="dep-stat">
              <span className="dep-stat-num">0</span>
              <span className="dep-stat-item">
                <span className="dep-dot dep-dot-error" />
                <span className="dep-stat-text error">失败</span>
              </span>
            </div>
            <div className="dep-stat">
              <span className="dep-stat-num">{inProgressCount}</span>
              <span className="dep-stat-item">
                <span className="dep-dot dep-dot-progress" />
                <span className="dep-stat-text progress">部署中</span>
              </span>
            </div>
          </div>
        </div>

        <div className="dep-steps">
          {deployStages.map((label, i) => (
            <div className="dep-step" key={label}>
              <div
                className={
                  "dep-step-bar" +
                  (i < activeStageCount ? " done" : "") +
                  (completed ? " completed" : "")
                }
              />
              <div
                className={
                  "dep-step-label" + (!completed && i >= 2 ? " pending" : "")
                }
                title={label}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

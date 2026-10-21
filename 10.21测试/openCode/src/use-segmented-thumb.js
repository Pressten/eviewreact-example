import { useRef, useEffect, useCallback } from "react";

/**
 * Segmented 滑动胶囊微动效（配合 app.css 中 .ant-segmented-group::after 的 thumb）：
 * 预测量各 item 位置，onChange 时查表设置 --thumb-x / --thumb-w CSS 变量，
 * 避免运行时 getBoundingClientRect 卡顿。
 *
 * 用法：
 *   const { segWrapRef, setThumb } = useSegmentedThumb(options);
 *   <div ref={segWrapRef}>
 *     <Segmented
 *       options={options}
 *       value={value}
 *       onChange={(v) => { setValue(v); setThumb(v); }}
 *     />
 *   </div>
 */
export function useSegmentedThumb(options) {
  const segWrapRef = useRef(null);
  const itemMetrics = useRef([]);

  useEffect(() => {
    const wrap = segWrapRef.current;
    if (!wrap) return;
    const group = wrap.querySelector(".ant-segmented-group");
    if (!group) return;
    const measure = () => {
      const gr = group.getBoundingClientRect();
      const items = group.querySelectorAll(".ant-segmented-item");
      itemMetrics.current = Array.from(items).map((item) => {
        const ir = item.getBoundingClientRect();
        return { x: Math.round(ir.left - gr.left), w: Math.round(ir.width) };
      });
      const sel = group.querySelector(".ant-segmented-item-selected");
      if (sel) {
        const idx = Array.from(items).indexOf(sel);
        const m = itemMetrics.current[idx];
        if (m) {
          group.style.setProperty("--thumb-x", m.x + "px");
          group.style.setProperty("--thumb-w", m.w + "px");
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const setThumb = useCallback(
    (value) => {
      requestAnimationFrame(() => {
        const group = segWrapRef.current?.querySelector(
          ".ant-segmented-group"
        );
        if (!group) return;
        const idx = options.findIndex((o) => o.value === value);
        const m = itemMetrics.current[idx];
        if (m) {
          group.style.setProperty("--thumb-x", m.x + "px");
          group.style.setProperty("--thumb-w", m.w + "px");
        }
      });
    },
    [options]
  );

  return { segWrapRef, setThumb };
}

// icon.jsx — 图标组件（Lucide 离线回退 + icon-plus 在线联通）
import React, { useState, useEffect } from "react";

const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

const LUCIDE = {
  "bell": [["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }], ["path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }]],
  "chevron-down": [["path", { "d": "m6 9 6 6 6-6" }]],
  "chevron-up": [["path", { "d": "m18 15-6-6-6 6" }]],
  "circle-check": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m9 12 2 2 4-4" }]],
  "circle-slash": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["line", { "x1": "9", "x2": "15", "y1": "15", "y2": "9" }]],
  "clock": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]],
  "copy": [["rect", { "width": "14", "height": "14", "x": "8", "y": "8", "rx": "2", "ry": "2" }], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]],
  "download": [["path", { "d": "M12 15V3" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { "d": "m7 10 5 5 5-5" }]],
  "ellipsis": [["circle", { "cx": "12", "cy": "12", "r": "1" }], ["circle", { "cx": "19", "cy": "12", "r": "1" }], ["circle", { "cx": "5", "cy": "12", "r": "1" }]],
  "file-spreadsheet": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }], ["path", { "d": "M8 13h2" }], ["path", { "d": "M14 13h2" }], ["path", { "d": "M8 17h2" }], ["path", { "d": "M14 17h2" }]],
  "gauge": [["path", { "d": "m12 14 4-4" }], ["path", { "d": "M3.34 19a10 10 0 1 1 17.32 0" }]],
  "plus": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]],
  "refresh-cw": [["path", { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }], ["path", { "d": "M21 3v5h-5" }], ["path", { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }], ["path", { "d": "M8 16H3v5" }]],
  "search": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", { "cx": "11", "cy": "11", "r": "8" }]],
  "square-pen": [["path", { "d": "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }], ["path", { "d": "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" }]],
  "trash-2": [["path", { "d": "M10 11v6" }], ["path", { "d": "M14 11v6" }], ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { "d": "M3 6h18" }], ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]],
  "upload": [["path", { "d": "M12 3v12" }], ["path", { "d": "m17 8-5-5-5 5" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]],
  "trending-up": [["path", { "d": "M16 7h6v6" }], ["path", { "d": "M22 7l-8.5 8.5-5-5L2 17" }]],
  "trending-down": [["path", { "d": "M16 17h6v-6" }], ["path", { "d": "M22 17l-8.5-8.5-5 5L2 7" }]],
  "minus": [["path", { "d": "M5 12h14" }]],
};

const ICONS = typeof LUCIDE !== "undefined" ? LUCIDE : {};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    ICONS[name] ||
    ICONS[camelToKebab(name)] ||
    ICONS[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

let plusState = null;
let plusPromise = null;
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {};
const svgCache = new Map();

const STYLE_KEY = {
  lined: "border",
  filled: "filled",
  "two-tone": "two_colors1",
  circle: "round_bottom2",
  square: "square_bottom2",
};

function getStyleValue(styleKey) {
  return iconConfig?.style?.find((s) => s.key === styleKey)?.value || styleKey;
}

function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const m = colors.find((c) =>
      c.value.split(",").map((v) => v.trim()).includes(colorHex)
    );
    if (m) return m.id;
  }
  return defaultColorId || colors[0]?.id || "";
}

function ensurePlus() {
  if (plusPromise) return plusPromise;
  plusPromise = (async () => {
    try {
      const resp = await fetch(GET_CONFIG);
      if (!resp.ok) {
        plusState = false;
        return false;
      }
      iconConfig = await resp.json();
      const linear = iconConfig.colors?.find(
        (c) => c.type === "linear" || c.type === "通用色"
      );
      defaultColorId =
        linear?.id || iconConfig.colors?.[0]?.id || "";
      plusState = true;
      return true;
    } catch (e) {
      plusState = false;
      return false;
    }
  })();
  return plusPromise;
}

function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("系统图标"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  try {
    const resp = await fetch(
      `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
    );
    const data = await resp.json();
    const entry = (Array.isArray(data) ? data : [data]).find(
      (d) => d.icons?.length
    );
    const selected = selectBestIcon(entry?.icons || [], name);
    if (!selected?.url) return null;
    iconInfoMap[name] = { name: selected.name, url: selected.url };
    return iconInfoMap[name];
  } catch (e) {
    return null;
  }
}

async function fetchSvg(name, variant, colorHex) {
  const info = await resolveIconInfo(name);
  if (!info) return "";
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colorId = resolveColorId(variant, colorHex);
  try {
    const resp = await fetch(
      `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=16&style=${encodeURIComponent(
        styleValue
      )}&color=${encodeURIComponent(colorId)}&fileType=svg`
    );
    const data = await resp.json();
    const item = Array.isArray(data) ? data[0] : data;
    return item?.data || "";
  } catch (e) {
    return "";
  }
}

export function Icon({
  name,
  src,
  size = 16,
  color,
  className = "",
  style,
  strokeWidth = 2,
  variant = "lined",
}) {
  const [plus, setPlus] = useState(plusState);
  const [svg, setSvg] = useState(
    () => svgCache.get(`${name}&${variant}&${color}`) || ""
  );

  useEffect(() => {
    if (src) return;
    let alive = true;
    ensurePlus().then((ok) => {
      if (!alive) return;
      setPlus(ok);
      if (!ok) return;
      const key = `${name}&${variant}&${color}`;
      if (svgCache.has(key)) {
        setSvg(svgCache.get(key));
        return;
      }
      fetchSvg(name, variant, color).then((s) => {
        if (!alive) return;
        svgCache.set(key, s);
        setSvg(s);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, name, variant, color]);

  if (src) {
    return React.createElement("img", {
      src: src,
      width: size,
      height: size,
      className: className,
      alt: "",
      "aria-hidden": true,
      style: { ...style, display: "inline-block", verticalAlign: "middle" },
    });
  }

  if (plus === null) return null;

  if (plus === false) {
    const nodes = lookupIcon(name);
    if (!nodes) return null;
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        "aria-hidden": true,
        style: { ...style, stroke: color || "currentColor" },
      },
      nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { key: i, ...attrs })
      )
    );
  }

  if (!svg) {
    return React.createElement("span", {
      className,
      "aria-hidden": true,
      style: { ...style, width: size, height: size },
    });
  }

  return React.createElement("span", {
    className,
    "aria-hidden": true,
    style: { ...style, width: size, height: size },
    dangerouslySetInnerHTML: { __html: svg },
  });
}

export default Icon;

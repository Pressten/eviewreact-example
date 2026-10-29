import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

// ---- Lucide (offline fallback, table injected at build time) ----
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

// ---- icon-plus (鑱旈€? online flow, same as packages/previewpc ----
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = icon-plus available, false = fall back to Lucide
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url } (缁撴灉缂撳瓨)
const iconInfoPromiseMap = {}; // name -> 杩涜涓?Promise (in-flight 鍘婚噸)
const svgCache = new Map(); // "name&variant&color&size" -> svg text (缁撴灉缂撳瓨)
const svgPromiseMap = new Map(); // "name&variant&color&size" -> 杩涜涓?Promise (in-flight 鍘婚噸)

// 鍔ㄦ€佽幏鍙栧綋鍓?rem 鍩哄噯 px锛坔tml font-size 闅忚鍙ｅ獟浣撴煡璇㈠彉鍖栵細12/14/16/20px锛?
function getRootFontSize() {
  if (typeof document === "undefined") return 16;
  const fs = getComputedStyle(document.documentElement).fontSize;
  return parseFloat(fs) || 16;
}

// 灏?getComputedStyle 杩斿洖鐨?rgb()/rgba() 瀛楃涓茶浆涓?#RRGGBB锛岀敤浜?icon-plus API 棰滆壊鍖归厤
function rgbToHex(rgb) {
  if (!rgb) return null;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return "#" + [1, 2, 3].map(function (i) { return parseInt(m[i], 10).toString(16).padStart(2, "0"); }).join("").toUpperCase();
}

// #RGB / #RRGGBB -> [r,g,b]锛涢潪娉曡緭鍏ヨ繑鍥?null
function hexToRgb(hex) {
  if (!hex) return null;
  let h = String(hex).replace(/^#/, "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// 涓や釜 hex 棰滆壊鐨勬姘忚窛绂伙紙RGB 绌洪棿锛夛紝鐢ㄤ簬 icon-plus 棰滆壊灏辫繎鍖归厤
function colorDistance(a, b) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return Infinity;
  return Math.sqrt(
    (ra[0] - rb[0]) ** 2 + (ra[1] - rb[1]) ** 2 + (ra[2] - rb[2]) ** 2
  );
}

// getIcon 鎺ュ彛鐨?size 鍙傛暟闇€鏁板瓧 px銆傛簮 size 鍙兘鏄?rem/px/鏁板瓧锛岃浆 px 鍚庡惛闄勫埌 icon-plus 鏍囧噯灏哄銆?
const API_SIZES = [12, 14, 16, 20, 24, 32, 36, 40, 48, 60];
function toApiSize(size) {
  let n = null;
  if (size != null) {
    const m = String(size).trim().match(/(-?\d+(?:\.\d+)?)\s*(rem|px)?/i);
    if (m) {
      n = Number(m[1]);
      if (m[2] && m[2].toLowerCase() === "rem") n = n * getRootFontSize();
    }
  }
  if (n == null || Number.isNaN(n)) return 16;
  let best = API_SIZES[0], bestDiff = Math.abs(n - best);
  for (const s of API_SIZES) {
    const d = Math.abs(n - s);
    if (d < bestDiff) { bestDiff = d; best = s; }
  }
  return best;
}

// variant prop -> getConfig style key (matches previewpc's shapeToStyleKey)
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

// resolve an API color id from the requested hex against getConfig colors
// 绮剧‘鍛戒腑 鈫?灏辫繎鍖归厤锛圧GB 娆ф皬璺濈鏈€灏忥級鈫?defaultColorId 鍏滃簳
function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const target = colorHex.toUpperCase();
    // 1. 绮剧‘鍖归厤锛氭煇涓?color 鐨?value 鍒楄〃閲岀洿鎺ュ寘鍚洰鏍囪壊
    const exact = colors.find((c) =>
      String(c.value).split(",").map((v) => v.trim().toUpperCase()).includes(target)
    );
    if (exact) return exact.id;
    // 2. 灏辫繎鍖归厤锛氬彇涓庣洰鏍囪壊 RGB 璺濈鏈€灏忕殑 color锛堝鑹插€煎彇鍏朵腑鏈€杩戠殑锛?
    let best = null;
    let bestDist = Infinity;
    for (const c of colors) {
      for (const v of String(c.value).split(",")) {
        const d = colorDistance(target, v.trim());
        if (d < bestDist) { bestDist = d; best = c; }
      }
    }
    if (best) return best.id;
  }
  // 3. 鍏滃簳锛氱嚎鎬ч€氱敤鑹?鈫?璇?style 涓嬬涓€涓?鈫?绌轰覆
  return defaultColorId || colors[0]?.id || "";
}

// getConfig probe == 鑱旈€氬彲鐢ㄦ€ч獙璇?(same as previewpc fetchIconConfig)
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
        (c) => c.type === "linear" || c.type === "閫氱敤鑹?
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

// pick the best icon-plus match for a keyword (prefer system-icon group, then name contains keyword, else first)
function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("绯荤粺鍥炬爣"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

// name -> { name, url } via getIconInfo (缁撴灉缂撳瓨鍦?iconInfoMap锛涘苟鍙戝幓閲嶉潬 iconInfoPromiseMap)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  // 鍚?name 骞跺彂璇锋眰鍏变韩鍚屼竴涓繘琛屼腑 Promise锛岄伩鍏?N 涓浉鍚屽浘鏍囧悇鍙戜竴娆?getIconInfo
  if (iconInfoPromiseMap[name]) return iconInfoPromiseMap[name];
  const p = (async () => {
    try {
      const resp = await fetch(
        `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
      );
      const data = await resp.json(); // [{ keyword, icons: [{ icon_id, name, category, group[], url }] }]
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
  })();
  iconInfoPromiseMap[name] = p;
  // 钀藉畾鍚庢竻闄?in-flight 鏉＄洰锛堝け璐ヤ篃娓呴櫎锛屽厑璁镐笅娆￠噸璇曪紝涓嶆案涔呯紦瀛?rejected 缁撴灉锛?
  p.finally(() => {
    delete iconInfoPromiseMap[name];
  });
  return p;
}

// fetch the SVG text for a name via getIcon (url + size + variant + colorId + fileType=svg)
// 缁撴灉缂撳瓨鍦?svgCache锛涘苟鍙戝幓閲嶉潬 svgPromiseMap锛岀浉鍚?key 鍏变韩鍚屼竴杩涜涓?Promise
// key 鍚?size锛氫笉鍚屽昂瀵稿彇鍥炵殑 SVG 涓嶅悓锛屼笉鍙鐢?
function fetchSvg(name, variant, colorHex, size) {
  const key = `${name}&${variant}&${colorHex}&${size}`;
  if (svgCache.has(key)) return Promise.resolve(svgCache.get(key));
  if (svgPromiseMap.has(key)) return svgPromiseMap.get(key);
  const p = (async () => {
    const info = await resolveIconInfo(name);
    if (!info) return "";
    const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
    const colorId = resolveColorId(variant, colorHex);
    try {
      const resp = await fetch(
        `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=${toApiSize(size)}&style=${encodeURIComponent(
          styleValue
        )}&color=${encodeURIComponent(colorId)}&fileType=svg`
      );
      const data = await resp.json(); // { url, name, data } or array
      const item = Array.isArray(data) ? data[0] : data;
      return item?.data || ""; // raw SVG text, injected as-is
    } catch (e) {
      return "";
    }
  })();
  svgPromiseMap.set(key, p);
  // 钀藉畾鍚庡啓鍏ョ粨鏋滅紦瀛樺苟娓呴櫎 in-flight 鏉＄洰锛涚┖缁撴灉锛堝け璐ワ級涓嶇紦瀛橈紝鍏佽涓嬫閲嶈瘯
  p.then((s) => {
    if (s) svgCache.set(key, s);
  }).finally(() => {
    svgPromiseMap.delete(key);
  });
  return p;
}

// size 鈫?rem 瀛楃涓?鏁板瓧(璁捐鐢诲竷 px)鍏滃簳杞崲涓?rem
function resolveSize(size) {
  if (typeof size === "number") {
    console.warn(`[Icon] size={${size}} is a number 鈥?use rem string instead (e.g. size="${(size / 16).toFixed(4).replace(/\.?0+$/, "")}rem")`);
    const rootFontSize = getRootFontSize();
    const rem = size / rootFontSize;
    return `${parseFloat(rem.toFixed(4))}rem`;
  }
  return size;
}

export default function Icon({
  name,
  src,
  size = "1rem",
  color,
  className = "",
  style,
  strokeWidth = 2,
  variant = "lined",
  onClick,
  title,
  id,
}) {
  const resolvedSize = resolveSize(size);
  const mergedStyle = onClick ? { cursor: "pointer", ...style } : style;
  const wrapRef = useRef(null);
  const [inheritedColor, setInheritedColor] = useState(null);
  const effectiveColor = color || inheritedColor;
  const [plus, setPlus] = useState(plusState); // reuse already-probed result

    // 浠?icon-plus 妯″紡锛坧lus 灏辩华銆侀潪 src 璧勬簮銆佹棤鏄惧紡 color锛夋墠闇€瑕佺户鎵跨埗鍏冪礌棰滆壊锛?
  // Lucide / img 妯″紡棰滆壊鐢?CSS锛坈urrentColor锛夋垨灞炴€х洿鎺ュ鐞嗭紝涓嶈璁＄畻鑹层€佷笉鐩戝惉涓婚
  useLayoutEffect(function () {
    if (src || plus !== true || color) return;
    const el = wrapRef.current;
    if (!el) return; // 灏氭湭鎸傝浇锛堥娆?plus===null 杩斿洖 null锛?
    const hex = rgbToHex(getComputedStyle(el).color);
    if (hex && hex !== inheritedColor) setInheritedColor(hex);
  });

  const [svg, setSvg] = useState(
    () => svgCache.get(`${name}&${variant}&${effectiveColor}&${size}`) || ""
  );

    // 涓婚鍒囨崲鏃?<html> class 鍙樺寲涓嶄細瑙﹀彂 React 閲嶆覆鏌擄紝闇€ MutationObserver 涓诲姩鐩戝惉銆?
  // antd Button 绛夌粍浠舵湁 transition: color 0.2s锛実etComputedStyle 鍦?transition 鏈熼棿杩斿洖涓棿鑹插€硷紱
  // 绔嬪嵆璇讳竴娆¤鐩栨棤 transition 鐨勫浘鏍囷紝200ms 鍚庡啀璇讳竴娆¤鐩?Button 绛夊甫 transition 鐨勫浘鏍囥€?
  // 浠?icon-plus 妯″紡锛坧lus 灏辩华銆侀潪 src 璧勬簮銆佹棤鏄惧紡 color锛夋墠鎸傝瀵熻€咃紝渚濊禆鍙樺寲鏃堕噸寤?
  useEffect(() => {
    if (src || plus !== true || color) return;
    const readColor = () => {
      const el = wrapRef.current;
      if (!el) return;
      const hex = rgbToHex(getComputedStyle(el).color);
      if (hex) setInheritedColor(function (prev) { return hex !== prev ? hex : prev; });
    };
    let timer = null;
    const observer = new MutationObserver(() => {
      readColor();
      if (timer) clearTimeout(timer);
      timer = setTimeout(readColor, 300);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return function () {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [plus, src, color]);

  useEffect(() => {
    if (src) return; // user-asset mode: no network needed
    let alive = true;
    ensurePlus().then((ok) => {
      if (!alive) return;
      setPlus(ok);
      if (!ok) return; // getConfig probe failed 鈫?Lucide branch
      const key = `${name}&${variant}&${effectiveColor}&${size}`;
      if (svgCache.has(key)) {
        setSvg(svgCache.get(key));
        return;
      }
      fetchSvg(name, variant, effectiveColor, size).then((s) => {
        if (!alive || !s) return; // 绌虹粨鏋滐紙澶辫触锛変笉鍐欏叆 state锛屽厑璁镐笅娆￠噸璇?
        setSvg(s);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, name, variant, effectiveColor, size]);

  // user-provided asset (svg/png/jpg) via relative path 鈥?overrides name when both are set
  if (src) {
    return React.createElement("img", {
      src: src,
      id,
      width: resolvedSize,
      height: resolvedSize,
      className: className,
      alt: "",
      "aria-hidden": true,
      onClick,
      title,
      style: { ...mergedStyle, display: "inline-block", verticalAlign: "middle" },
    });
  }

  // probe not finished yet 鈫?render nothing
  if (plus === null) return null;

  // icon-plus unavailable (offline) 鈫?Lucide fallback (original behavior)
  if (plus === false) {
    const nodes = lookupIcon(name);
    if (!nodes) return null;
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: resolvedSize,
        height: resolvedSize,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        "aria-hidden": true,
        id,
        onClick,
        title,
        style: { ...mergedStyle, stroke: color || "currentColor" },
      },
      nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { key: i, ...attrs })
      )
    );
  }

  // icon-plus available 鈫?render fetched SVG text as-is (only width/height on the wrapper)
  if (!svg) {
    return React.createElement("span", {
      ref: wrapRef,
      id,
      className,
      "aria-hidden": true,
      onClick,
      title,
      style: { ...mergedStyle, width: resolvedSize, height: resolvedSize },
    });
  }

  return React.createElement("span", {
    ref: wrapRef,
    id,
    className,
    "aria-hidden": true,
    onClick,
    title,
    style: { ...mergedStyle, width: resolvedSize, height: resolvedSize },
    dangerouslySetInnerHTML: { __html: svg },
  });
}

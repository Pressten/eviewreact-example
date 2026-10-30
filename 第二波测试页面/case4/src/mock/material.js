// Layer 2: 素材库 mock — 8 张图片素材（尺寸/引用关系与楼层严格一致）
// 全部统一为实拍图风格，复用脚手架自带的两张真实照片资源（与第 2、3 张素材一致）

export const MATERIALS = [
  { id: "mat-01", name: "双11主会场KV", width: 1125, height: 560, url: "./assets/uploads/image.jpg" },
  { id: "mat-02", name: "大促氛围背景", width: 1125, height: 560, url: "./assets/uploads/background.jpg" },
  { id: "mat-03", name: "秒杀氛围图", width: 750, height: 400, url: "./assets/uploads/image.jpg" },
  { id: "mat-04", name: "倒计时横幅底图", width: 1500, height: 500, url: "./assets/uploads/background.jpg" },
  { id: "mat-05", name: "图文卡片配图", width: 800, height: 600, url: "./assets/uploads/image.jpg" },
  { id: "mat-06", name: "视频封面图", width: 1280, height: 720, url: "./assets/uploads/background.jpg" },
  { id: "mat-07", name: "优惠券背景", width: 750, height: 300, url: "./assets/uploads/image.jpg" },
  { id: "mat-08", name: "会场活动海报", width: 900, height: 500, url: "./assets/uploads/background.jpg" },
];

export function findMaterial(id) {
  return MATERIALS.find((m) => m.id === id) || null;
}

export function materialUrl(id) {
  const m = findMaterial(id);
  return m ? m.url : "";
}

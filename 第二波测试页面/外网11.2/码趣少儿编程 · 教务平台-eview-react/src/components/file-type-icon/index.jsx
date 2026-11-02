import { IconPlusIcPublicTxtFileTextured, IconPlusIcDigitalPowerDpFile, IconPlusIcPublicProjector, IconPlusIcPublicPdfFileTextured, IconPlusIcPublicImage, IconPlusIcPublicZipFile } from '@hui/icon-plus';
import "./index.css";

// 文件类型图标 — 类型映射图标 + 数据分类色（consistent mapping）
export default function FileTypeIcon({ type, size = "1.5rem", rounded = true }) {
  const ICON = {
    doc: <IconPlusIcPublicTxtFileTextured iconSize={size} iconColor={['currentcolor']} />,
    sheet: <IconPlusIcDigitalPowerDpFile iconSize={size} iconColor={['currentcolor']} />,
    slide: <IconPlusIcPublicProjector iconSize={size} iconColor={['currentcolor']} />,
    pdf: <IconPlusIcPublicPdfFileTextured iconSize={size} iconColor={['currentcolor']} />,
    image: <IconPlusIcPublicImage iconSize={size} iconColor={['currentcolor']} />,
    archive: <IconPlusIcPublicZipFile iconSize={size} iconColor={['currentcolor']} />,
  };
  return (
    <span className={`file-type-icon ft-${type}${rounded ? " ft-rounded" : ""}`}>
      {ICON[type] || ICON.doc}
    </span>
  );
}

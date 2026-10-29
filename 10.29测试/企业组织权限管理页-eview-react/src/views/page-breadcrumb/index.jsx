import Crumbs from "@/shared/Crumbs";
import { IconPlusIcDigitalPowerDpUserCluster, IconPlusIcDigitalPowerDpUserInterfaceBoard, IconPlusIcIctDocumentDownload, IconPlusIcIctNewFolder, IconPlusIcIctSecurityMatrix, IconPlusIcPublicAddMember, IconPlusIcPublicDownload, IconPlusIcPublicFolder, IconPlusIcPublicUpload } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import ActionMenu from "../../components/action-menu/index.jsx";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";

import "./index.css";

// 闈㈠寘灞?+ 椤堕儴鎿嶄綔鍖猴紙閭€璇锋垚鍛?/ 鎵归噺瀵煎叆 / 瀵煎嚭 / 鏂板缓閮ㄩ棬锛?export default function PageBreadcrumb() {
  const { setModal, selectedRowKeys, currentDept } = useApp();

  const importMenu = {
    items: [
      { key: "template", label: "涓嬭浇瀵煎叆妯℃澘", icon: <IconPlusIcIctDocumentDownload iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { type: "divider" },
      { key: "upload", label: "涓婁紶 Excel 鏂囦欢", icon: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { key: "csv", label: "涓婁紶 CSV 鏂囦欢", icon: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} /> },
    ],
  };

  const exportMenu = {
    items: [
      { key: "all", label: "鍏ㄩ儴鎴愬憳", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { key: "dept", label: "褰撳墠閮ㄩ棬鎴愬憳", icon: <IconPlusIcDigitalPowerDpUserInterfaceBoard iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { type: "divider" },
      { key: "perm", label: "鏉冮檺鐭╅樀", icon: <IconPlusIcIctSecurityMatrix iconSize="0.875rem" iconColor={['currentcolor']} /> },
    ],
  };

  return (
    <div className="page-breadcrumb">
      <div className="page-breadcrumb__left">
        <Crumbs
          data={[
            { title: "绠＄悊涓績" },
            { title: "缁勭粐涓庢潈闄? },
            { title: currentDept?.title || "鈥? },
          ]}
        />
        <h2 className="page-breadcrumb__title">
          缁勭粐涓庢潈闄?          <span className="page-breadcrumb__title-sub">缁存姢浼佷笟缁勭粐鏋舵瀯銆佹垚鍛樿处鍙蜂笌鍔熻兘鏉冮檺鐭╅樀</span>
        </h2>
      </div>
      <div className="page-breadcrumb__right">
        {selectedRowKeys.length > 0 && (
          <Button onClick={() => setModal("transfer")} text={`鎵归噺璋冨矖锛坽${selectedRowKeys.length}锛?`} leftIcon={<IconPlusIcPublicFolder iconSize="0.875rem" iconColor={['currentcolor']} />}
        )}
        <ActionMenu items={importMenu.items} onMenuClick={() => {}} placement="bottomRight">
          <Button text="鎵归噺瀵煎叆" leftIcon={<IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </ActionMenu>
        <ActionMenu items={exportMenu.items} onMenuClick={() => {}} placement="bottomRight">
          <Button text="瀵煎嚭" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </ActionMenu>
        <TipBox type="simple" content="鍦ㄦ墍閫夐儴闂ㄤ笅鍒涘缓瀛愰儴闂ㄦ垨灏忕粍">
          <Button onClick={() => setModal("department")} text="鏂板缓閮ㄩ棬" leftIcon={<IconPlusIcIctNewFolder iconSize="0.875rem" iconColor={['currentcolor']} />}
        </TipBox>
        <Button status="primary" onClick={() => setModal("invite")} text="閭€璇锋垚鍛? leftIcon={<IconPlusIcPublicAddMember iconSize="0.875rem" iconColor={['currentcolor']} />}
      </div>
    </div>
  );
}

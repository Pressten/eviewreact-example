// Layer 4: ① 顶部导航 — 平台 Logo / 主导航 / 快捷创建下拉 / 通知中心 / 用户区
// 顶部导航按规范用原生 nav 自写：选中项品牌色 + 2px 底部下划线，未选中透明下划线占位
import { useState } from "react";
import { IconPlusIcBpitTicket, IconPlusIcCarUser, IconPlusIcDigitalPowerDpFile, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicPlus, IconPlusIcPublicSetting, IconPlusIcPublicShoppingBag, IconPlusIcPublicSun } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import SimpleDropdown from "@/shared/SimpleDropdown";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = ["首页", "订单", "商品", "营销", "会员", "设置"];

export default function TopNav({ onQuickCreate }) {
  const { isDark, toggleDark } = useApp();
  const [navActive, setNavActive] = useState("订单");
  const [notice, setNotice] = useState(null);
  const notify = (text, type = "success") =>
    setNotice({ key: Date.now(), text, type });
  // 通知中心
  const [notifs, setNotifs] = useState([
    { key: "n1", title: "3 个订单超时未发货，请及时处理", time: "17:30", unread: true },
    { key: "n2", title: "SO20261019-0377 的售后申请已等待 43 小时", time: "16:20", unread: true },
    { key: "n3", title: "系统将于今晚 02:00 - 04:00 例行维护", time: "14:00", unread: false },
  ]);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    notify("通知已全部标记为已读");
  };

  const handleUserMenu = (key) => {
    if (key === "logout") {
      notify("已安全退出当前账号（演示）", "default");
    } else {
      notify(
        `已打开「${key === "profile" ? "个人中心" : "账号设置"}」（演示入口）`
      );
    }
  };

  return (
    <header className="top-nav">
      {notice ? (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
      <div className="tn-left">
        <span className="tn-logo" title="云驰电商运营台">
          <IconPlusIcPublicShoppingBag iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <span className="tn-brand">云驰电商运营台</span>
        <nav className="tn-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              className={navActive === item ? "active" : ""}
              onClick={() => setNavActive(item)}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
      <div className="tn-right">
        <SimpleDropdown
          align="left"
          trigger={
            <Button
              status="primary"
              text="快捷创建"
              leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
            />
          }
        >
          <div className="sd-item" onClick={() => onQuickCreate && onQuickCreate("order")}>
            <span className="sd-item-icon"><IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            新建订单
          </div>
          <div className="sd-item" onClick={() => onQuickCreate && onQuickCreate("coupon")}>
            <span className="sd-item-icon"><IconPlusIcBpitTicket iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            新建优惠
          </div>
          <div className="sd-item" onClick={() => onQuickCreate && onQuickCreate("product")}>
            <span className="sd-item-icon"><IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            新建商品
          </div>
        </SimpleDropdown>
        <span
          className="tn-icon-btn"
          title={isDark ? "切换为亮色模式" : "切换为暗色模式"}
          onClick={toggleDark}
        >
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </span>
        <SimpleDropdown
          align="right"
          trigger={
            <span className="tn-icon-btn" title="系统通知">
              <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
              {unreadCount > 0 && <i className="tn-dot" />}
            </span>
          }
        >
          {notifs.map((n) => (
            <div
              key={n.key}
              className={n.unread ? "tn-notif tn-notif-unread sd-notif" : "tn-notif sd-notif"}
            >
              <span className="tn-notif-title">{n.title}</span>
              <span className="tn-notif-time">{n.time}</span>
            </div>
          ))}
          <div className="sd-divider" />
          <div className="sd-item" onClick={markAllRead}>
            全部已读
          </div>
        </SimpleDropdown>
        <SimpleDropdown
          align="right"
          trigger={
            <span className="tn-user">
              <img src="/uploads/user.png" alt="用户头像" />
              <span className="tn-user-info">
                <span className="tn-user-name">林晓</span>
                <span className="tn-user-role">运营组长</span>
              </span>
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
          }
        >
          <div className="sd-item" onClick={() => handleUserMenu("profile")}>
            <span className="sd-item-icon"><IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            个人中心
          </div>
          <div className="sd-item" onClick={() => handleUserMenu("settings")}>
            <span className="sd-item-icon"><IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            账号设置
          </div>
          <div className="sd-divider" />
          <div className="sd-item" onClick={() => handleUserMenu("logout")}>
            <span className="sd-item-icon"><IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /></span>
            退出登录
          </div>
        </SimpleDropdown>
      </div>
    </header>
  );
}

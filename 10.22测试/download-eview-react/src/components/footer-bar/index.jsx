import "./index.css";

export default function FooterBar({ children }) {
  return (
    <div className="footer-bar">
      <div className="footer-bar-inner">{children}</div>
    </div>
  );
}

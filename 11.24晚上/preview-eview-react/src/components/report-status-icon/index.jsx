import './index.css';

// Official Ant Design two-tone geometry; the parent supplies ICT theme colors.
export default function ReportStatusIcon({failed = false}) {
  return <svg className="report-status-icon" viewBox="0 0 1024 1024"
    width="20" height="20" aria-hidden="true" focusable="false"
    style={{color: failed ? 'var(--icon-error)' : 'var(--icon-success)'}}>
    <use href={'/uploads/report-status-icons.svg#' + (failed ? 'close-circle' : 'check-circle')}/>
  </svg>;
}

import Tag from "@/shared/Tag";
import { IconPlusIcCarUser, IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicTelephone } from '@hui/icon-plus';
import Toggle from "@nce/eview-react/Toggle";
import SectionBlock from "../../components/section-block/index.jsx";
import { contract } from "../../mock/data.js";
import "./index.css";

function PartyCard({ label, data, accent }) {
  return (
    <div className="cb-co-party">
      <div className="cb-co-party-label">{label}</div>
      <div className="cb-co-party-name">{data.company}</div>
      <div className="cb-co-party-rows">
        <div className="cb-co-party-row">
          <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>{data.contact}{data.title ? ` · ${data.title}` : ""}</span>
        </div>
        <div className="cb-co-party-row">
          <IconPlusIcPublicTelephone iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>{data.phone}</span>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, children }) {
  return (
    <div className="cb-co-stat">
      <div className="cb-co-stat-label">{label}</div>
      <div className="cb-co-stat-value">{children}</div>
    </div>
  );
}

export default function ContractOverview() {
  return (
    <SectionBlock
      id="contract-overview"
      title="合同概览"
      icon={<IconPlusIcDigitalPowerDpDocText iconSize="1.25rem" iconColor={['#0067D1']} />}
    >
      <div className="cb-co-parties">
        <PartyCard label="甲方（客户）" data={contract.partyA} />
        <PartyCard label="乙方（平台）" data={contract.partyB} />
      </div>

      <div className="cb-co-stats">
        <StatItem label="合同类型">{contract.contractType}</StatItem>
        <StatItem label="签署方式">
          <Tag color="processing">{contract.signMethod}</Tag>
        </StatItem>
        <StatItem label="合同金额">
          <span className="cb-co-amount">{contract.amount}</span>
        </StatItem>
        <StatItem label="付款周期">
          <Tag color="cyan">{contract.paymentCycle}</Tag>
        </StatItem>
        <StatItem label="自动续约">
          <div className="cb-co-autorenew">
            <Toggle data={[false, true]} toggled={contract.autoRenewal} disabled />
            <span className={contract.autoRenewal ? "cb-co-autorenew-on" : "cb-co-autorenew-off"}>
              {contract.autoRenewal ? "已开启 · 到期前 30 天自动续约" : "未开启 · 需手动续约"}
            </span>
          </div>
        </StatItem>
      </div>
    </SectionBlock>
  );
}

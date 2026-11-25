import {useState} from 'react';
import Select from '@/shared/Select';
import Table from '@nce/eview-react/Table';
import {resultCounts} from '../../utils/report-summary.js';
import {ruleSeverities} from '../../constants/rule-severity.js';
import StatusMark from '../status-mark/index.jsx';
import OptionGroup from '../option-group/index.jsx';
import RatioMeter from '../ratio-meter/index.jsx';
import ReportRuleLink from '../report-rule-link/index.jsx';
import ReportDeviceLink from '../report-device-link/index.jsx';
import ReportSearchField from '../report-search-field/index.jsx';
import './index.css';

const ruleScopeOptions = [
  {value: 'all', text: '全部检查项'},
  ...Object.entries(ruleSeverities).map(([value, {label}]) => ({value, text: label})),
];

const resultColumn={title:'检查结果',key:'result',width:136};
const ruleColumns=[
  {title:'规则名称',key:'name',ellipsis:true},
  resultColumn,
  {title:'检查要求',key:'expected',ellipsis:true,render:value=><span className="report-cell-copy">{value}</span>},
  {title:'适用设备',key:'total',width:112,render:value=><span className="report-number">{value}<small>台</small></span>},
  {title:'不通过设备',key:'failed',width:126,sort:'desc',render:value=><span className="report-number" style={{color:value?'var(--error)':'var(--on-surface)'}}><strong>{value}</strong><small>台</small></span>},
  {title:'合规率',key:'passRate',width:136,render:(_,__,___,row)=><RatioMeter value={row?.rawData?.passed} total={row?.rawData?.total} unit="台设备"/>},
];
const deviceColumns=[
  {title:'设备名称',key:'name'},
  {title:'设备IP',key:'managementIp',width:180,render:value=><span className="report-address">{value}</span>},
  {...resultColumn,width:144},
  {title:'检查规则',key:'total',width:189.06,render:value=><span className="report-number">{value}<small>条</small></span>},
  {title:'不通过规则',key:'failed',width:212.7,sort:'desc'},
  {title:'通过规则',key:'passed',width:189.11,render:value=><span className="report-number">{value}<small>条</small></span>},
  {title:'合规率',key:'passRate',width:136,render:(_,__,___,row)=><RatioMeter value={row?.rawData?.passed} total={row?.rawData?.total} unit="条规则"/>},
];

export default function InspectionResults({items,counts,dimension,onOpenRule,onOpenDevice}) {
  const [status,setStatus]=useState(counts.failed?'failed':'all'),[query,setQuery]=useState(''),[scope,setScope]=useState('all'),[page,setPage]=useState(1),[pageSize,setPageSize]=useState(10);
  const isDevices=dimension==='devices',subject=isDevices?'设备':'检查项',needle=query.trim().toLowerCase();
  const statusOf=item=>!item.total?'unknown':item.failed>0?'failed':'passed';
  // 状态计数先按搜索和下拉条件计算，再应用选中的状态，避免把其他状态的数量清零。
  const baseRows=items.filter(item=>(scope==='all'||(isDevices?item.model:item.priority)===scope)&&
    [item.name,item.expected,item.managementIp,item.model].filter(Boolean).join(' ').toLowerCase().includes(needle));
  const filteredCounts=resultCounts(baseRows,dimension);
  const rows=baseRows.filter(item=>status==='all'||statusOf(item)===status);
  const columns=(isDevices?deviceColumns:ruleColumns).map(column=>{
    let render=column.render;
    if(column.key==='result')render=(_,__,___,row)=><StatusMark failed={(row?.rawData?.failed||0)>0} unknown={!row?.rawData?.total} showIcon={isDevices}>{!row?.rawData?.total?'无检查结果':(row?.rawData?.failed||0)>0?'不通过':'通过'}</StatusMark>;
    if(column.key==='name')render=(_,__,___,row)=>isDevices?<ReportDeviceLink className="report-rule-name" device={row?.rawData} onOpen={onOpenDevice}/>:<ReportRuleLink className="report-rule-name" rule={row?.rawData} onOpen={onOpenRule}/>;
    if(isDevices&&column.key==='failed')render=(value,__,___,row)=><span className="report-device-findings-cell"><span className="report-number"><strong>{value}</strong><small>条</small></span>{value>0&&<a href={'#device-'+row?.rawData?.id} className="report-findings-detail" aria-haspopup="dialog" onClick={event=>{event.preventDefault();onOpenDevice(row?.rawData);}}>详情</a>}</span>;
    // Table 规范：数字类（计数/合规率）右对齐，文本与操作列左对齐。
    const align=['total','failed','passed','passRate'].includes(column.key)?'right':'left';
    return {...column,align,render};
  });
  const scopeOptions=isDevices?[{value:'all',text:'全部设备'},...Array.from(new Set(items.map(item=>item.model))).filter(Boolean).sort().map(model=>({value:model,text:model}))]:
    ruleScopeOptions;
  return <section className="rule-results" aria-labelledby="rule-results-title">
    <div className="report-section-heading"><h2 id="rule-results-title">检查明细</h2></div>
    <div className="rule-results-tools">
      <OptionGroup ariaLabel={subject+'检查状态筛选'} value={status} onChange={value=>{setStatus(value);setPage(1);}}
        options={[['all','全部',filteredCounts.total],['failed','不通过',filteredCounts.failed],['passed','通过',filteredCounts.passed],...(filteredCounts.unknown?[['unknown','无检查结果',filteredCounts.unknown]]:[])]}/>
      <div className="rule-results-filters">
        <Select className="report-scope-select" aria-label={isDevices?'筛选设备型号':'筛选检查项违规等级'} value={scope} options={scopeOptions} onChange={value=>{setScope(value);setPage(1);}}/>
        <ReportSearchField className="report-search-input" ariaLabel={'搜索'+subject+'明细'}
          placeholder={isDevices?'搜索设备名称、管理IP或型号':'搜索检查项名称或检查要求'} value={query}
          onChange={value=>{setQuery(value);setPage(1);}} onSubmit={()=>setPage(1)}/>
      </div>
    </div>
    <div className="inspection-table-frame">
      <Table columns={columns} dataset={rows}
        enableZebraCrossing={false}
        enablePagination enableAutoPaging
        pagingProps={{currentPage:page,pageSize,pageSizeOptions:[10,20,50]}}
        onPageChange={currentPage=>setPage(currentPage||1)}
        onPageSizeChange={size=>{setPageSize(size||10);setPage(1);}}
        emptyTableMsg={items.length?'没有匹配的'+subject:'暂无检查数据'}
        width="unset"
        enableColumnCompareUpdate/>
    </div>
  </section>;
}

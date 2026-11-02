import Table from '@nce/eview-react/Table';
import {useRef} from 'react';
import './index.css';

// 项目统一约定：所有表头和单元格左对齐，包括数值列；保留排序与业务渲染。
const leftAlignedColumns=columns=>columns?.map(column=>({...column,align:column.align||'left',...(column.children?{children:leftAlignedColumns(column.children)}:{})}));

// antd render(value, record, index) → eview render(cell, rowData, options, row)：行数据取 row.rawData。
const adaptRender=render=>render?(cell,_rowData,_options,row)=>render(cell,row?.rawData):undefined;

// antd 列定义 → eview 列定义：dataIndex→key；无 sorter 的列显式 allowSort:false（eview 默认 true）；
// 丢弃 filters/onFilter/filteredValue（eview 列筛选是显隐列，非 antd 值过滤，无对应）。
const adaptColumn=column=>{
  const{dataIndex,key,sorter,render,filters,onFilter,filterMultiple,filteredValue,sortOrder,onHeaderCell,defaultSortOrder,...rest}=column;
  const adapted={...rest,key:key||(Array.isArray(dataIndex)?dataIndex.join('.'):dataIndex)};
  if(!sorter)adapted.allowSort=false;
  if(render)adapted.render=adaptRender(render);
  return adapted;
};

// antd Table 包装层：接收 antd 风格 props，翻译为 eview-react Table props。
// 业务调用方仍传 columns(dataIndex)/dataSource/rowKey/pagination/rowSelection/scroll/expandable/onChange/locale 等。
export default function DataTable({className='',size='large',density,fillHeight=false,style,pagination,rowSelection,columns,dataSource,rowKey,scroll,onChange,expandable,locale,rowClassName,onRow,tableLayout,sortDirections,showSorterTooltip,getPopupContainer,loading,...props}){
  const tableRef=useRef(null);
  const evColumns=leftAlignedColumns(columns?.map(adaptColumn));
  const dataset=dataSource||[];
  const enablePagination=pagination!==false&&Boolean(pagination);
  const pagingProps=enablePagination?{
    currentPage:pagination.current,
    pageSize:pagination.pageSize,
    recordCount:pagination.total??dataset.length,
    pageSizeOptions:pagination.pageSizeOptions,
  }:undefined;
  const enableCheckBox=Boolean(rowSelection);
  const maxHeight=scroll?.y;
  const emptyTableMsg=locale?.emptyText&&typeof locale.emptyText==='string'?locale.emptyText:undefined;
  const enableRowExpand=Boolean(expandable&&expandable.expandedRowRender);
  const onRowExpend=enableRowExpand?(row)=>expandable.expandedRowRender(row?.rawData):undefined;
  const handlePageChange=enablePagination&&onChange?(currentPage)=>{onChange({current:currentPage,pageSize:pagingProps.pageSize},{},{},{action:'paginate',currentDataSource:dataset});}:undefined;
  const handlePageSizeChange=enablePagination&&onChange?(pageSize)=>{onChange({current:1,pageSize},{},{},{action:'paginate',currentDataSource:dataset});}:undefined;
  const handleRowCheck=rowSelection?.onChange?(row,checkedRows)=>{
    const rows=checkedRows.map(i=>dataset[i]).filter(Boolean);
    const keys=rows.map(r=>r?.[rowKey]);
    rowSelection.onChange(keys,rows);
  }:undefined;
  const handleHeaderCheck=rowSelection?.onChange?(_checkedRows)=>{
    const rows=dataset.filter(Boolean);
    const keys=rows.map(r=>r?.[rowKey]);
    rowSelection.onChange(keys,rows);
  }:undefined;
  return <Table{...props}
    columns={evColumns}
    dataset={dataset}
    ref={tableRef}
    className={['ict-data-table',density==='comfortable'?'ict-table-comfortable':'',fillHeight?'is-fill-height':'',className].filter(Boolean).join(' ')}
    style={style}
    size={size}
    width="unset"
    enableZebraCrossing={false}
    enableColumnCompareUpdate
    enableLoading={loading}
    emptyTableMsg={emptyTableMsg}
    enablePagination={enablePagination}
    pagingProps={pagingProps}
    onPageChange={handlePageChange}
    onPageSizeChange={handlePageSizeChange}
    enableCheckBox={enableCheckBox}
    onRowCheck={handleRowCheck}
    onHeaderCheck={handleHeaderCheck}
    enableRowExpand={enableRowExpand}
    onRowExpend={onRowExpend}
    maxHeight={maxHeight}
  />;
}

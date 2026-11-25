// Minimal OOXML workbook writer for the offline browser runtime.
// Text is always stored as inlineStr; values are never evaluated as formulas.
// 容器层为内置的 STORED 模式 ZIP 写入器（无第三方依赖，CRC-32 + UTF-8 文件名），
// 替代原 JSZip 依赖：skill 的 import contract 不允许白名单外的运行时库。
const XML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL='http://schemas.openxmlformats.org/package/2006/relationships';
const MIME='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function clean(value){return String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').slice(0,32767);}
function esc(value){return clean(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
export function excelColumn(index){let name='',number=index+1;while(number>0){number--;name=String.fromCharCode(65+number%26)+name;number=Math.floor(number/26);}return name;}
function sheetName(value,used){const base=clean(value).replace(/[\\/?*\[\]:]/g,' ').replace(/^'+|'+$/g,'').trim().slice(0,31)||'Sheet';let name=base,n=1;while(used.has(name.toLowerCase())){const suffix=' '+(++n);name=base.slice(0,31-suffix.length)+suffix;}used.add(name.toLowerCase());return name;}
function cellXml(value,row,col,style){const ref=excelColumn(col)+(row+1);if(value==null||value==='')return `<c r="${ref}" s="${style}"/>`;if(typeof value==='number'&&Number.isFinite(value))return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;if(typeof value==='boolean')return `<c r="${ref}" s="${style}" t="b"><v>${value?1:0}</v></c>`;return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;}
function worksheet(sheet){
 const rows=sheet.rows||[],headerRow=sheet.headerRow||5,cols=Math.max(1,...rows.map(row=>row.length));
 if(rows.length>1048576||cols>16384)throw Error('导出数据超过 Excel 单工作表限制');
 const last=excelColumn(cols-1),lastRow=Math.max(headerRow,rows.length),freeze=sheet.freezeRows??headerRow;
 const columns=Array.from({length:cols},(_,i)=>`<col min="${i+1}" max="${i+1}" width="${Math.min(100,Math.max(8,Number(sheet.widths?.[i])||20))}" customWidth="1"/>`).join('');
 const data=rows.map((row,r)=>{const lines=Math.max(1,...row.map((value,c)=>String(value??'').split('\n').reduce((count,line)=>count+Math.max(1,Math.ceil(line.length/Math.max(8,(Number(sheet.widths?.[c])||20)*.7))),0)));let height=r===0?30:r<3?36:r===headerRow-1?30:Math.min(150,Math.max(34,lines*15+6));const cells=row.map((value,c)=>{const style=r===0?1:r<3?2:r===headerRow-1?3:r<headerRow?0:sheet.numberFormats?.[c]==='percent'?5:typeof value==='number'?4:0;return cellXml(value,r,c,style);}).join('');return `<row r="${r+1}" ht="${height}" customHeight="1">${cells}</row>`;}).join('');
 const merges=cols>1?`<mergeCells count="3"><mergeCell ref="A1:${last}1"/><mergeCell ref="A2:${last}2"/><mergeCell ref="A3:${last}3"/></mergeCells>`:'';
 return XML+`<worksheet xmlns="${NS}"><dimension ref="A1:${last}${Math.max(1,rows.length)}"/><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="${freeze}" topLeftCell="A${freeze+1}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A${freeze+1}" sqref="A${freeze+1}"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols>${columns}</cols><sheetData>${data}</sheetData><autoFilter ref="A${headerRow}:${last}${lastRow}"/>${merges}<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`;
}
const styles=XML+`<styleSheet xmlns="${NS}"><numFmts count="1"><numFmt numFmtId="164" formatCode="0.0%"/></numFmts><fonts count="3"><font><sz val="11"/><color rgb="FF263442"/><name val="Microsoft YaHei"/></font><font><b/><sz val="17"/><color rgb="FF14283D"/><name val="Microsoft YaHei"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Microsoft YaHei"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF294B6B"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><left/><right/><top/><bottom style="hair"><color rgb="FFDDE4EA"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="3" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

// ---- 内置 ZIP 写入器（STORED 模式，无压缩）----
const CRC_TABLE=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;table[n]=c>>>0;}return table;})();
const ZIP_ENCODER=new TextEncoder();
function crc32(bytes){
 let crc=0xFFFFFFFF;
 for(let i=0;i<bytes.length;i++)crc=(crc>>>8)^CRC_TABLE[(crc^bytes[i])&0xFF];
 return (crc^0xFFFFFFFF)>>>0;
}
function zipStore(entries){
 // entries: [name, xml string][]，[Content_Types].xml 必须为首条。
 const parts=[],central=[];let offset=0;
 const now=new Date();
 const dosTime=((now.getHours()<<11)|(now.getMinutes()<<5)|Math.floor(now.getSeconds()/2))&0xFFFF;
 const dosDate=(((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate())&0xFFFF;
 for(const[name,content]of entries){
  const nameBytes=ZIP_ENCODER.encode(name);
  const data=ZIP_ENCODER.encode(content);
  const crc=crc32(data);
  const local=new Uint8Array(30+nameBytes.length);
  const lv=new DataView(local.buffer);
  lv.setUint32(0,0x04034B50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x0800,true);lv.setUint16(8,0,true);
  lv.setUint16(10,dosTime,true);lv.setUint16(12,dosDate,true);
  lv.setUint32(14,crc,true);lv.setUint32(18,data.length,true);lv.setUint32(22,data.length,true);
  lv.setUint16(26,nameBytes.length,true);lv.setUint16(28,0,true);
  local.set(nameBytes,30);
  parts.push(local,data);
  const dir=new Uint8Array(46+nameBytes.length);
  const dv=new DataView(dir.buffer);
  dv.setUint32(0,0x02014B50,true);dv.setUint16(4,20,true);dv.setUint16(6,20,true);dv.setUint16(8,0x0800,true);dv.setUint16(10,0,true);
  dv.setUint16(12,dosTime,true);dv.setUint16(14,dosDate,true);
  dv.setUint32(16,crc,true);dv.setUint32(20,data.length,true);dv.setUint32(24,data.length,true);
  dv.setUint16(28,nameBytes.length,true);dv.setUint16(30,0,true);dv.setUint16(32,0,true);
  dv.setUint16(34,0,true);dv.setUint16(36,0,true);dv.setUint32(38,0,true);
  dv.setUint32(42,offset,true);
  dir.set(nameBytes,46);
  central.push(dir);
  offset+=local.length+data.length;
 }
 const centralSize=central.reduce((sum,part)=>sum+part.length,0);
 const eocd=new Uint8Array(22);
 const ev=new DataView(eocd.buffer);
 ev.setUint32(0,0x06054B50,true);ev.setUint16(4,0,true);ev.setUint16(6,0,true);
 ev.setUint16(8,central.length,true);ev.setUint16(10,central.length,true);
 ev.setUint32(12,centralSize,true);ev.setUint32(16,offset,true);ev.setUint16(20,0,true);
 const out=new Uint8Array(offset+centralSize+22);
 let position=0;
 for(const part of[...parts,...central,eocd]){out.set(part,position);position+=part.length;}
 return out;
}

export function createXlsxBytes(workbook){
 if(!workbook?.sheets?.length)throw Error('没有可导出的工作表');
 const used=new Set(),sheets=workbook.sheets.map((sheet,index)=>({...sheet,name:sheetName(sheet.name,used),id:index+1}));
 const stamp=new Date().toISOString();
 const entries=[
  ['[Content_Types].xml',XML+`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map(s=>`<Override PartName="/xl/worksheets/sheet${s.id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
  ['_rels/.rels',XML+`<Relationships xmlns="${REL}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
  ['xl/workbook.xml',XML+`<workbook xmlns="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheets.map(s=>`<sheet name="${esc(s.name)}" sheetId="${s.id}" r:id="rId${s.id}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="0"/></workbook>`],
  ['xl/_rels/workbook.xml.rels',XML+`<Relationships xmlns="${REL}">${sheets.map(s=>`<Relationship Id="rId${s.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${s.id}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
  ['xl/styles.xml',styles],
  ...sheets.map(s=>[`xl/worksheets/sheet${s.id}.xml`,worksheet(s)]),
  ['docProps/core.xml',XML+`<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(workbook.title||'配置检查报告')}</dc:title><dc:creator>Fabric AI</dc:creator><cp:lastModifiedBy>Fabric AI</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified></cp:coreProperties>`],
  ['docProps/app.xml',XML+`<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Fabric AI</Application><TitlesOfParts><vt:vector size="${sheets.length}" baseType="lpstr">${sheets.map(s=>`<vt:lpstr>${esc(s.name)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts></Properties>`],
 ];
 return zipStore(entries);
}
export function createXlsxBlob(workbook){return new Blob([createXlsxBytes(workbook)],{type:MIME});}

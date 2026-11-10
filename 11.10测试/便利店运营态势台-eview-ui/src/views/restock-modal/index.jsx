import { useEffect, useState } from "react";
import TextField from "@cloudsop/eview-ui/TextField";
import TextArea from "@cloudsop/eview-ui/TextArea";
import SelectPro from "@cloudsop/eview-ui/SelectPro";
import DialogPro from "@cloudsop/eview-ui/DialogPro";
import Button from "@cloudsop/eview-ui/Button";
import { useApp } from "../../context.jsx";
import { useToast } from "../../components/toast/index.jsx";
import { REGIONS } from "../../mock/data.js";
import { fmtInt } from "../../utils.js";
import "./index.css";

const WAREHOUSES = REGIONS.map((r) => `${r}中心仓`);
const CATEGORIES = ["鲜食", "饮料", "休闲食品", "日用百货", "冻品乳品"];

export default function RestockModal() {
  const { restockStoreId, setRestockStoreId, stores, restockStore } = useApp();
  const notify = useToast();
  const store = stores.find((s) => s.storeId === restockStoreId);

  const [warehouse, setWarehouse] = useState(null);
  const [cats, setCats] = useState([]);
  const [remark, setRemark] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (store) {
      setWarehouse(`${store.region}中心仓`);
      setCats(["鲜食", "饮料"]);
      setRemark("");
      setErrors({});
    }
  }, [restockStoreId]);

  const handleOk = () => {
    const errs = {};
    if (!warehouse) errs.warehouse = "请选择补货仓";
    if (!cats || cats.length === 0) errs.cats = "请至少选择一个补货品类";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    restockStore(store.storeId);
    notify("success", `补货单已生成：${store.storeName} · ${warehouse} · ${cats.join("／")}`);
    setRestockStoreId(null);
  };

  return (
    <DialogPro
      isOpen={!!store}
      title={store ? `生成补货单 — ${store.storeName}` : ""}
      onClose={() => setRestockStoreId(null)}
      destroyOnClose
    >
      {store && (
        <div className="rs-modal">
          <div className="rs-summary">
            <span>
              门店编号 <b>{store.storeId}</b>
            </span>
            <span>
              当前缺货 <b className="rs-danger">{store.stockoutSku}</b> 个 SKU
            </span>
            <span>
              上次补货 <b>{store.lastRestockTime || "—"}</b>
            </span>
            <span>
              今日营业额 <b>¥{fmtInt(store.dailySales)}</b>
            </span>
          </div>
          <form className="rs-form" onSubmit={(e) => e.preventDefault()}>
            <label className="form-label required" htmlFor="rs-warehouse">
              补货仓
            </label>
            <div className="form-field">
              <SelectPro
                id="rs-warehouse"
                style={{ width: "100%" }}
                placeholder="请选择补货仓"
                value={warehouse}
                options={WAREHOUSES.map((w) => ({ value: w, text: w }))}
                onChange={(v) => {
                  setWarehouse(v);
                  setErrors((e) => ({ ...e, warehouse: "" }));
                }}
              />
              {errors.warehouse && <div className="form-error">{errors.warehouse}</div>}
            </div>

            <label className="form-label required" htmlFor="rs-cats">
              补货品类
            </label>
            <div className="form-field">
              <SelectPro
                id="rs-cats"
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择补货品类（可多选）"
                value={cats}
                options={CATEGORIES.map((c) => ({ value: c, text: c }))}
                onChange={(v) => {
                  setCats(v);
                  setErrors((e) => ({ ...e, cats: "" }));
                }}
              />
              {errors.cats && <div className="form-error">{errors.cats}</div>}
            </div>

            <label className="form-label" htmlFor="rs-remark">
              补充说明
            </label>
            <div className="form-field">
              <TextArea
                id="rs-remark"
                rows={2}
                placeholder="补充说明（选填）：如加急配送、指定到货时段等"
                className="rs-remark"
                value={remark}
                onChange={(value) => setRemark(value)}
              />
            </div>
          </form>
          <div className="rs-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button text="取消" onClick={() => setRestockStoreId(null)} />
            <Button text="确认生成" status="primary" onClick={handleOk} />
          </div>
        </div>
      )}
    </DialogPro>
  );
}

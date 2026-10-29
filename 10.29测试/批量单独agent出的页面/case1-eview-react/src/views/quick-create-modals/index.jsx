// Layer 4: 快捷创建 — 新建优惠 / 新建商品 弹窗（轻量表单，提交后进入操作动态）
import { useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Spinner from "@/shared/Spinner";
import Select from "@/shared/Select";
import InputSelect from "@/shared/InputSelect";
import DatePicker from "@/shared/DatePicker";
import { CATEGORY_LABELS } from "../../mock/order.jsx";
import "./index.css";

const COUPON_TYPES = ["满减券", "折扣券", "无门槛券"];

const EMPTY_COUPON = { name: "", type: "满减券", amount: 10, validity: null };
const EMPTY_PRODUCT = { name: "", category: null, price: null };

export default function QuickCreateModals({ active, onClose, onDone }) {
  // 新建优惠
  const [coupon, setCoupon] = useState(EMPTY_COUPON);
  const [couponErrors, setCouponErrors] = useState({});
  // 新建商品
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [productErrors, setProductErrors] = useState({});

  const setCouponField = (key, value) => {
    setCoupon((f) => ({ ...f, [key]: value }));
    setCouponErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };

  const setProductField = (key, value) => {
    setProduct((f) => ({ ...f, [key]: value }));
    setProductErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };

  const closeCoupon = () => {
    setCoupon(EMPTY_COUPON);
    setCouponErrors({});
    onClose();
  };

  const closeProduct = () => {
    setProduct(EMPTY_PRODUCT);
    setProductErrors({});
    onClose();
  };

  const submitCoupon = () => {
    const errs = {};
    if (!coupon.name.trim()) errs.name = "请输入优惠名称";
    if (!coupon.amount || coupon.amount < 1) errs.amount = "面额需不小于 1 元";
    if (!coupon.validity || !coupon.validity[0] || !coupon.validity[1]) errs.validity = "请选择有效期";
    setCouponErrors(errs);
    if (Object.keys(errs).length) return;
    onDone(
      "coupon",
      `创建优惠「${coupon.name.trim()}」（${coupon.type} · ¥${coupon.amount}）`
    );
    setCoupon(EMPTY_COUPON);
  };

  const submitProduct = () => {
    const errs = {};
    if (!product.name.trim()) errs.name = "请输入商品名称";
    if (!product.category) errs.category = "请选择商品类目";
    if (!product.price || product.price <= 0) errs.price = "请输入有效售价";
    setProductErrors(errs);
    if (Object.keys(errs).length) return;
    onDone(
      "product",
      `上架商品「${product.name.trim()}」（${CATEGORY_LABELS[product.category]} · ¥${product.price}）`
    );
    setProduct(EMPTY_PRODUCT);
  };

  return (
    <>
      <Dialog
        isOpen={active === "coupon"}
        title="新建优惠"
        size={[560, "auto"]}
        onClose={closeCoupon}
        buttons={[
          { text: "取消", onClick: closeCoupon },
          { text: "创建优惠", status: "primary", onClick: submitCoupon },
        ]}
      >
        <form
          className="fm fm-grid"
          onSubmit={(e) => {
            e.preventDefault();
            submitCoupon();
          }}
        >
          <div className="fm-field fm-field-wide">
            <label className="fm-label fm-required" htmlFor="qc-name">
              优惠名称
            </label>
            <TextField
              id="qc-name"
              value={coupon.name}
              placeholder="如：满 300 减 40"
              onChange={(v) => setCouponField("name", v)}
            />
            {couponErrors.name && <div className="fm-error">{couponErrors.name}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label" htmlFor="qc-type">
              优惠类型
            </label>
            <Select
              id="qc-type"
              style={{ width: "100%" }}
              options={COUPON_TYPES.map((t) => ({ value: t, text: t }))}
              value={coupon.type}
              onChange={(v) => setCouponField("type", v)}
            />
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="qc-amount">
              面额（元）
            </label>
            <Spinner
              id="qc-amount"
              min={1}
              max={9999}
              style={{ width: "100%" }}
              value={coupon.amount}
              onChange={(v) => setCouponField("amount", v)}
            />
            {couponErrors.amount && <div className="fm-error">{couponErrors.amount}</div>}
          </div>
          <div className="fm-field fm-field-wide">
            <label className="fm-label fm-required" htmlFor="qc-validity">
              有效期
            </label>
            <DatePicker
              id="qc-validity"
              type="date"
              format="yyyy-MM-dd"
              style={{ width: "100%" }}
              placeholder="选择有效期范围"
              range={
                coupon.validity
                  ? coupon.validity.map((d) => (d && d.toDate ? d.toDate() : d))
                  : []
              }
              onChange={(dateString, date, target) => {
                if (!date) {
                  setCouponField("validity", null);
                  return;
                }
                const dj = dayjs(date);
                if (target === "from") {
                  setCouponField("validity", [dj, coupon.validity?.[1] || dj]);
                } else if (target === "to") {
                  setCouponField("validity", [coupon.validity?.[0] || dj, dj]);
                }
              }}
              onCancelClick={() => {}}
            />
            {couponErrors.validity && <div className="fm-error">{couponErrors.validity}</div>}
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={active === "product"}
        title="新建商品"
        size={[560, "auto"]}
        onClose={closeProduct}
        buttons={[
          { text: "取消", onClick: closeProduct },
          { text: "上架商品", status: "primary", onClick: submitProduct },
        ]}
      >
        <form
          className="fm fm-grid"
          onSubmit={(e) => {
            e.preventDefault();
            submitProduct();
          }}
        >
          <div className="fm-field fm-field-wide">
            <label className="fm-label fm-required" htmlFor="qp-name">
              商品名称
            </label>
            <TextField
              id="qp-name"
              value={product.name}
              placeholder="请输入商品名称"
              onChange={(v) => setProductField("name", v)}
            />
            {productErrors.name && <div className="fm-error">{productErrors.name}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="qp-category">
              商品类目
            </label>
            <InputSelect
              id="qp-category"
              defaultLabel="搜索并选择类目"
              style={{ width: "100%" }}
              options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
                value,
                text: label,
              }))}
              value={product.category}
              onChange={(v) => setProductField("category", v)}
            />
            {productErrors.category && <div className="fm-error">{productErrors.category}</div>}
          </div>
          <div className="fm-field">
            <label className="fm-label fm-required" htmlFor="qp-price">
              售价（元）
            </label>
            <Spinner
              id="qp-price"
              min={1}
              style={{ width: "100%" }}
              value={product.price}
              onChange={(v) => setProductField("price", v)}
            />
            {productErrors.price && <div className="fm-error">{productErrors.price}</div>}
          </div>
        </form>
      </Dialog>
    </>
  );
}

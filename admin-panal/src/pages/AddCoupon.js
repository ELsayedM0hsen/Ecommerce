/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik"; 
import * as Yup from "yup"; 
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  getACoupon,
  resetState,
  updateACoupon,
} from "../features/coupon/couponSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAProduct, getProducts } from "./../features/product/productSlice";
import { format, parse } from "date-fns";

let schema = Yup.object().shape({
  start: Yup.date().required("Start Date is Required"),
  expiry: Yup.date().required("Expiry Date is Required"),
  discount: Yup.number().required("Discount Percentage is Required"),
});

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  const newCoupon = useSelector((state) => state?.coupon);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCoupon,
    productName,
    couponDiscount,
    couponStart,
    couponExpiry,
    updatedCoupon,
  } = newCoupon;
  const productState = useSelector((state) => state?.product?.products?.product);

  // CONVERT DAY
  const changeDateFormet = (date) => {
    if (!date) {
      return ""; 
    }
    const newDate = new Date(date).toLocaleDateString(); 
    const [month, day, year] = newDate.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };
  const isEndDateValid = (startDate, endDate) => {
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);
    return selectedEndDate >= selectedStartDate;
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(resetState());
      dispatch(getACoupon(getProductId));
      if (productName === undefined) {
        dispatch(getAProduct(getProductId));
      }
    }
  }, [getProductId]);

  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon Added Successfullly!");
      navigate("/admin/list-product");
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon Updated Successfullly!");
      navigate("/admin/list-product");
    } else if (
      isError &&
      productName &&
      couponDiscount &&
      couponStart &&
      couponExpiry
    ) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: productName || "",
      product: getProductId || "",
      discount: couponDiscount || "",
      start: changeDateFormet(couponStart) || "",
      expiry: changeDateFormet(couponExpiry) || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!isEndDateValid(values.start, values.expiry)) {
        toast.error("The end date must be greater than the start date");
        return;
      }
      const startDateTime = format(
        parse(`${values.start} 00:00:00`, "yyyy-MM-dd HH:mm:ss", new Date()),
        "yyyy-MM-dd HH:mm:ssXXX",
        { timeZone: "Africa/Cairo" }
      );
      const expiryDateTime = format(
        parse(`${values.expiry} 23:59:59`, "yyyy-MM-dd HH:mm:ss", new Date()),
        "yyyy-MM-dd HH:mm:ssXXX",
        { timeZone: "Africa/Cairo" }
      );

      const formattedValues = {
        ...values,
        start: startDateTime,
        expiry: expiryDateTime,
      };
      delete formattedValues.name;
      if (productName !== undefined) {
        const data = { id: getProductId, couponData: formattedValues };
        dispatch(updateACoupon(data));
      } else if (productName === undefined) {
        dispatch(createCoupon(formattedValues));
        formik.resetForm();
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Edit" : "Add"} Coupon
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
        {getProductId !== undefined ?
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Product Name"
            id="name"
            disabled
          />
          :
          <select
            className="form-control py-3 mb-3"
            name="product"
            onChange={formik.handleChange("product")}
            onBlur={formik.handleBlur("product")}
            value={formik.values.product}
            label="Select Product"
            id="product"
          >
            <option value="">Select product</option>
            {Array.isArray(productState) &&
              productState.map((i, index) => {
                return (
                  <option key={index} value={i._id}>
                    {i.title}
                  </option>
                );
              })}
          </select>
          }
          <div className="error">
            {formik.touched.product && formik.errors.product}
          </div>
        
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Discount Percentage"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          <CustomInput
            type="date"
            name="start"
            onChng={formik.handleChange("start")}
            onBlr={formik.handleBlur("start")}
            val={formik.values.start}
            label="Enter start Data"
            id="date"
            min={format(new Date(), "yyyy-MM-dd", {
              timeZone: "Africa/Cairo",
            })}
          />
          <div className="error">
            {formik.touched.start && formik.errors.start}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Enter Expiry Data"
            id="date"
            min={format(new Date(), "yyyy-MM-dd", {
              timeZone: "Africa/Cairo",
            })}
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProductId !== undefined ? "Edit" : "Add"} Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;

import { configureStore } from "@reduxjs/toolkit"; // create Redux Store

import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import colorReducer from "../features/color/colorSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import importNoteReducer from "../features/importNote/importNoteSlice";
import blogReducer from "../features/blog/blogSlice";
import couponReducer from "../features/coupon/couponSlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import uploadReducer from "../features/upload/uploadSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import bCategoryReducer from "../features/bcategory/bcategorySlice";

export const store = configureStore({
  // list Reducer
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    brand: brandReducer,
    pCategory: pCategoryReducer,
    bCategory: bCategoryReducer,
    color: colorReducer,
    blog: blogReducer,
    enquiry: enquiryReducer,
    upload: uploadReducer,
    coupon: couponReducer,
    supplier: supplierReducer,
    importNote: importNoteReducer,
  },
});
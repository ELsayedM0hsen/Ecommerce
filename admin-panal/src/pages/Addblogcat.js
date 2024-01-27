import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createBlogCategory,
  getABlogCat,
  resetState,
  updateABlogCat,
} from "../features/bcategory/bcategorySlice";

let schema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
});

const Addblogcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBCatId = location.pathname.split("/")[3];
  const newBlogCategory = useSelector((state) => state.bCategory);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBlogCategory,
    blogCatName,
    updatedBlogCategory,
  } = newBlogCategory;
  useEffect(() => {
    if (getBCatId !== undefined) {
      dispatch(getABlogCat(getBCatId));
    } else {
      dispatch(resetState());
    }
  }, [getBCatId]);

  useEffect(() => {
    if (isSuccess && createdBlogCategory) {
      toast.success("Category Added Successfullly!");
    }
    if (isSuccess && updatedBlogCategory) {
      toast.success("Category Updated Successfullly!");
      navigate("/admin/blog-category-list");
    } else if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogCatName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBCatId !== undefined) {
        const data = { id: getBCatId, blogCatData: values };
        dispatch(updateABlogCat(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });
  return (
    <div>
      <h3 className="mb-4  title">
        {getBCatId !== undefined ? "Edit" : "Add"} Blog Category
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Blog Category"
            id="blogcat"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getBCatId !== undefined ? "Edit" : "Add"} Blog Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addblogcat;

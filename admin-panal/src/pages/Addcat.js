/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createCategory,
  getAProductCategory,
  resetState,
  updateAProductCategory,
} from "../features/pcategory/pcategorySlice";
import {
  delImg,
  resetStateUpload,
  uploadImg,
} from "../features/upload/uploadSlice";
import Dropzone from "react-dropzone";

let schema = Yup.object().shape({
  title: Yup.string().required("Category name is Required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];

  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(resetState());
      dispatch(resetStateUpload());
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
      dispatch(resetStateUpload());
    }
  }, [getPCatId]);

  const newCategory = useSelector((state) => state.pCategory);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    categoryName,
    updatedCategory,
  } = newCategory;
  const { productImages } = newCategory;
  const imgState = useSelector((state) => state.upload.images);

  const deletedImageState = useSelector((state) => state.upload.deletedImage);

  console.log("deletedImageState", deletedImageState?.deletedImageId);

  useEffect(() => {
    if (isSuccess && createdCategory) {
      setTotalImagesSaveDB([]);
      toast.success("Category Added Successfullly!");
    }
    if (isSuccess && updatedCategory) {
      toast.success("Category Updated Successfullly!");

      navigate("/admin/list-category");
    } else if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const [totalImagesSaveDB, setTotalImagesSaveDB] = useState([]);

  const [imagesUploaded, setImagesUploaded] = useState([]);
  useEffect(() => {
    const img = [];
    imgState.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      });
    });
    setImagesUploaded(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img]);
  }, [imgState]);

  const [imagesProducted, setImagesProducted] = useState([]);
  useEffect(() => {
    const img = [];
    productImages.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      });
    });
    setImagesProducted(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img]);
  }, [productImages]);
  
  useEffect(() => {
    const imagesArr = totalImagesSaveDB.filter(
      (item) => item?.public_id !== deletedImageState?.deletedImageId
    );
    setTotalImagesSaveDB(imagesArr);
  }, [deletedImageState?.deletedImageId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      values.images = totalImagesSaveDB;
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
        dispatch(updateAProductCategory(data));
      } else {
        dispatch(createCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
        }, 500);
      }
    },
  });
  return (
    <div>
      <h3 className="mb-4 title">
        {getPCatId !== undefined ? "Edit" : "Add"} Category
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="nter Product Category"
            id="category"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="bg-white border-1 p-1 text-center mt-3">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="mb-0 p-4">
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showImages d-flex flex-wrap gap-4 mt-3">
            {totalImagesSaveDB?.length !== 0 &&
              totalImagesSaveDB?.map((i, j) => {
                return (
                  <div className="position-relative" key={j}>
                    <button
                      type="button"
                      onClick={() => dispatch(delImg(i.public_id))}
                      className="btn-close position-absolute"
                      style={{ top: "10px", right: "10px" }}
                    ></button>
                    <img src={i.url} alt="" width={200} height={200} />
                  </div>
                );
              })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcat;

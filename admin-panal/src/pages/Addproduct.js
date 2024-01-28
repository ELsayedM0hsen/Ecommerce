/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import Dropzone from "react-dropzone";
import {
  delImg,
  resetStateUpload,
  uploadImg,
} from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getSuppliers } from "../features/supplier/supplierSlice";

let schema = Yup.object().shape({
  title: Yup.string().required("Name cannot be empty"),
  description: Yup.string().required("Description cannot be empty"),
  price: Yup.number().required("Price cannot be empty"),
  brand: Yup.string().required("Brand cannot be empty"),
  category: Yup.string().required("Category cannot be empty"),
  tags: Yup.string().required("Tag cannot be empty"),
  color: Yup.string().required("Color cannot be empty"),
  quantity: Yup.number().required("Quantity cannot be empty"),
  size: Yup.string().required("Size cannot be empty"),
  supplierID: Yup.string().required("supplier cannot be empty"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);

  useEffect(() => {
    dispatch(resetState());
    dispatch(resetStateUpload());
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSuppliers());
  }, []);

  const brandState = useSelector((state) => state?.brand?.brands);
  const catState = useSelector((state) => state?.pCategory?.pCategories);
  const colorState = useSelector((state) => state?.color?.colors);
  const supplierState = useSelector((state) => state?.supplier?.suppliers);
  const newProduct = useSelector((state) => state?.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTags,
    productColor,
    productQuantity,
    productSize,
    supplierID,
  } = newProduct;
  const { productImages } = newProduct;
  const imgState = useSelector((state) => state.upload.images);

  const deletedImageState = useSelector((state) => state.upload.deletedImage);

  console.log("deletedImageState", deletedImageState?.deletedImageId);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      setTotalImagesSaveDB([]);
      toast.success("Product Added Successfullly!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product updated Successfullly!");
      navigate("/admin/list-product");
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
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTags || "",
      color: productColor || "",
      quantity: productQuantity || "",
      size: productSize || "",
      supplierID: supplierID || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      values.images = totalImagesSaveDB;
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
          dispatch(getBrands());
          dispatch(getCategories());
          dispatch(getColors());
        }, 2000);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-2 title">
        {getProductId !== undefined ? "Edit" : "Add"} Products
      </h3>
      <div>
        <form
          action=""
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column gap-3"
        >
          <CustomInput
            type="text"
            label="title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          <CustomInput
            type="number"
            label="price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>

          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3"
            id=""
          >
            <option value="">brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3"
            id=""
          >
            <option value="">category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3"
            id=""
          >
            <option value="">Select Tags</option>
            <option value="Featured">Featured</option>
            <option value="Popular">Popular</option>
            <option value="Special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <select
            name="color"
            onChange={formik.handleChange("color")}
            onBlur={formik.handleBlur("color")}
            value={formik.values.color}
            className="form-control py-3"
            id=""
          >
            <option value="">color</option>
            {colorState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title === "#ffffff"
                    ? "White"
                    : i.title === "#000000"
                    ? "Black"
                    : i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <CustomInput
            type="text"
            label="size"
            name="size"
            onChng={formik.handleChange("size")}
            onBlr={formik.handleBlur("size")}
            val={formik.values.size}
          />
          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div>
          <select
            name="supplierID"
            onChange={formik.handleChange("supplierID")}
            onBlur={formik.handleBlur("supplierID")}
            value={formik.values.supplierID}
            className="form-control py-3 mt-3 form-select"
            id=""
          >
            <option value="">supplierID</option>
            {supplierState.map((i, j) => {
              return (
                <option key={j} value={i._id}>
                  {i.name}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.supplierID && formik.errors.supplierID}
          </div>
          <div className="bg-white border-1 p-1 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="mb-0 p-4">
                    Select 1 or more photos you want to upload (it will take some time
                       time)
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showImages d-flex flex-wrap gap-4">
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
            className="btn btn-success border-0 rounded-3 my-3"
            type="submit"
          >
            {getProductId !== undefined ? "Edit" : "Add"} Products
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;

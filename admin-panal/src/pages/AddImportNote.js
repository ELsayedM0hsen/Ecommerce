import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createImportNote, getAImportNote, resetState, updateAImportNote } from '../features/importNote/importNoteSlice';
import { getBrands } from '../features/brand/brandSlice';
import { getSuppliers } from '../features/supplier/supplierSlice'

let schema = Yup.object().shape({
  nameSupplier: Yup.string().required("Name cannot be empty"),
  brand: Yup.string().required("Brand cannot be empty"),
  quantity: Yup.number().required("Quantity cannot be empty"),
  price: Yup.number().required("Price cannot be empty"),
});

const AddimportNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getImportNoteId = location.pathname.split("/")[3];
  const newImportNote = useSelector((state) => state.importNote);
  const { isSuccess, isError, isLoading, createdImportNote, supplierID, importNoteBrand, importNoteQuantity, importNotePrice, updatedImportNote } = newImportNote;
  useEffect(() => {
    if (getImportNoteId !== undefined) {
      dispatch(getAImportNote(getImportNoteId));
    } else {
      dispatch(resetState());
    }
  }, [getImportNoteId]);


  useEffect(() => {
    dispatch(getBrands());
    dispatch(getSuppliers());
  }, [])
  const brandState = useSelector((state) => state?.brand?.brands);
  const supplierState = useSelector((state) => state?.supplier?.suppliers);

  useEffect(() => {
    if (isSuccess && createdImportNote) {
      toast.success("Successful entry!")
    }
    if (isSuccess && updatedImportNote) {
      toast.success("Successfully updated input form!");
      navigate("/admin/list-importNote");
    }
    else
      if (isError) {
        toast.error("An error occurred!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nameSupplier: supplierID || "",
      brand: importNoteBrand || "",
      quantity: importNoteQuantity || "",
      price: importNotePrice || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getImportNoteId !== undefined) {
        const data = { id: getImportNoteId, importNoteData: values };
        dispatch(updateAImportNote(data));
      } else {
        dispatch(createImportNote(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(getBrands());
          dispatch(getSuppliers());
        }, 500);
      }
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>
        {getImportNoteId !== undefined ? "Edit" : "Create"} Entry form
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <select
            name='nameSupplier'
            onChange={formik.handleChange('nameSupplier')}
            onBlur={formik.handleBlur('nameSupplier')}
            value={formik.values.nameSupplier}
            className='form-control py-3 mt-3 form-select'
            id=''
          >
            <option value=''>Select the Supplier name</option>
            {
              supplierState.map((i, j) => {
                return (
                  <option key={j} value={i._id}>
                    {i.name}
                  </option>
                )
              })
            }
          </select>
          <div className="error">
            {formik.touched.nameSupplier && formik.errors.nameSupplier}
          </div>
          <select
            name='brand'
            onChange={formik.handleChange('brand')}
            onBlur={formik.handleBlur('brand')}
            value={formik.values.brand}
            className='form-control py-3 mt-3 form-select'
            id=''
          >
            <option value=''>Select the Brand</option>
            {
              brandState.map((i, j) => {
                return (
                  <option key={j} value={i.title}>
                    {i.title}
                  </option>
                )
              })
            }
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <CustomInput
            type="text"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
            label="Quantity"
            id="importNote"
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <CustomInput
            type="text"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
            label="Price"
            id="importNote"
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type="submit"
          >
            {getImportNoteId !== undefined ? "Edit" : "Create"} Entry form
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddimportNote

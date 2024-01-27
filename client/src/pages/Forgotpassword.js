import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { forgotPasswordToken } from "../features/user/userSlice";

let emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email should be valid")
    .required("Email is Required"),
});

const Forgotpassword = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      dispatch(forgotPasswordToken(values));
    },
  });
  return (
    <>
      <Meta title="Forgot Password" />
      <BreadCrumb title="Forgot Password" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Forgot Password?</h3>
              <p className="text-center mt-2 mb-3">
                We will send you an email to reset your password!
              </p>
              <form
                action=""
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-15"
              >
                <CustomInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <div className="error text-center">
                  {formik.touched.email && formik.errors.email}
                </div>
                <div className="mt-3 d-flex justify-content-center align-items-center gap-15">
                  <button
                    className="button border-0 btn-submit signIn"
                    type="submit"
                  >
                    Send
                  </button>
                  <Link
                    to="/login"
                    className="button border-0 btn-submit signup"
                    type="submit"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Forgotpassword;

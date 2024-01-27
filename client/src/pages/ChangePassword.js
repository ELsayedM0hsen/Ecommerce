/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetState } from "../features/user/userSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

let Schema = Yup.object().shape({
  oldPassword: Yup.string().required("Password is Required"),
  newPassword: Yup.string()
    .required("Password is Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must have at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters"
    ),
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowPasswordOld, setIsShowPasswordOld] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const authState = useSelector((state) => state?.auth);

  useEffect(() => {
    dispatch(resetState());
  }, []);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      dispatch(changePassword(values));
    },
  });
  useEffect(() => {
    if (
      authState.updatedPassword !== undefined &&
      authState.isError === false
    ) {
      navigate("/my-profile");
    }
  }, [authState]);
  return (
    <>
      <Meta title="Change Password" />
      <BreadCrumb title="Change the password" />
      <Container
        class1="login-wrapper py-5 home-wrapper-2"
      >
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Change Password</h3>
              <form
                action=""
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-15"
              >
                <div className="custom-input-password">
                  <CustomInput
                    type={isShowPasswordOld ? "text" : "password"}
                    name="oldPassword"
                    placeholder="old Password"
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange("oldPassword")}
                    onBlur={formik.handleBlur("oldPassword")}
                  />
                  <div className="error">
                    {formik.touched.oldPassword && formik.errors.oldPassword}
                  </div>
                  <span
                    onClick={() => setIsShowPasswordOld(!isShowPasswordOld)}
                  >
                    {isShowPasswordOld ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>

                <div className="custom-input-password">
                  <CustomInput
                    type={isShowPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="new Password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange("newPassword")}
                    onBlur={formik.handleBlur("newPassword")}
                  />
                  <div className="error">
                    {formik.touched.newPassword && formik.errors.newPassword}
                  </div>
                  <span onClick={() => setIsShowPassword(!isShowPassword)}>
                    {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>
                <div>
                  <Link to="/forgot-password">Forgot password?</Link>
                  <div className="mt-3 d-flex justify-content-center align-items-center gap-15">
                    <button
                      className="button border-0 signIn btn-submit"
                      type="submit"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ChangePassword;

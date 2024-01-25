import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 
import { useDispatch, useSelector } from "react-redux"; 
import { login } from '../features/auth/authSlice';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";


let schema = Yup.object().shape({
  email: Yup.string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: Yup.string()
    .required("Password is Required")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must have at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters"
    // ),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(login(values))
    },
  });

  const authState = useSelector((state) => state?.auth);
  const { user, isLoading, isSuccess, isError, message } = authState;

  useEffect(() => {
    if (!user == null || isSuccess) {
      navigate("admin");
    }
    else {
      navigate("");
    }
  }, [user, isLoading, isSuccess, isError, message])
  return (
    <div className="py-5" style={{ background: "#7985c9", minHeight: "100vh" }}>
      <div className="auth-card my-5 bg-white mx-auto p-4">
        <h3 className="text-center title">Login</h3>
        <div className="error text-center">
          {/* {message.message === 'Rejected' ? 'YOU ARE NOT AN ADMIN' : ''} */}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="email"
            name='email'
            label="Email Address"
            id="email"
            val={formik.values.email}
            onChng={formik.handleChange("email")}
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className='custom-input-password'>
            <CustomInput
              type={isShowPassword ? "text" : "password"}
              name='password'
              label="Your Password"
              id="password"
              val={formik.values.password}
              onChng={formik.handleChange("password")}
            />
            <div className="error">
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {
                isShowPassword
                  ? <FaRegEye />
                  : <FaRegEyeSlash />
              }
            </span>
          </div>

          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5 mt-3"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

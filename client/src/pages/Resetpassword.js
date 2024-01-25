import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta'; // thay doi tieu de
import Container from '../components/Container';
import CustomInput from '../components/CustomInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/user/userSlice';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from 'react';


let passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ký tự hoa, ký tự thường, số và ký tự đặc biệt"
    ),
});

const Resetpassword = () => {
  const location = useLocation();
  const getToken = location.pathname.split("/")[2];

  const [isShowPassword, setIsShowPassword] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: passwordSchema,
    onSubmit: values => {
      dispatch(resetPassword({
        token: getToken,
        password: values.password,
      }));
      navigate("/login");
    },
  });
  return (
    <>
      <Meta title='Reset Password' />
      <BreadCrumb title='Reset Mật khẩu' />
      <Container class1='login-wrapper py-5' style={{ backgroundColor: '#7985c9' }}>
        <div className='row'>
          <div className='col-12'>
            <div className='auth-card'>
              <h3 className='text-center mb-3'>Reset Mật khẩu</h3>
              <form
                action=''
                onSubmit={formik.handleSubmit}
                className='d-flex flex-column gap-15'
              >
                <div className='custom-input-password'>
                  <CustomInput
                    type={isShowPassword ? "text" : "password"}
                    name='password'
                    placeholder='Password'
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                  />
                  <div className="error text-center">
                    {formik.touched.password && formik.errors.password}
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

                {/* <CustomInput
                  type='password'
                  name='confpassword'
                  placeholder='Confirm Password'

                /> */}
                <div>
                  <div className='mt-3 d-flex justify-content-center align-items-center gap-15'>
                    <button className='button border-0 btn-submit' type='submit'>OK</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Resetpassword

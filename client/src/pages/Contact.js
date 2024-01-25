/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta"; // thay doi tieu de
import {
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import Container from "./../components/Container";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createQuery } from "../features/contact/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

let contactSchema = Yup.object().shape({
  name: Yup.string().required("Tê không được để trống"),
  email: Yup.string()
    .email("Email không khả dụng")
    .required("Email không được để trống"),
  mobile: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8,9})$/,
      "Số điện thoại không hợp lệ"
    ),
  comment: Yup.string().required("Nội dung không được để trống"),
});

const Contact = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userState = useSelector((state) => state?.auth?.user);

  const formik = useFormik({
    initialValues: {
      name: userState?.lastName && userState?.firstName
        ? `${userState.lastName} ${userState.firstName}`
        : '',
      email: userState?.email || '',
      mobile: userState?.mobile || '',
      comment: '',
    },
    validationSchema: contactSchema,
    onSubmit: values => {
      if (!userState?._id) {
        navigate('/login', { state: location.pathname })// ben login lay trong location.state, de biet duong quay ve day thay vi chuyen den trang chu
      }
      else {
        dispatch(createQuery(values));
      }
    },
  });
  return (
    <>
      <Meta title="Liên hệ" />
      <BreadCrumb title="Liên hệ" />
      <Container class1="contact-wrapper home-wrapper-2 pt-3 pb-4">
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5844.272719427907!2d105.76927121185608!3d10.029328949028537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2sCan%20Tho%20University!5e0!3m2!1sen!2s!4v1695979343895!5m2!1sen!2s"
              width="600"
              height="450"
              className="border-0 w-100"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="col-12 mt-3">
            <div className="contact-inner-wrapper d-flex justify-content-between">
              <div>
                <h3 className="contact-title mb-4">Góp ý</h3>
                <form
                  action=""
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-15"
                >
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên"
                      name="name"
                      onChange={formik.handleChange("name")}
                      onBlur={formik.handleBlur("name")}
                      value={formik.values.name}
                    />
                    <div className="error">
                      {formik.touched.name && formik.errors.name}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onChange={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      value={formik.values.email}
                    />
                    <div className="error">
                      {formik.touched.email && formik.errors.email}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Số điện thoại"
                      name="mobile"
                      onChange={formik.handleChange("mobile")}
                      onBlur={formik.handleBlur("mobile")}
                      value={formik.values.mobile}
                    />
                    <div className="error">
                      {formik.touched.mobile && formik.errors.mobile}
                    </div>
                  </div>
                  <div>
                    <textarea
                      id=""
                      className="w-100 form-control"
                      cols="30"
                      rows="4"
                      placeholder="Nội dung"
                      name="comment"
                      onChange={formik.handleChange("comment")}
                      onBlur={formik.handleBlur("comment")}
                      value={formik.values.comment}
                    />
                    <div className="error">
                      {formik.touched.comment && formik.errors.comment}
                    </div>
                  </div>
                  <div>
                    <button className="button border-0 contact-button-submit" type="submit" style={{ backgroundColor: "rgb(253, 126, 20)" }}
                    >
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <h3 className="contact-title mb-4">Hãy liên lạc với chúng tôi</h3>
                <div>
                  <ul className="ps-0">
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineHome className="fs-5" />
                      <address className="mb-0">
                        KTX Khu A - Trường Đại học Cần Thơ, Xuân Khánh, Ninh Kiều, Cần Thơ
                      </address>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <BiPhoneCall className="fs-5" />
                      <a href="tel:+84 12345678">0123456789</a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineMail className="fs-5" />
                      <a href="mailto:abc@gmail.com">ludathoc@gmail.com</a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineInfoCircle className="fs-5" />
                      <p className="mb-0">24/7</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;

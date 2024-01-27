/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import Container from "./../components/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createQuery } from "../features/contact/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

let contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is Required"),
  email: Yup.string()
    .email("Email should be valid")
    .required("Email is Required"),
  mobile: Yup.string().required("Mobile is Required"),
  // .matches(
  //   /^(84|0[3|5|7|8|9])+([0-9]{8,9})$/,
  //   "Invalid Phone number character"
  // ),
  comment: Yup.string().required("Comment is Required"),
});

const Contact = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userState = useSelector((state) => state?.auth?.user);

  const formik = useFormik({
    initialValues: {
      name:
        userState?.firstName && userState?.lastName
          ? `${userState.firstName} ${userState.lastName} `
          : "",
      email: userState?.email || "",
      mobile: userState?.mobile || "",
      comment: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
      if (!userState?._id) {
        navigate("/login", { state: location.pathname });
      } else {
        dispatch(createQuery(values));
      }
    },
  });
  return (
    <>
      <Meta title="Contact" />
      <BreadCrumb title="Contact" />
      <Container class1="contact-wrapper home-wrapper-2 pt-3 pb-4">
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18495.656231599776!2d31.31258017097579!3d30.311425371024484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14580c56bed97f1d%3A0xfe6c02bc6fc02866!2sShibin%20Al%20Qanatir%2C%20Madinet%20Shibin%20Al%20Qanater%2C%20Shibin%20el-Qanater%2C%20Al-Qalyubia%20Governorate%206335263!5e1!3m2!1sen!2seg!4v1702335407205!5m2!1sen!2seg"
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
                <h3 className="contact-title mb-4">Feedback</h3>
                <form
                  action=""
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-15"
                >
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="name"
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
                      placeholder="Phone Number"
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
                      placeholder="Your Comment"
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
                    <button
                      className="button border-0 contact-button-submit"
                      type="submit"
                      style={{ backgroundColor: "rgb(253, 126, 20)" }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <h3 className="contact-title mb-4">Please contact us</h3>
                <div>
                  <ul className="ps-0">
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineHome className="fs-5" />
                      <address className="mb-0">
                        Shibin el-Qanater Al-Qalyubia Governorate
                      </address>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <BiPhoneCall className="fs-5" />
                      <a href="tel:+20 10946842**">010946842**</a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineMail className="fs-5" />
                      <a href="mailto:abc@gmail.com">elsayedmawad01@gmail.com</a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineInfoCircle className="fs-5" />
                      <p className="mb-0">We Will Catch You Fast!!</p>
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

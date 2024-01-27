/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "./../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAnOrder, deleteUserCart } from "../features/user/userSlice";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { config } from "../utils/axiosconfig";
import axios from "axios";
import { SiRazorpay } from "react-icons/si";

let shippingSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address Details are required"),
  city: Yup.string().required("State is required"),
  mobile: Yup.string().required("Phone number can not be left blank"),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state.auth);

  const [totalAmount, setTotalAmount] = useState(null);
  const [cartProductState, setCartProductState] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    let sumPriceAfterDiscount = 0;
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      sumPriceAfterDiscount =
        sumPriceAfterDiscount +
        Number(cartState[index].quantity) * cartState[index].priceAfterDiscount;
      items.push({
        product: cartState[index].productId?._id,
        quantity: cartState[index].quantity,
        color: cartState[index].color,
        price: cartState[index].price,
        priceAfterDiscount: cartState[index].priceAfterDiscount,
      });
    }
    setTotalAmount(sumPriceAfterDiscount);
    setCartProductState(items);
  }, [cartState]);

  useEffect(() => {
    if (
      authState?.orderedProduct?.createdOrder !== null &&
      authState?.orderedProduct?.message === "SUCCESS"
    ) {
      dispatch(deleteUserCart());
      navigate("/my-orders");
    } else if (
      authState?.orderedProduct?.message === "ERR" &&
      authState?.orderedProduct?.product.length > 0
    ) {
      navigate("/cart");
    }
  }, [authState]);

  const deliveryPrice = useMemo(() => {
    if (totalAmount >= 600 && totalAmount < 1000) {
      return 50;
    }
    if (totalAmount === null || totalAmount >= 1000) {
      return 0;
    } else {
      return 100;
    }
  }, [totalAmount]);

  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      mobile: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      dispatch(
        createAnOrder({
          itemsPrice: totalAmount,
          shippingPrice: deliveryPrice,
          totalPrice: totalAmount + deliveryPrice,
          orderItems: cartProductState,
          paymentMethod:
            paymentMethod === "COD"
              ? "Payment on delivery"
              : paymentMethod === "razor-card"
              ? "Payment by Razorpay"
              : "",
          shippingInfo: formik.values,
        })
      );
    },
  });

  const loadScript = (src) => {
    return new Promise((resolve,reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      script.onerror = (error) => {
        reject(error); // Reject the promise if script loading fails
      };
      document.body.appendChild(script);
    });
  };
  const checkOutHandler = async () => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }
      const result = await axios.post(
        "http://localhost:5000/api/user/order/checkout",
        { amount: totalAmount },
        config
      );
      if (!result) {
        alert("Something Went Wrong");
        return;
      }
      const { amount, id: order_id, currency } = result.data.order;
      const options = {
        key: "rzp_test_p1jccn9dqLPagn",
        amount: amount,
        currency: currency,
        name: "F-Digitic",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          };

          const result = await axios.post(
            "http://localhost:5000/api/user/order/paymentVerification",
            data,
            config
          );

          setPaymentInfo({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          });

          dispatch(
            createAnOrder({
              itemsPrice: totalAmount,
              totalPrice: totalAmount + deliveryPrice,
              orderItems: cartProductState,
              paymentMethod:
                paymentMethod === "COD"
                  ? "Payment on delivery"
                  : paymentMethod === "razor-card"
                  ? "Payment by Razorpay"
                  : "",
              paymentInfo: paymentInfo,
              shippingInfo: formik.values,
              isPaid: true,
              paidAt: Date.now(),
            })
          );
        },
        prefill: {
          name: "EL-sayed",
          email: "elsayed@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "F-Digitic Office",
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  return (
    <>
      <Meta title={"Checkout"} />
      <BreadCrumb title="Checkout" />
      <Container class1="checkout-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-md-8">
            <div className="checkout-left-data">
              <h4 className="mb-3">Shipment Details</h4>
              <form
                action=""
                onSubmit={formik.handleSubmit}
                className="d-flex flex-wrap gap-15 justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="first Name"
                    className="form-control"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange("firstName")}
                    onBlur={formik.handleBlur("firstName")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.firstName && formik.errors.firstName}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="last Name"
                    className="form-control"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange("lastName")}
                    onBlur={formik.handleBlur("lastName")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.lastName && formik.errors.lastName}
                  </div>
                </div>
                <div className="d-flex justify-content-between gap-15 w-100">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="form-control"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange("mobile")}
                      onBlur={formik.handleBlur("mobile")}
                    />
                    <div className="error ms-2 my-1">
                      {formik.touched.mobile && formik.errors.mobile}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="City"
                      className="form-control"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange("city")}
                      onBlur={formik.handleBlur("city")}
                    />
                    <div className="error ms-2 my-1">
                      {formik.touched.city && formik.errors.city}
                    </div>
                  </div>
                </div>
                <div className="w-100 pb-3 border-bottom">
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.address && formik.errors.address}
                  </div>
                </div>
                <div className="w-100 border-bottom py-4">
                  <h4 className="mb-3">Product</h4>
                  {cartState &&
                    cartState?.map((item, index) => {
                      let discountPercent =
                        100 - (item?.priceAfterDiscount / item?.price) * 100;
                      return (
                        <div
                          className="d-flex gap-10 py-3 align-items-center border-bottom checkout-product-mobile"
                          key={index}
                        >
                          <div className="w-75 d-flex gap-30">
                            <div className="position-relative">
                              <div>
                                <span
                                  style={{ top: "-10px", right: "-10px" }}
                                  className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                                >
                                  {item?.quantity}
                                </span>
                                <img
                                  src={item?.productId?.images[0]?.url}
                                  width={100}
                                  height={100}
                                  alt="product"
                                />
                              </div>
                            </div>
                            <div>
                              <h5 className="total-price">
                                {item?.productId?.title.substr(0, 50)}
                              </h5>
                              <p className="total-price">
                                {item?.color?.title}
                              </p>
                            </div>
                          </div>
                          <div className="w-25 text-center price-product-mobile">
                            <h5
                              className="total"
                              style={{
                                color:
                                  item?.priceAfterDiscount !== item?.price
                                    ? "gray"
                                    : "red",
                              }}
                            >
                              {item?.priceAfterDiscount !== item?.price ? (
                                <del>
                                  {item?.price * item?.quantity
                                    ? (
                                        item?.price * item?.quantity
                                      ).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "EGP",
                                      })
                                    : "EGP"}
                                </del>
                              ) : item?.price * item?.quantity ? (
                                (item?.price * item?.quantity).toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "EGP",
                                  }
                                )
                              ) : (
                                "EGP"
                              )}
                            </h5>
                            {item?.priceAfterDiscount !== item?.price && (
                              <div className="d-flex gap-1 justify-content-center">
                                <h5 className="total" style={{ color: "red" }}>
                                  {item?.priceAfterDiscount * item?.quantity
                                    ? (
                                        item?.priceAfterDiscount *
                                        item?.quantity
                                      ).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "EGP",
                                      })
                                    : "EGP"}
                                </h5>
                                <h6
                                  style={{ color: "#434141", fontSize: "14px" }}
                                >{`(-${discountPercent}%)`}</h6>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center checkout-navigate-mobile">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Return to cart
                    </Link>
                    <Link to="/product" className="button button-navigate">
                      Continue shopping
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-sm-6 col-md-12 border-bottom py-4">
                <h4 className="mb-3">Payment methods</h4>
                <div className="form-check">
                  <input
                    type="radio"
                    id="COD"
                    name="payment"
                    value="COD"
                    className="me-2 form-check-input"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                    }}
                  />
                  <label htmlFor="COD">Payment on delivery</label>
                  <br />
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="razor-card"
                    className="me-2 form-check-input"
                    checked={paymentMethod === "razor-card"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                    }}
                  />
                  <label htmlFor="card">Payment by Razorpay</label>
                  <br />
                </div>
              </div>
              <div className="col-sm-6 col-md-12 border-bottom py-4">
                <h4 className="mb-3">Pay</h4>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="total">Total amount </p>
                  <p className="total-price">
                    {totalAmount
                      ? totalAmount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "EGP",
                        })
                      : "EGP"}
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">Transport fee </p>
                  <p className="mb-0 total-price">
                    {totalAmount
                      ? deliveryPrice.toLocaleString("en-US", {
                          style: "currency",
                          currency: "EGP",
                        })
                      : 0}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-center pt-4">
                <h4 className="total">into money </h4>
                <h5 className="total-price">
                  {totalAmount
                    ? (totalAmount + deliveryPrice).toLocaleString("en-US", {
                        style: "currency",
                        currency: "EGP",
                      })
                    : "EGP"}
                </h5>
              </div>
              {paymentMethod === "COD" ? (
                <button
                  className="button border-0 w-100 mt-3"
                  type="submit"
                  style={{ backgroundColor: "#fd7e14" }}
                  onClick={formik.handleSubmit}
                >
                  Order
                </button>
              ) : (
                <button
                  className="button border-0 w-100 mt-3"
                  type="submit"
                  style={{ backgroundColor: "#2e79ba" }}
                  onClick={checkOutHandler}
                >
                  <SiRazorpay className="fs-5" /> RazorPay
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;

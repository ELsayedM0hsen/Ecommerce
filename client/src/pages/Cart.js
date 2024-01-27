/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  resetState,
  updateCartProduct,
} from "../features/user/userSlice";
import StepComponent from "../components/StepComponent";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Cart = () => {
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  const [productUpdateDetail, setProductUpdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const dispatch = useDispatch();
  const userCartState = useSelector((state) => state?.auth?.cartProducts);
  console.log(userCartState);

  useEffect(() => {
    dispatch(resetState());
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    if (productUpdateDetail !== null) {
      dispatch(
        updateCartProduct({
          cartItemId: productUpdateDetail?.cartItemId,
          quantity: Number.isNaN(productUpdateDetail?.quantity)
            ? 0
            : productUpdateDetail?.quantity,
        })
      );
      setTimeout(() => {
        dispatch(getUserCart(config2));
      }, 300);
    }
  }, [productUpdateDetail]);

  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct({ id: id, config2: config2 }));
    setTimeout(() => {
      dispatch(getUserCart(config2));
    }, 200);
  };

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < userCartState?.length; index++) {
      sum =
        sum +
        Number(userCartState[index].quantity) *
          userCartState[index].priceAfterDiscount;
      setTotalAmount(sum);
    }
  }, [userCartState]);

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

  const itemsDelivery = [
    {
      title: "600 EGP",
      description: "600 EGP",
    },
    {
      title: "1000 EGP",
      description: "1000 EGP",
    },
    {
      title: "0 EGP",
      description: "0EGP or > 1000 EGP",
    },
  ];

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-4">
        <div className="row">
          <div className="col-12">
            <div
              className="p-2 mb-3"
              style={{
                border: "1px solid rgb(159 150 150)",
                borderRadius: "10px",
              }}
            >
              <h5
                className="ps-2"
                style={{ fontSize: "16px", color: "#3b4149" }}
              >
                Transport fee
              </h5>
              <StepComponent
                items={itemsDelivery}
                current={
                  deliveryPrice === 20000 ? 0 : deliveryPrice === 10000 ? 1 : 2
                }
              />
            </div>
            <div className="cart-header p-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1 mb-0 text-white fs-5">Product</h4>
              <h4 className="cart-col-2 mb-0 text-white fs-5">Price</h4>
              <h4 className="cart-col-3 mb-0 text-white fs-5">Quantity</h4>
              <h4 className="cart-col-4 mb-0 text-white fs-5">into money</h4>
            </div>
            {userCartState &&
              userCartState?.map((item, index) => {
                let discountPercent =
                  100 - (item?.priceAfterDiscount / item?.price) * 100;
                return (
                  <div
                    key={index}
                    className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                  >
                    <div className="cart-col-1 d-flex align-items-center gap-15">
                      <div className="w-25">
                        <img
                          src={item?.productId?.images[0]?.url}
                          className="img-fluid"
                          alt="product image"
                        />
                      </div>
                      <div className="w-75">
                        <p>{item?.productId?.title.substr(0, 50)}</p>
                         <p>Size: {item?.productId?.size}</p> 
                        <p className="cart-data-color d-flex gap-3">
                          Color:
                          <ul className="colors ps-0">
                            <li
                              style={{
                                backgroundColor: item?.color,
                                border: "1px solid #333",
                              }}
                            ></li>
                          </ul>
                        </p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h5
                        className="price"
                        style={{
                          color:
                            item?.priceAfterDiscount !== item?.price
                              ? "gray"
                              : "red",
                        }}
                      >
                        {item?.priceAfterDiscount !== item?.price ? (
                          <del>
                            {item?.price
                              ? (item?.price).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "EGP",
                                })
                              : "EGP"}
                          </del>
                        ) : item?.price ? (
                          (item?.price).toLocaleString("en-US", {
                            style: "currency",
                            currency: "EGP",
                          })
                        ) : (
                          "EGP"
                        )}
                      </h5>
                      {item?.priceAfterDiscount !== item?.price && (
                        <div className="d-flex gap-1">
                          <h5 className="price" style={{ color: "red" }}>
                            {item?.priceAfterDiscount
                              ? (item?.priceAfterDiscount).toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "EGP",
                                  }
                                )
                              : "0 EGP"}
                          </h5>
                          <h6
                            style={{ color: "#434141", fontSize: "14px" }}
                          >{`(-${discountPercent}%)`}</h6>
                        </div>
                      )}
                    </div>
                    <div className="cart-col-3 d-flex align-items-center gap-15">
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                        }}
                      >
                        <AiOutlineMinus
                          style={{ width: "25px", height: "35px" }}
                          onClick={() => {
                            item?.quantity > 1 &&
                              setProductUpdateDetail({
                                cartItemId: item?._id,
                                quantity: item?.quantity - 1,
                              });
                          }}
                        />
                        <input
                          type="number"
                          name={"quantity" + item?._id}
                          min={1}
                          max={item?.productId?.quantity}
                          className="form-control hide-spinner"
                          style={{
                            width: "53px",
                            height: "35px",
                            borderTop: "none",
                            borderBottom: "none",
                            background: "transparent",
                          }}
                          id={"cart" + item?._id}
                          value={item?.quantity}
                          onChange={(e) => {
                            setProductUpdateDetail({
                              cartItemId: item?._id,
                              quantity: parseInt(e.target.value, 10),
                            });
                          }}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        <AiOutlinePlus
                          style={{ width: "25px", height: "35px" }}
                          onClick={() => {
                            item?.quantity < 100 &&
                              setProductUpdateDetail({
                                cartItemId: item?._id,
                                quantity: item?.quantity + 1,
                              });
                          }}
                        />
                      </div>
                      <div>
                        <AiFillDelete
                          onClick={() => {
                            deleteACartProduct(item?._id);
                          }}
                          className="text-dark"
                        />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h5
                        className="price"
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
                              ? (item?.price * item?.quantity).toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "EGP",
                                  }
                                )
                              : "0 EGP"}
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
                        <div className="d-flex gap-1">
                          <h5 className="price" style={{ color: "red" }}>
                            {item?.priceAfterDiscount * item?.quantity
                              ? (
                                  item?.priceAfterDiscount * item?.quantity
                                ).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "EGP",
                                })
                              : "0 EGP"}
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

            <div className="col-12 py-2 mt-4">
              <div className="d-flex justify-content-between align-items-baseline toalprice-mobile">
                <Link to="/product" className="button continue-shopping-mobile">
                Continue shopping
                </Link>
                {(totalAmount !== null || totalAmount !== 0) && (
                  <div className="d-flex flex-column align-items-end">
                    <h4>{`Total amount : ${
                      userCartState?.length > 0
                        ? (totalAmount + deliveryPrice).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "EGP",
                            }
                          )
                        : "0 EGP"
                    }`}</h4>
                    <Link
                      to={userCartState?.length > 0 ? "/checkout" : ""}
                      className="button"
                      style={{ backgroundColor: "#fd7e14" }}
                    >
                      Order
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;

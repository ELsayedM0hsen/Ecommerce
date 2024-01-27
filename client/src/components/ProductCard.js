/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

import watch from "../images/watch.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { getAllCoupons } from "../features/coupon/couponSlice";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getUserProductWishlist } from "../features/user/userSlice";

const ProductCard = (props) => {
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

  const location = useLocation();
  const dispatch = useDispatch();

  const { grid, data } = props;

  const couponState = useSelector((state) => state.coupon?.coupons);
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const addedWishlistState = useSelector(
    (state) => state?.product?.addToWishlist
  );

  useEffect(() => {
    dispatch(getAllCoupons());
  }, []);

  useEffect(() => {
    dispatch(getUserProductWishlist(config2));
  }, [addedWishlistState]);

  const addToWishList = (id) => {
    dispatch(addToWishlist({ id, config2 }));
  };

  return (
    <>
      {data &&
        data?.map((item, index) => {
          let priceAfterDiscount = item?.price;
          let discountPercent = 0;
          let isShowPriceDiscount = false;
          for (let j = 0; j < couponState?.length; j++) {
            if (item._id === couponState[j].product?._id) {
              const currentDate = new Date();
              const startDate = new Date(couponState[j].start);
              const endDate = new Date(couponState[j].expiry);
              if (currentDate >= startDate && currentDate <= endDate) {
                discountPercent = couponState[j].discount;
                priceAfterDiscount =
                  (priceAfterDiscount * (100 - couponState[j].discount)) / 100;
                isShowPriceDiscount = true;
              }
              break;
            }
          }
          let alreadyAddedToWishlist = false;
          for (let i = 0; i < wishlistState?.length; i++) {
            if (item._id === wishlistState[i]?._id) {
              alreadyAddedToWishlist = true;
              break;
            }
          }
          return (
            <div
              key={index}
              className={`
            ${
              location.pathname === "/product"
                ? `gr-${grid} col-sm-6 col-xs-6 col-md-4 mt-3 home-product-card`
                : "col-xl-2-4 col-lg-3 col-md-4 col-sm-6 col-xs-6 mt-3 home-product-card"
            }`}
              disabled={item?.quantity === 0}
            >
              <div className="product-card position-relative">
                <div className="wishlist-icon position-absolute">
                  <button
                    className="border-0 bg-transparent btn-wishlist"
                    onClick={(e) => {
                      addToWishList(item?._id);
                    }}
                  >
                    {location.pathname === "/wishlist" ? (
                      <button type="button" className="btn-close"></button>
                    ) : (
                      <div>
                        {alreadyAddedToWishlist ? (
                          <FaHeart
                            className="fs-5 btn-wishlist-fill"
                            style={{ color: "red" }}
                          />
                        ) : (
                          <FaRegHeart className="fs-5 btn-wishlist-empty" />
                        )}
                      </div>
                    )}
                  </button>
                </div>
                <Link
                  to={item?.quantity !== 0 && "/product/" + item?._id}
                  className={`w-100`}
                >
                  <div className={`${grid === 12 ? "d-flex gap-3" : ""}`}>
                    <div
                      className={`product-image ${grid === 12 ? "w-25" : ""}`}
                    >
                      <img
                        src={
                          item?.images[0]?.url ? item?.images[0]?.url : watch
                        }
                        className="img-fluid mx-auto"
                        alt="product image"
                        width={160}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <img
                        src={
                          item?.images[0]?.url ? item?.images[1]?.url : watch
                        }
                        className="img-fluid mx-auto"
                        alt="product image"
                        width={160}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <div
                      className={`product-details ${grid === 12 ? "w-75" : ""}`}
                    >
                      <h6 className="brand mt-2">{item?.brand}</h6>
                      <h5 className="title mb-1"> {item?.title}</h5>
                      <ReactStars
                        count={5}
                        size={24}
                        value={Number(item?.totalrating) || 5}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p
                        style={{ wordWrap: "break-word" }}
                        className={`description ${
                          grid === 12 ? "d-block" : "d-none"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: item.description.substr(0, 330) + "...",
                        }}
                      ></p>
                      <div className="d-flex gap-1 price-on-mobile-home">
                        <p
                          className="price mb-0"
                          style={{
                            color: isShowPriceDiscount ? "gray" : "red",
                            fontSize: isShowPriceDiscount ? "14px" : "",
                          }}
                        >
                          {isShowPriceDiscount ? (
                            <del>
                              {(item?.price).toLocaleString("en-US", {
                                style: "currency",
                                currency: "EGP",
                              })}
                            </del>
                          ) : (
                            (item?.price).toLocaleString("en-US", {
                              style: "currency",
                              currency: "EGP",
                            })
                          )}
                        </p>
                        {isShowPriceDiscount && (
                          <div className="d-flex gap-1">
                            <p className="price mb-0" style={{ color: "red" }}>
                              {priceAfterDiscount
                                ? priceAfterDiscount.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "EGP",
                                  })
                                : "0 EGP"}
                            </p>
                            <h6
                              style={{ color: "#434141" }}
                            >{`(-${discountPercent}%)`}</h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ProductCard;

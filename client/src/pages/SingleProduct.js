/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import Color from "./../components/Color";
import Container from "./../components/Container";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRating,
  getAProduct,
  getAllProducts,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { addProdToCart, getOrders } from "../features/user/userSlice";
import { getUserCart } from "../features/user/userSlice";
import { getACoupon } from "../features/coupon/couponSlice";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Image } from "antd";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const SingleProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getProductId = location.pathname.split("/")[2];

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

  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [alreadyRating, setAlreadyRating] = useState(false);
  const [popularProduct, setPopularProduct] = useState([]);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState(null);

  const authState = useSelector((state) => state?.auth?.user);
  const productState = useSelector((state) => state?.product?.singleProduct);
  const productsState = useSelector(
    (state) => state?.product?.products?.product
  );
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const couponState = useSelector((state) => state?.coupon);

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(getAProduct(getProductId));
    dispatch(getACoupon(getProductId));
    dispatch(getUserCart(config2));
    dispatch(getAllProducts());
    dispatch(getOrders());
  }, [getProductId]);

  useEffect(() => {
    for (let index = 0; index < cartState?.length; index++) {
      if (getProductId === cartState[index]?.productId?._id) {
        setAlreadyAdded(true);
      }
    }
  }, [getProductId]);


  useEffect(() => {
    let data = [];
    for (let index = 0; index < productsState?.length; index++) {
      const element = productsState[index];
      if (
        element?.tags === "Popular" &&
        element?.category === productState?.category &&
        element?._id !== productState?._id
      ) {
        data.push(element);
      }
      setPopularProduct(data);
    }
  }, [productsState, productState]);

  const copyToClipboard = (text) => {
    console.log("text", text);
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const addRatingToProduct = () => {
      if (star === null) {
      toast.error("Please add star rating");
      return false;
    } else if (comment === null) {
      toast.error("Please write a review about this product.");
      return false;
    } else {
      dispatch(
        addRating({
          star: star,
          comment: comment,
          prodId: getProductId,
        })
      );
      setTimeout(() => {
        dispatch(getAProduct(getProductId));
      }, 200);
    }
    return false;
  };

  // handle price product have discount ???
  let priceAfterDiscount = productState?.price;
  let discountPercent = 0;
  let isShowPriceDiscount = false;
  if (couponState.couponDiscount) {
    const currentDate = new Date();
    const startDate = new Date(couponState?.couponStart);
    const endDate = new Date(couponState?.couponExpiry);
    if (currentDate >= startDate && currentDate <= endDate) {
      discountPercent = couponState?.couponDiscount;
      priceAfterDiscount =
        (productState?.price * (100 - couponState?.couponDiscount)) / 100;
      isShowPriceDiscount = true;
    }
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(productState?.price);

  const uploadCart = () => {
    if (!authState?._id) {
      navigate("/login", { state: location.pathname });
    } else {
      dispatch(
        addProdToCart({
          productId: productState?._id,
          color: color || productState?.color,
          quantity,
          price: productState?.price,
          priceAfterDiscount: priceAfterDiscount,
        })
      );
      navigate("/cart");
    }
  };

  const [starRating, setStarRating] = useState(5);
  const [starKey, setStarKey] = useState(0);
  useEffect(() => {
    if (productState?.totalrating && productState.totalrating !== "0") {
      setStarRating(Number(productState?.totalrating));
      setStarKey(starKey + 1);
    }
  }, [productState?.totalrating]);

  console.log(alreadyAdded);
  console.log(alreadyRating);
  console.log(starRating);
console.log(starKey);
  //Slider
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sliderKey, setSliderKey] = useState(0);

  const handleOtherProductImageClick = (index) => {
    setSelectedImageIndex(index);
    setSliderKey(sliderKey + 1);
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: selectedImageIndex,
  };


  return (
    <>
      <Meta title="Product Name" />
      <BreadCrumb title={productState?.title.substr(0, 30)} />
      <Container class1="main-product-wrapper home-wrapper-2 py-4">
        <div className="row">
          <div className="col-md-6 col-lg-7">
            <div className="main-product-image row">
              <Slider
                key={sliderKey}
                {...settings}
                beforeChange={(oldIndex, newIndex) =>
                  setSelectedImageIndex(newIndex)
                }
              >
                {productState?.images.map((item, index) => {
                  return (
                    <div key={index}>
                      <Image
                        src={item?.url}
                        alt="slider"
                        width="100%"
                        preview={true}
                        height="100%"
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className="other-prouduct-image pt-0 row">
              {productState?.images.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      cursor: "pointer",
                      maxWidth: "146px",
                      maxHeight: "122px",
                      borderRadius: "16px",
                      border:
                        selectedImageIndex === index ? "2px solid orange" : "",
                    }}
                    className="col-2-4"
                    onClick={() => handleOtherProductImageClick(index)}
                  >
                    <img
                      src={item?.url}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-6 col-lg-5 product-details-mobile">
            <div className="main-product-detail">
              <div className="border-bottom">
                <h3 className="title">{productState?.title}</h3>
              </div>
              <div className="border-bottom py-2">
                <div className="d-flex gap-15 price-product-mobile">
                  <h4
                    className="price"
                    style={{ color: isShowPriceDiscount ? "gray" : "red" }}
                  >
                    {isShowPriceDiscount ? (
                      <del>{formattedPrice}</del>
                    ) : (
                      formattedPrice
                    )}
                  </h4>
                  {isShowPriceDiscount && (
                    <div className="d-flex gap-1">
                      <h4 className="price" style={{ color: "red" }}>
                        {priceAfterDiscount
                          ? priceAfterDiscount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "EGP",
                            })
                          : "0 EGP"}
                      </h4>
                      <h6
                        style={{ color: "#434141" }}
                      >{`(-${discountPercent}%)`}</h6>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center gap-10 rating-product-mobile">
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      key={starKey}
                      count={5}
                      value={starRating}
                      edit={false}
                      size={24}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">{`${productState?.ratings?.length} review`}</p>
                  </div>
                  {alreadyRating ? (
                    <div>
                      <a
                        href="#review"
                        className="review-btn text-decoration-underline"
                      >
                        Write a review
                      </a>
                    </div>
                  ) : (
                    <div>
                      <a
                        href="#review"
                        className="review-btn text-decoration-underline"
                      >
                        See reviews
                      </a>
                    </div>
                  )}
                </div>
                <div className="d-flex">
                  <p
                    className="review-btn mt-1 mb-2 pe-2"
                    style={{ borderRight: "1px solid #333" }}
                  >{`${productState?.numViews} view`}</p>
                  <p className="review-btn mt-1 mb-2 ps-2">{`Sold ${productState?.sold}`}</p>
                </div>
              </div>
              <div className="pt-2">
                <div className="d-flex gap-10 flex-column mt-2 mb-3">
                  <h3 className="product-heading">Size :</h3>
                  <div className="d-flex flex-wrap gap-15">
                    <span className="badge border border-1 bg-white text-dark text-secondary">
                      {productState?.size}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-30 flex-row mt-2 mb-3">
                  {alreadyAdded === false && (
                    <>
                      <h3 className="product-heading">Color :</h3>
                      <Color
                        setColor={setColor}
                        colorData={productState?.color}
                      />
                    </>
                  )}
                </div>
                <div className="product-detail-quantity d-flex gap-15 align-items-center flex-row mt-2 mb-3">
                  {alreadyAdded === false && (
                    <>
                      <h3 className="product-heading">Quantity</h3>
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
                            quantity > 1 && setQuantity(quantity - 1);
                          }}
                        />
                        <input
                          type="number"
                          name=""
                          min={1}
                          max={productState?.quantity}
                          className="form-control hide-spinner"
                          style={{
                            width: "53px",
                            height: "35px",
                            borderTop: "none",
                            borderBottom: "none",
                            background: "transparent",
                          }}
                          id=""
                          onChange={(e) =>
                            setQuantity(parseInt(e.target.value, 10))
                          }
                          value={quantity}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        <AiOutlinePlus
                          style={{ width: "25px", height: "35px" }}
                          onClick={() => {
                            if (quantity >= 100) {
                              toast.error("Select up to 100 products.");
                            } else if (
                              quantity < 100 &&
                              quantity >= productState?.quantity
                            ) {
                              toast.warning(
                                "Not enough products in the system."
                              );
                            } else {
                              setQuantity(quantity + 1);
                            }
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div
                    className={
                      "d-flex justify-content-center gap-30 ms-5" + alreadyAdded
                        ? "ms-0"
                        : "ms-5"
                    }
                  >
                    <button
                      className="button border-0 cart-siProduct-mobile"
                      style={{ backgroundColor: "rgb(253, 126, 20)" }}
                      type="button"
                      onClick={() => {
                        alreadyAdded ? navigate("/cart") : uploadCart();
                      }}
                    >
                      {alreadyAdded ? "Go to cart" : "Add to cart"}
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-10 flex-column my-3">
                  <h3 className="product-heading">Shipping and Returns:</h3>
                  <p className="product-data">
                    Shipping and Returns: We ship all domestic orders within
                    ring <b>3-7 business days!</b>
                  </p>
                </div>
                <div className="d-flex gap-10 align-items-center mt-2">
                  <h3 className="product-heading">Share </h3>
                  <a
                    href="javascript:void(0);"
                    onClick={() => {
                      copyToClipboard(window.location.href);
                    }}
                  >
                    Click here to copy the link to this product for sharing
                    Share with your friends and relatives!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="description-wrapper home-wrapper-2 py-1">
        <div className="row">
          <div className="specifications d-block d-md-none col-md-5 col-lg-4 pb-3">
            <div className="p-2 p-lg-3 pt-0">
              <h4 className="text-center" style={{ fontWeight: "600" }}>
                Specifications
              </h4>
              <table className="table table-striped mb-0">
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{productState?.brand}</td>
                  </tr>
                  <tr>
                    <td>Size</td>
                    <td>{productState?.size}</td>
                  </tr>
                  <tr>
                    {/* <td>Weight</td>
                    <td>{productState?.weight}</td>
                  </tr>
                  <tr>
                    <td>Power</td>
                    <td>{productState?.power}</td>
                  </tr>
                  <tr>
                    <td>Lifespan</td>
                    <td>{productState?.lifespan}</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>{productState?.warranty}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="description col-md-7 col-lg-8">
            <h4 style={{ fontWeight: "600" }}>Describe</h4>
            <div className="bg-white p-2 p-lg-3">
              <p
                style={{ wordWrap: "break-word" }}
                dangerouslySetInnerHTML={{ __html: productState?.description }}
              ></p>
            </div>
          </div>
          <div className="specifications d-none d-md-block col-md-5 col-lg-4">
            <div className="p-2 p-lg-3 pt-0">
              <h4 className="text-center" style={{ fontWeight: "600" }}>
                Specifications
              </h4>
              <table className="table table-striped mb-0">
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{productState?.brand}</td>
                  </tr>
                  <tr>
                    <td>Size</td>
                    <td>{productState?.size}</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{productState?.weight}</td>
                  </tr>
                  <tr>
                    <td>Power</td>
                    <td>{productState?.power}</td>
                  </tr>
                  <tr>
                    <td>Lifespan</td>
                    <td>{productState?.lifespan}</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>{productState?.warranty}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="reviews-product-wrapper home-wrapper-2 py-3">
        <div className="row">
          <div className="col-12">
            <h3 id="review">Reviews</h3>
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Customers Reviews</h4>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      key={starKey}
                      count={5}
                      size={24}
                      value={starRating}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">{`${productState?.ratings?.length} Evaluate`}</p>
                  </div>
                </div>
              </div>
              <div className="review-form py-4">
                <h4>Write a Review</h4>
                <ReactStars
                  count={5}
                  size={24}
                  value={5}
                  edit={true}
                  activeColor="#ffd700"
                  onChange={(e) => {
                    setStar(e);
                  }}
                />
                <div>
                  <textarea
                    name=""
                    id=""
                    className="w-100 form-control"
                    cols="30"
                    rows="4"
                    placeholder="Review content"
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    onClick={addRatingToProduct}
                    className="button border-0 btn-review"
                    type="button"
                    style={{ backgroundColor: "rgb(253, 126, 20)" }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
              <div className="reviews mt-4">
                {productState &&
                  productState.ratings?.map((item, index) => {
                    return (
                      <div key={index} className="review">
                        <div className="d-flex gap-10 align-items-center">
                          <h6 className="mb-0">{`${item?.postedby?.firstName} ${item?.postedby?.lastName} `}</h6>
                          <ReactStars
                            key={starKey}
                            count={5}
                            size={24}
                            value={item?.star}
                            edit={false}
                            activeColor="#ffd700"
                          />
                        </div>

                        <p className="mt-3 mb-0">{item?.comment}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="section-heading">Our Popular Products</div>
          </div>
          <div className="row">
            {productsState &&
              productsState
                .filter((item) => item?.tags === "Popular")
                .map((item, index) => (
                  <ProductCard key={index} data={[item]} />
                ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;

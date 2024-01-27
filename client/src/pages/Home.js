/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import {
  addToWishlist,
  getAllProducts,
  getCategories,
} from "../features/products/productSlice";

import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import { services } from "../utils/Data";
import moment from "moment";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Image } from "antd";

import slider1 from "../images/slider1.jpg";
import slider2 from "../images/slider2.jpg";
import slider3 from "../images/slider3.jpg";
import slider4 from "../images/slider4.jpg";

// special product
import watch from "../images/watch.jpg";
import ReactStars from "react-rating-stars-component";
import { getAllCoupons } from "../features/coupon/couponSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getUserProductWishlist } from "../features/user/userSlice";
// special product end

const Home = () => {
  // this for server error at the initial req 
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const blogState = useSelector((state) => state?.blog?.blogs);
  const productState = useSelector(
    (state) => state?.product?.products?.product
  );
  const couponState = useSelector((state) => state.coupon?.coupons);
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const addedWishlistState = useSelector(
    (state) => state?.product?.addToWishlist
  );
  const pCategoryState = useSelector((state) => state?.product?.pCategories);

  useEffect(() => {
    getBlogs();
    getProducts();
    dispatch(getAllCoupons());
    dispatch(getCategories());
  }, []);

  const getBlogs = () => {
    dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    dispatch(getUserProductWishlist(config2));
  }, [addedWishlistState]);

  const addToWishList = (id) => {
    dispatch(addToWishlist({ id, config2 }));
  };
//slider images 
  const arrImagesSlider = [slider1,slider2,slider3, slider4];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };
  return (
    <>
      <Meta title="Ecommerce App" />

      <Container class1="home-wrapper-1 py-3">
        <div className="row">
          <div className="col-12">
            <Slider {...settings}>
              {arrImagesSlider.map((image, index) => {
                return (
                  <div key={index}>
                    <Image
                      src={image}
                      alt="slider"
                      width="100%"
                      preview={false}
                      height="299px"
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </Container>
      <Container class1="home-wrapper-2 py-3 home-page">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Categories</h3>
          </div>
          <div className="col-12">
            <div className="categories d-flex justify-content-between flex-wrap align-items-center">
              {pCategoryState &&
                pCategoryState.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        navigate("/product", { state: item?.title })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={item?.images[0]?.url}
                        alt="camera"
                        className="d-block"
                        style={{ height: "75px", margin: "0 auto 8px" }}
                      />
                      <p style={{ fontWeight: "600", textAlign: "center" }}>
                        {item?.title}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
      <Container class1="featured-wrapper pt-3 pb-4 home-wrapper-2 home-page">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading mb-0">Featured Collection</h3>
          </div>
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "Featured") {
                let priceAfterDiscount = item?.price;
                let discountPercent = 0;
                let isShowPriceDiscount = false;
                for (let j = 0; j < couponState.length; j++) {
                  if (item._id === couponState[j].product?._id) {
                    const currentDate = new Date();
                    const startDate = new Date(couponState[j].start);
                    const endDate = new Date(couponState[j].expiry);
                    if (currentDate >= startDate && currentDate <= endDate) {
                      discountPercent = couponState[j].discount;
                      priceAfterDiscount =
                        (priceAfterDiscount * (100 - couponState[j].discount)) /
                        100;
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
                    className="col-xl-2-4 col-lg-3 col-md-4 col-sm-6 col-xs-6 mt-3 home-product-card"
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
                        </button>
                      </div>
                      <Link
                        to={item?.quantity !== 0 && "/product/" + item?._id}
                        className="w-100"
                      >
                        <div className="product-image">
                          <img
                            src={
                              item?.images[0]?.url
                                ? item?.images[0]?.url
                                : watch
                            }
                            className="img-fluid mx-auto"
                            alt="product image"
                            width={160}
                            style={{ width: "100%", height: "100%" }}
                          />
                          <img
                            src={
                              item?.images[1]?.url
                                ? item?.images[1]?.url
                                : watch
                            }
                            className="img-fluid mx-auto"
                            alt="product image"
                            width={160}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="product-details">
                          <h6 className="brand mt-2">{item?.brand}</h6>
                          <h5 className="title mb-1"> {item?.title}</h5>
                          <ReactStars
                            count={5}
                            size={24}
                            value={Number(item?.totalrating) || 5}
                            edit={false}
                            activeColor="#ffd700"
                          />
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
                                <p
                                  className="price mb-0"
                                  style={{ color: "red" }}
                                >
                                  {priceAfterDiscount
                                    ? priceAfterDiscount.toLocaleString(
                                        "en-US",
                                        {
                                          style: "currency",
                                          currency: "EGP",
                                        }
                                      )
                                    : "0 EGP"}
                                </p>
                                <h6
                                  style={{ color: "#434141" }}
                                >{`(-${discountPercent}%)`}</h6>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </Container>
      <Container class1="home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="services d-flex align-items-center justify-content-between">
              {services.map((service, index) => {
                return (
                  <div className="d-flex align-items-center gap-15" key={index}>
                    <img src={service.image} alt="services" />
                    <div>
                      <h6>{service.title}</h6>
                      <p className="mb-0">{service.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Special Products</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "special") {
                return (
                  <SpecialProduct
                    key={index}
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    image={item?.images[0]?.url}
                    brand={item?.brand}
                    totalrating={parseInt(item?.totalrating)}
                    price={item?.price}
                    sold={item?.sold}
                    quantity={item?.quantity}
                  />
                );
              }
            })}
        </div>
      </Container>
      <Container class1="marquee-wrapper py-3 home-wrapper-2 home-page">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Outstanding brand</h3>
          </div>
          <div className="col-12">
            <div className="marquee-inner-wrapper card-wrapper">
              <Marquee className="d-flex">
                <div className="mx-4 w-25">
                  <img src="images/brand-xiaomi.png" alt="xiaomi" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-levoit.png" alt="levoit" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-sharp.png" alt="sharp" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-dyson.png" alt="dyson" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-06.png" alt="LG" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-07.png" alt="samsung" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-01.png" alt="apple" />
                </div>
              </Marquee>
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
            {productState &&
              productState
                .filter((item) => item.tags === "popular")
                .map((item, index) => (
                  <ProductCard key={index} data={[item]} />
                ))}
          </div>
        </div>
      </Container>
      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="section-heading">Our Latest Blogs</div>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState.map((item, index) => {
              if (index < 4) {
                return (
                  <div className="col-3" key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.created_at).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    />
                  </div>
                );
              }
            })}
        </div>
      </Container>
    </>
  );
};

export default Home;

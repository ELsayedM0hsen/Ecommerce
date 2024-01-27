import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct, getAllProducts } from "../features/products/productSlice";
import {
  getUserCart,
  getUserProductWishlist,
} from "../features/user/userSlice";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";

const Header = () => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const productState = useSelector(
    (state) => state?.product?.products?.product
  );
  const [productOpt, setProductOpt] = useState([]);
  const [paginate, setPaginate] = useState(true);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    if (authState.user !== null) {
      dispatch(getUserCart(config2));
      dispatch(getUserProductWishlist(config2));
    }
  }, [authState.user]);

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum =
        sum +
        Number(cartState[index].quantity) * Number(cartState[index].price);
      setTotal(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({
        id: index,
        prod: element?._id,
        name: element?.title,
      });
    }
    setProductOpt(data);
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Start the user-selected state to add more posts
  const [selectedNavItem, setSelectedNavItem] = useState(null);
  const handleNavItemClick = (navItem) => {
    setSelectedNavItem(navItem);
  };

  return (
    <>
      <header className="header-upper p-2 fixed-header">
        <div className="">
          <div className="row align-items-center justify-content-between w-100">
            <div className="col-md-1 col-2 d-block d-xl-none ps-3 ps-md-4 fs-2 text-white">
              <label htmlFor="mobile-bars-checkbox">
                <FaBars />
              </label>
            </div>
            <div className="col-2 d-block d-md-none fs-2 text-white">
              <label htmlFor="mobile-search-checkbox">
                <BsSearch />
              </label>
            </div>
            <div className="col-xl-2 col-md-3 col-4 p-0 ps-md-3 pe-md-3 ps-xl-5 pe-xl-4 logo-website">
              <h2>
                <Link to={"/"} className="text-white">
                  TechHarbor
                </Link>
              </h2>
            </div>
            <div className="col-xl-5 d-none d-xl-block navigate-header-left">
              <div className="menu-links hide-on-mobile-tablet">
                <div className="d-flex align-items-center gap-15">
                  <NavLink
                    to="/"
                    className={selectedNavItem === "home" ? "selected" : ""}
                    onClick={() => handleNavItemClick("home")}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/product"
                    className={selectedNavItem === "product" ? "selected" : ""}
                    onClick={() => handleNavItemClick("product")}
                  >
                    Products
                  </NavLink>
                  <NavLink
                    to="/blogs"
                    className={selectedNavItem === "blogs" ? "selected" : ""}
                    onClick={() => handleNavItemClick("blogs")}
                  >
                    Blogs
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={selectedNavItem === "contact" ? "selected" : ""}
                    onClick={() => handleNavItemClick("contact")}
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/introduce"
                    className={
                      selectedNavItem === "introduce" ? "selected" : ""
                    }
                    onClick={() => handleNavItemClick("introduce")}
                  >
                    Introduce
                  </NavLink>
                  {authState?.user === null ? (
                    ""
                  ) : (
                    <NavLink
                      to="/my-orders"
                      className={selectedNavItem === "order" ? "selected" : ""}
                      onClick={() => handleNavItemClick("order")}
                    >
                      My Orders
                    </NavLink>
                  )}
                  {authState?.user === null ? (
                    ""
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="border border-0 bg-transparent text-white text-uppercase"
                      type="button"
                    >
                      Log out
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* OVERLAY */}
            <input
              type="checkbox"
              hidden
              className="header__mobile-bars-checkbox"
              id="mobile-bars-checkbox"
            ></input>
            <input
              type="checkbox"
              hidden
              className="header__mobile-search-checkbox"
              id="mobile-search-checkbox"
            ></input>

            <label
              htmlFor="mobile-bars-checkbox"
              className="header__overlay"
            ></label>

            <div className="header__mobile">
              <label
                htmlFor="mobile-bars-checkbox"
                className="header__mobile-close"
              >
                <AiOutlineClose />
              </label>
              <ul className="header__mobile-list">
                <li>
                  <label
                    htmlFor="mobile-bars-checkbox"
                    className="header__mobile-link"
                    onClick={() => navigate("/")}
                  >
                    Home page
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="mobile-bars-checkbox"
                    className="header__mobile-link"
                    onClick={() => navigate("/product")}
                  >
                    Products
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="mobile-bars-checkbox"
                    className="header__mobile-link"
                    onClick={() => navigate("/blogs")}
                  >
                    Blogs
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="mobile-bars-checkbox"
                    className="header__mobile-link"
                    onClick={() => navigate("/contact")}
                  >
                    Contact
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="mobile-bars-checkbox"
                    className="header__mobile-link"
                    onClick={() => navigate("/introduce")}
                  >
                    Introduce
                  </label>
                </li>
                <li>
                  {authState?.user === null ? (
                    ""
                  ) : (
                    <label
                      htmlFor="mobile-bars-checkbox"
                      className="header__mobile-link"
                      onClick={() => navigate("/my-orders")}
                    >
                      My Orders
                    </label>
                  )}
                </li>
                <li>
                  {authState?.user === null ? (
                    ""
                  ) : (
                    <label
                      htmlFor="mobile-bars-checkbox"
                      className="header__mobile-link"
                      onClick={() => navigate("/wishlist")}
                    >
                      Wishlist
                    </label>
                  )}
                </li>
                <li>
                  {authState?.user === null ? (
                    ""
                  ) : (
                    <label
                      htmlFor="mobile-bars-checkbox"
                      className="header__mobile-link"
                      onClick={() => navigate("/my-profile")}
                    >
                      My Profile
                    </label>
                  )}
                </li>
                <li>
                  {authState?.user === null ? (
                    <label
                      htmlFor="mobile-bars-checkbox"
                      className="border mt-5 bg-success text-white text-uppercase text-center header__mobile-link"
                      onClick={() => navigate("/login")}
                      style={{ borderRadius: "10px" }}
                    >
                      Log in
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="border mt-5 bg-danger text-white text-uppercase header__mobile-link"
                      style={{ borderRadius: "10px" }}
                    >
                      Log out
                    </button>
                  )}
                </li>
              </ul>
            </div>
            {/* END OVERLAY */}

            <div className="col-xl-2 col-md-5 header__search">
              <div className="input-group">
                <Typeahead
                  id="pagination-example"
                  onPaginate={() => console.log("Results paginated")}
                  onChange={(selected) => {
                    navigate(`/product/${selected[0]?.prod}`);
                    dispatch(getAProduct(selected[0]?.prod));
                  }}
                  options={productOpt}
                  paginate={paginate}
                  labelKey={"name"}
                  minLength={2}
                  placeholder="Search For Products...."
                />
                <span className="input-group-text" id="basic-addon2">
                  <BsSearch className="fs-5" />
                </span>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-4 navigate-header-right">
              <div className="header-upper-links d-flex align-items-center justify-content-center gap-3">
                <div>
                  <NavLink
                    to="/wishlist"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={wishlist} alt="wishlist" />
                    <p className="mb-0 d-none d-md-block">wishlist</p>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    to="/cart"
                    className="d-flex align-items-center gap-10 text-white position-relative"
                  >
                    <img src={cart} alt="cart" />
                    <div className="d-flex flex-column gap-10">
                      <div className="badge bg-white text-dark">
                        {cartState?.length ? cartState?.length : 0}
                      </div>
                      <p className="mb-0">${total ? total : 0}</p>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="col-xl-1 d-none d-xl-block p-0">
              <div className="my-profile hide-on-mobile-tablet">
                <NavLink
                  to={authState?.user === null ? "/login" : "/my-profile"}
                  className="d-flex align-items-center gap-1 text-white"
                >
                  <img src={user} alt="user" />
                  {authState?.user === null ? (
                    <p className="mb-0">Login</p>
                  ) : (
                    <div>
                      <p className="mb-0" style={{ whiteSpace: "nowrap" }}>
                        Welcome
                      </p>
                      <p className="mb-0">{`${authState?.user?.lastName} ${authState?.user?.firstName}`}</p>
                    </div>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

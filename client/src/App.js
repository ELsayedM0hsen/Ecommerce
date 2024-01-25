/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Blog from './pages/Blog';
import CompareProduct from './pages/CompareProduct';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Forgotpassword from './pages/Forgotpassword';
import Signup from './pages/Signup';
import Resetpassword from './pages/Resetpassword';
import ChangePassword from './pages/ChangePassword';
import SingleBlog from './pages/SingleBlog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TernAndContions from './pages/TernAndContions';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { PrivateRoutes } from './routing/PrivateRoutes';
import { OpenRoutes } from './routing/OpenRoutes';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Introduce from './pages/Introduce';

import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { refreshToken, resetState } from './features/user/userSlice';
import { toast } from 'react-toastify';
import OrderDetail from './pages/OrderDetail';

function App() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const refresh = async () => {
      // Kiểm tra nếu userState không phải là null
      if (userState) {
        const refreshedToken = await dispatch(refreshToken(userState?.refreshToken));
        // refreshedToken là refreshToken mới được trả về sau khi dispatch refreshToken action in Redux
      }
    };
    refresh();
  }, [userState])

  const handleDecoded = () => {
    let storageData = userState?.token || (JSON.parse(localStorage.getItem('customer')))?.token;
    let decoded = {};
    let refreshToken = "";
    let decodedRefreshToken = {};
    if (storageData) {
      decoded = jwtDecode(storageData)
      refreshToken = userState?.refreshToken || (JSON.parse(localStorage.getItem('customer')))?.refreshToken;
      decodedRefreshToken = jwtDecode(refreshToken)
    }
    return { decoded, storageData, decodedRefreshToken, refreshToken }
  }
  axios.interceptors.request.use(async (config) => {
    // Do something before request is sent HTTP
    const currentTime = new Date()
    const { decoded, storageData, decodedRefreshToken, refreshToken } = handleDecoded()

    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = refreshToken; // Sử dụng refreshToken từ Redux
        config.headers['Authorization'] = `Bearer ${data}`// dinh kem moi khi gui yeu cau http
        console.log("refreshToken Successfully");
      } else {
        toast.warning("Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng!");
        localStorage.clear();
        window.location.reload();
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='contact' element={<Contact />} />
            <Route path='introduce' element={<Introduce />} />
            <Route path='product' element={<Product />} />
            <Route path='product/:id' element={<SingleProduct />} />
            <Route path='blogs' element={<Blog />} />
            <Route path='blog/:id' element={<SingleBlog />} />
            <Route path='cart' element={<PrivateRoutes><Cart /></PrivateRoutes>} />
            <Route path='my-orders' element={<PrivateRoutes><Orders /></PrivateRoutes>} />
            <Route path='orders/:id' element={<PrivateRoutes><OrderDetail /></PrivateRoutes>} />
            <Route path='my-profile' element={<PrivateRoutes><Profile /></PrivateRoutes>} />
            <Route path='checkout' element={<PrivateRoutes><Checkout /></PrivateRoutes>} />
            <Route path='compare-product' element={<CompareProduct />} />
            <Route path='wishlist' element={<PrivateRoutes><Wishlist /></PrivateRoutes>} />
            <Route path='login' element={<OpenRoutes><Login /></OpenRoutes>} />
            <Route path='forgot-password' element={<Forgotpassword />} />
            <Route path='signup' element={<OpenRoutes><Signup /></OpenRoutes>} />
            <Route path='reset-password/:token' element={<Resetpassword />} />
            <Route path='change-password/' element={<ChangePassword />} />
            <Route path='privacy-policy' element={<PrivacyPolicy />} />
            <Route path='refund-policy' element={<RefundPolicy />} />
            <Route path='shipping-policy' element={<ShippingPolicy />} />
            <Route path='tern-conditions' element={<TernAndContions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import { Link } from 'react-router-dom';
import {  BsInstagram, BsFacebook } from "react-icons/bs";


const Footer = () => {
  return (
    <>
      <footer className='py-2'>
        <div className="container-xxl">
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='d-flex align-items-center justify-content-center gap-30 footer-mobile-head'>
                <h4 className='text-white text-center mb-0'>Contact us</h4>
                <div className='social-icons d-flex align-items-center gap-15 justify-content-center'>
                  <a href='' target="_blank" className='text-white'><BsFacebook className='fs-4' /></a>
                  <a href='' target="_blank" className='text-white'><BsInstagram className='fs-4' /></a>
                </div>
              </div>
            </div>
            <div className='col-3'>
              <h4 className='text-white mb-4'>Information</h4>
              <div className='footer-links d-flex flex-column'>
                <Link to='/privacy-policy' className='text-white py-2 mb-1'>Privacy Policy</Link>
                <Link to='/refund-policy' className='text-white py-2 mb-1'>Refund Policy</Link>
                <Link to='/shipping-policy' className='text-white py-2 mb-1'>Shipping Policy</Link>
                <Link to='/tern-conditions' className='text-white py-2 mb-1'>Terms of Service</Link>
                <Link className='text-white py-2 mb-1'>Blogs</Link>
              </div>
            </div>
            <div className='col-3'>
              <h4 className='text-white mb-4'>Acount</h4>
              <div className='footer-links d-flex flex-column'>
                <Link className='text-white py-2 mb-1'>About Us</Link>
                <Link className='text-white py-2 mb-1'>Faq</Link>
                <Link className='text-white py-2 mb-1'>Contact</Link>
              </div>
            </div>
            <div className='col-2'>
              <h4 className='text-white mb-4'>Quick Links</h4>
              <div className='footer-links d-flex flex-column'>
                <Link className='text-white py-2 mb-1'>Laptops</Link>
                <Link className='text-white py-2 mb-1'>Headphones</Link>
                <Link className='text-white py-2 mb-1'>Tablets</Link>
                <Link className='text-white py-2 mb-1'>Watch</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className='py-2'>
        <div className="container-xxl">
          <div className='row'>
            <div className='col-12'>
              <p className='text-center mb-0 text-white footer-mobile-second'>
                &copy; {new Date().getFullYear()};Copyright belongs to sayed Powered by Developer's sayed
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
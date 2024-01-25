/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta'; 
import Container from '../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, getOrders, resetState, updateAOrder } from '../features/user/userSlice';
import { Link } from 'react-router-dom';

const Orders = () => {
  const dispatch = useDispatch();

  const [selectedNavItem, setSelectedNavItem] = useState(null);

  const canceledOrderState = useSelector((state) => state?.auth?.canceledOrder);
  const updatedOrderState = useSelector((state) => state?.auth?.updatedOrder);
  const orderState = useSelector((state) => state?.auth?.getOrderedProduct?.orders);

  useEffect(() => {
    dispatch(resetState())
    dispatch(getOrders())
  }, [canceledOrderState, updatedOrderState])

  return (
    <>
      <Meta title={'My Orders'} />
      <BreadCrumb title='My Orders' />
      <Container class1='orders-wrapper home-wrapper-2 py-3'>
        <div className='row'>
          <div className='col-12 p-0 mb-3'>
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === null ? "active" : ""}`}
                onClick={() => setSelectedNavItem(null)}
              >
                All
              </button>
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === "Đã đặt hàng" ? "active" : ""}`}
                onClick={() => setSelectedNavItem("Ordered")}
              >
                Ordered
              </button>
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === "Đang xử lý" ? "active" : ""}`}
                onClick={() => setSelectedNavItem("Processing")}
              >
                Processing
              </button>
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === "Đang giao" ? "active" : ""}`}
                onClick={() => setSelectedNavItem("Delivering")}
              >
                Delivering</button>
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === "Đã nhận hàng" ? "active" : ""}`}
                onClick={() => setSelectedNavItem("Has received the goods")}
              >
                Has received the goods
              </button>
              <button type="button"
                className={`btn btn-outline-primary ${selectedNavItem === "Đã Hủy" ? "active" : ""}`}
                onClick={() => setSelectedNavItem("Cancelled")}
              >
                Cancelled
              </button>
            </div>
            {/* <div className='row'>
              <div className='col-3'>
                <h5>Tổng tiền</h5>
              </div>
              <div className='col-3'>
                <h5>Tiền sau khuyến mãi</h5>
              </div>
              <div className='col-3'>
                <h5>Thanh toán</h5>
              </div>
              <div className='col-3'>
                <h5>Trạng thái đơn hàng</h5>
              </div>
            </div> */}
          </div>
          <div className='col-12'>
            {
              orderState && orderState?.map((item, index) => {
                if (selectedNavItem !== null && item?.orderStatus === selectedNavItem) {
                  return (
                    <div style={{ backgroundColor: "#febd69", borderRadius: "8px" }} className='row mb-3 p-2 text-center' key={index}>
                      <table>
                        <thead>
                          <tr>
                          <th>Order code</th>
                             <th>Product</th>
                             <th>Payment method</th>
                             <th>Total amount</th>
                             <th>Order date</th>
                             <th>Status</th>
                             <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className='py-2'>{item?._id}</td>
                            <td className='py-2'>
                              <Link to={`/orders/${item?._id}`}>
                              See details
                              </Link>
                            </td>
                            <td className='py-2'>{item?.paymentMethod}</td>
                            <td className='py-2'>
                              {item?.totalPrice ? (item?.totalPrice).toLocaleString("en-US", { style: "currency", currency: "EGP" }) : "0 EGP"}
                            </td>
                            <td className='py-2'>{new Date(item?.createdAt).toLocaleString()}</td>
                            <td className='py-2'>
                              <p className='mb-0' style={{ fontWeight: item?.orderStatus === "Cancelled" ? "550" : "" }}>{item?.orderStatus}</p>
                            </td>
                            <td className='py-2' style={{ width: "12%" }}>
                              {
                                item?.orderStatus === "Ordered" &&
                                <button
                                  className='p-1'
                                  style={{ border: "1px solid #9255FD", borderRadius: "4px", color: "red" }}
                                  onClick={() => { dispatch(cancelOrder(item)) }}
                                >
                                  Cancel order
                                </button>
                              }
                              {
                                item?.orderStatus === "Delivering" &&
                                <button
                                  className='p-1'
                                  style={{ border: "1px solid #9255FD", borderRadius: "4px", color: "green" }}
                                  onClick={() => { dispatch(updateAOrder({ id: item?._id, status: "Has received the goods" })) }}
                                >
                                  Has received the goods
                                </button>
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                }
                else
                  if (selectedNavItem === null) {
                    return (
                      <div style={{ backgroundColor: "#febd69", borderRadius: "8px" }} className='row mb-3 p-2 text-center' key={index}>
                        <table>
                          <thead>
                            <tr>
                            <th>Order code</th>
                             <th>Product</th>
                             <th>Payment method</th>
                             <th>Total amount</th>
                             <th>Order date</th>
                             <th>Status</th>
                             <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className='py-2'>{item?._id}</td>
                              <td className='py-2'>
                                <Link to={`/orders/${item?._id}`}>
                                See details
                                </Link>
                              </td>
                              <td className='py-2'>{item?.paymentMethod}</td>
                              <td className='py-2'>
                                {item?.totalPrice ? (item?.totalPrice).toLocaleString("en-US", { style: "currency", currency: "EGP" }) : "0 EGP"}
                              </td>
                              <td className='py-2'>{new Date(item?.createdAt).toLocaleString()}</td>
                              <td className='py-2'>
                                <p className='mb-0' style={{ fontWeight: item?.orderStatus === "Cancelled" ? "550" : "" }}>{item?.orderStatus}</p>
                              </td>
                              <td className='py-2' style={{ width: "12%" }}>
                                {
                                  item?.orderStatus === "Ordered" &&
                                  <button
                                    className='p-1'
                                    style={{ border: "1px solid #9255FD", borderRadius: "4px", color: "red" }}
                                    onClick={() => { dispatch(cancelOrder(item)) }}
                                  >
                                    Cancel order
                                  </button>
                                }
                                {
                                  item?.orderStatus === "Delivering " &&
                                  <button
                                    className='p-1'
                                    style={{ border: "1px solid #9255FD", borderRadius: "4px", color: "green" }}
                                    onClick={() => { dispatch(updateAOrder({ id: item?._id, status: "Has received the goods" })) }}
                                  >
                                    Has received the goods
                                  </button>
                                }
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )
                  }
              })
            }
          </div>
        </div>
      </Container>
    </>
  )
}

export default Orders

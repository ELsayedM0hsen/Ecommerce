/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useMemo } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrder, updateAOrder } from "../features/auth/authSlice";
import { BiArrowBack } from "react-icons/bi";
import StepOrderComponent from "../components/StepOrderComponent";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "image",
    dataIndex: "image",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Total Amount",
    dataIndex: "totalAmount",
  },
];

const ViewOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];

  const aOrderState = useSelector((state) => state?.auth?.singleOrder);
  const orderItemsState = useSelector(
    (state) => state?.auth?.singleOrder?.orderItems
  );
  const updatedOrderState = useSelector((state) => state?.auth?.updatedOrder);

  useEffect(() => {
    dispatch(getOrder(orderId));
  }, [updatedOrderState]);

  const data1 = [];
  for (let i = 0; i < orderItemsState?.length; i++) {
    data1.push({
      key: i + 1,
      image: (
        <div className="product-image">
          <img
            src={orderItemsState[i]?.product?.images[0]?.url}
            className="img-fluid mx-auto"
            alt="product image"
            width={160}
            style={{
              width: 96,
              height: 96,
              display: "block",
              padding: "3px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ),
      name: orderItemsState[i].product?.title,
      brand: orderItemsState[i].product?.brand,
      count: orderItemsState[i].quantity,
      amount: orderItemsState[i].priceAfterDiscount.toLocaleString("en-US", {
        style: "currency",
        currency: "EGP",
      }),
      totalAmount: (
        orderItemsState[i].priceAfterDiscount * orderItemsState[i].quantity
      ).toLocaleString("en-US", { style: "currency", currency: "EGP" }),
    });
  }
  const goBack = () => {
    navigate(-1);
  };

  const orderStatus = useMemo(() => {
    if (aOrderState?.orderStatus === "Ordered") {
      return 0;
    } else if (aOrderState?.orderStatus === "Processing") {
      return 1;
    } else if (aOrderState?.orderStatus === "Delivering") {
      return 2;
    } else if (aOrderState?.orderStatus === "Has received the goods") {
      return 3;
    } else if (aOrderState?.orderStatus === "Cancelled") {
      return 4;
    }
  }, [aOrderState?.orderStatus]);

  const itemsOrderStatus = [
    {
      title: "Ordered",
    },
    {
      title: "Processing",
    },
    {
      title: "Delivering",
    },
    {
      title: "Goods received",
    },
    {
      title: "Cancelled",
    },
  ];

  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }));
  };

  return (
    <div className="viewOrder">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">Order details</h3>
        <button
          className="bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Return
        </button>
      </div>
      <div className="my-3 text-center">
        <StepOrderComponent items={itemsOrderStatus} current={orderStatus} />
      </div>
      <div className="d-flex mb-4 justify-content-between align-items-center info-order-detail-mobile">
        <div className="d-flex justify-content-around align-items-center w-75 info-order-detail-left">
          <div
            style={{
              border: "1px solid #857575cc",
              borderRadius: "10px",
              padding: "15px",
              backgroundColor: "white",
              marginTop: "16px",
            }}
          >
            <h5>Delivery address</h5>
            <p>{`Receiver: ${aOrderState?.shippingInfo?.firstName} ${aOrderState?.shippingInfo?.lastName}`}</p>
            <p>{`Phone number: ${aOrderState?.shippingInfo?.mobile}`}</p>
            <p className="mb-0">{`Address: ${aOrderState?.shippingInfo?.address}`}</p>
          </div>
          <div
            style={{
              border: "1px solid #857575cc",
              borderRadius: "10px",
              padding: "15px",
              backgroundColor: "white",
              marginTop: "16px",
            }}
          >
            <h5>Information line</h5>
            <p>{`Code orders: ${aOrderState?._id}`}</p>
            <p>{`Order date: ${new Date(
              aOrderState?.createdAt
            ).toLocaleString()}`}</p>
            <p>{`Payment methods: ${aOrderState?.paymentMethod}`}</p>
            <p className="mb-0">{`Payment time: ${
              aOrderState?.paidAt
                ? new Date(aOrderState?.paidAt).toLocaleString()
                : "Unpaid"
            }`}</p>
          </div>
        </div>

        <div className="w-25 info-order-detail-right">
          <h4>Update status</h4>
          {aOrderState?.orderStatus === "Ordered" ? (
            <select
              name=""
              value={aOrderState?.orderStatus}
              onChange={(e) =>
                updateOrderStatus(aOrderState?._id, e.target.value)
              }
              id=""
              className="form-control form-select"
            >
              <option value="Ordered" disabled>
                Ordered
              </option>
              <option value="Processing">Processing</option>
              <option value="Delivering" disabled>
                Delivering
              </option>
              <option value="Has received the goods" disabled>
                Has received the goods
              </option>
              <option value="Cancelled" disabled>
                Cancelled
              </option>
            </select>
          ) : aOrderState?.orderStatus === "Processing" ? (
            <select
              name=""
              value={aOrderState?.orderStatus}
              onChange={(e) =>
                updateOrderStatus(aOrderState?._id, e.target.value)
              }
              id=""
              className="form-control form-select"
            >
              <option value="Ordered" disabled>
                Ordered
              </option>
              <option value="Processing" disabled>
                Processing
              </option>
              <option value="Delivering">Delivering</option>
              <option value="Has received the goods" disabled>
                Has received the goods
              </option>
              <option value="Cancelled" disabled>
                Cancelled
              </option>
            </select>
          ) : aOrderState?.orderStatus === "Delivering" ? (
            <select
              name=""
              value={aOrderState?.orderStatus}
              onChange={(e) =>
                updateOrderStatus(aOrderState?._id, e.target.value)
              }
              id=""
              className="form-control form-select"
            >
              <option value="Ordered" disabled>
                Ordered
              </option>
              <option value="Processing" disabled>
                Processing
              </option>
              <option value="Delivering" disabled>
                Delivering
              </option>
              <option value="Has received the goods">
                Has received the goods
              </option>
              <option value="Cancelled" disabled>
                Cancelled
              </option>
            </select>
          ) : (
            <select
              name=""
              value={aOrderState?.orderStatus}
              onChange={(e) =>
                updateOrderStatus(aOrderState?._id, e.target.value)
              }
              id=""
              className="form-control form-select"
              disabled
            >
              <option value="Ordered" disabled>
                Ordered
              </option>
              <option value="Processing" disabled>
                Processing
              </option>
              <option value="Delivering" disabled>
                Delivering
              </option>
              <option value="Has received the goods" disabled>
                Has received the goods
              </option>
              <option value="Cancelled" disabled>
                Cancelled
              </option>
            </select>
          )}
        </div>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <div className="m-3 text-end px-3">
        <div className="d-flex justify-content-end gap-3">
          <p>Total cost of goods:</p>
          <p style={{ minWidth: 60 }}>
            {aOrderState?.itemsPrice
              ? (aOrderState?.itemsPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "EGP",
                })
              : "0 EGP"}
          </p>
        </div>
        <div className="d-flex justify-content-end gap-3">
          <p>Transport fee:</p>
          <p style={{ minWidth: 60 }}>
            {aOrderState?.shippingPrice
              ? (aOrderState?.shippingPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "EGP",
                })
              : "0 EGP"}
          </p>
        </div>
        <div className="d-flex justify-content-end gap-3">
          <b>into money:</b>
          <b style={{ minWidth: 60 }}>
            {aOrderState?.totalPrice
              ? (aOrderState?.totalPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "EGP",
                })
              : "0 EGP"}
          </b>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;

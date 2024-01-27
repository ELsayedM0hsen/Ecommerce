/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiFillDelete, AiFillPrinter } from "react-icons/ai";
import {
  deleteAOrder,
  getOrders,
  resetState,
  updateAOrder,
} from "../features/auth/authSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Payment methods",
    dataIndex: "payment",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Order date",
    dataIndex: "date",
  },
  {
    title: "Order status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedNavItem, setSelectedNavItem] = useState(null);

  const showModal = (e) => {
    setOpen(true);
    setOrderId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config3 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  const dispatch = useDispatch();

  const orderState = useSelector((state) => state?.auth?.orders?.orders);
  const updatedOrderState = useSelector((state) => state?.auth?.updatedOrder);

  useEffect(() => {
    dispatch(resetState());
    dispatch(getOrders(config3));
  }, [updatedOrderState]);

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    const statusSelect =
      orderState[i]?.orderStatus === "Ordered" ? (
        <select
          name=""
          defaultValue={orderState[i]?.orderStatus}
          onChange={(e) =>
            updateOrderStatus(orderState[i]?._id, e.target.value)
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
      ) : orderState[i]?.orderStatus === "Processing" ? (
        <select
          name=""
          defaultValue={orderState[i]?.orderStatus}
          onChange={(e) =>
            updateOrderStatus(orderState[i]?._id, e.target.value)
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
      ) : orderState[i]?.orderStatus === "Delivering" ? (
        <select
          name=""
          defaultValue={orderState[i]?.orderStatus}
          onChange={(e) =>
            updateOrderStatus(orderState[i]?._id, e.target.value)
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
          <option value="Has received the goods">Has received the goods</option>
          <option value="Cancelled" disabled>
            Cancelled
          </option>
        </select>
      ) : (
        <select
          name=""
          defaultValue={orderState[i]?.orderStatus}
          onChange={(e) =>
            updateOrderStatus(orderState[i]?._id, e.target.value)
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
      );

    if (
      selectedNavItem !== null &&
      orderState[i]?.orderStatus === selectedNavItem
    ) {
      data1.push({
        key: i + 1,
        name:
        orderState[i]?.shippingInfo?.firstName+
          " " +
         orderState[i]?.shippingInfo?.lastName ,
        product: (
          <Link
            to={`/admin/order/${orderState[i]?._id}`}
            style={{ color: "#f95959" }}
          >
            See details
          </Link>
        ),
        payment: orderState[i]?.paymentMethod,
        amount: (orderState[i]?.totalPrice).toLocaleString("en-US", {
          style: "currency",
          currency: "EGP",
        }),
        date: new Date(orderState[i]?.createdAt).toLocaleString(),
        status: statusSelect,
        action: (
          <>
            <button
              className="fs-5 bg-transparent border-0"
              style={{ color: "#212529" }}
              onClick={() => printOrder(orderState[i])}
            >
              <AiFillPrinter />
            </button>
            <button
              className="fs-5 text-dark bg-transparent border-0"
              onClick={() => showModal(orderState[i]._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      });
    } else if (selectedNavItem === null) {
      data1.push({
        key: i + 1,
        name:
        orderState[i]?.shippingInfo?.firstName+
          " " +
         orderState[i]?.shippingInfo?.lastName ,
        product: (
          <Link
            to={`/admin/order/${orderState[i]?._id}`}
            style={{ color: "#f95959" }}
          >
            See details
          </Link>
        ),
        payment: orderState[i]?.paymentMethod,
        amount: (orderState[i]?.totalPrice).toLocaleString("en-US", {
          style: "currency",
          currency: "EGP",
        }),
        date: new Date(orderState[i]?.createdAt).toLocaleString(),
        status: statusSelect,
        action: (
          <>
            <button
              className="fs-4 bg-transparent border-0"
              style={{ color: "#212529" }}
              onClick={() => printOrder(orderState[i])}
            >
              <AiFillPrinter />
            </button>
            <button
              className="fs-5 text-dark bg-transparent border-0"
              onClick={() => showModal(orderState[i]._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      });
    }
  }
  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }));
  };
  const deleteOrder = (e) => {
    dispatch(deleteAOrder(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getOrders(config3));
    }, 100);
  };

  /* Print */
  const printOrder = (order) => {
    const orderDetails = getOrderDetails(order);
    const popupWin = window.open("", "_blank", "width=600,height=600");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Order</title>
        </head>
        <body>
          ${orderDetails}
        </body>
      </html>
    `);
    popupWin.document.close();
    popupWin.print();
    popupWin.onafterprint = () => popupWin.close();
  };
  const getOrderDetails = (order) => {
    // Create an HTML string array for the table rows
    const orderItemsHtml = order?.orderItems?.map(
      (item) => `
          <tr key="${item._id}">
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${item.product?.title}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${item.priceAfterDiscount.toLocaleString("en-US", {
                style: "currency",
                currency: "EGP",
              })}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${item.quantity}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${(item.priceAfterDiscount * item.quantity).toLocaleString(
                "en-US",
                { style: "currency", currency: "EGP" }
              )}
            </td>
          </tr>
        `
    );

    // Combine HTML strings to form the main HTML string
    const orderItemsHtmlString = orderItemsHtml.join("");

    // Generate HTML string based on order information
    const orderHtml = `
      <div style="max-width: 680px; margin: 0 auto; padding: 15px; border: 1px solid #ccc;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1>SMARTDEVI HOMES</h1>
        </div>
        <div>
          <i>Shop address: 3/2 Street, Xuan Khanh Ward, Ninh Kieu District, Can Tho City</i> <br />
          <i>Phone: 0919590861</i> <br />
          <i>Email: sayedmohsen50@gmail.com</i>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1;">
                <h4>Customer information:</h4>
                <p>Name: ${order?.shippingInfo?.lastName} ${
      order?.shippingInfo?.firstName
    }</p>
                <p>Phone number: ${order?.shippingInfo?.mobile}</p>
                <p>Address: ${order?.shippingInfo?.address}</p>
                <p>Email: ${order?.user?.email}</p> 
            </div>
            <div style="flex: 1;">
                <h4>Don't trust the invoice:</h4>
                <p>Some bills: ${order?._id}</p>
                <p>Time Order:  ${new Date(
                  order?.createdAt
                ).toLocaleString()}</p>
                <p>Payment methods:  ${order?.paymentMethod}</p>
            </div>
        </div>
        <table style=" border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Product</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Price</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Quantity</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">into money</th>
            </tr>
            ${orderItemsHtmlString}
        </table>
        <div style="margin-top: 20px; text-align: right;">
            <b>total: ${(order?.totalPrice).toLocaleString("en-US", {
              style: "currency",
              currency: "EGP",
            })}</b>
        </div>
        <div>Thank you for your trust and support. Thank you!</div>
    </div>
    `;
    return orderHtml;
  };

  return (
    <div className="orders">
      <h3 className="mb-3 title">Order</h3>
      <div
        className="btn-group my-4"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === null ? "active" : ""
          }`}
          style={{ borderColor: "#212529" }}
          onClick={() => setSelectedNavItem(null)}
        >
          All
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === "Ordered" ? "active" : ""
          }`}
          style={{ borderColor: "#212529" }}
          onClick={() => setSelectedNavItem("Ordered")}
        >
          Ordered
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === "Processing" ? "active" : ""
          }`}
          style={{ borderColor: "#212529" }}
          onClick={() => setSelectedNavItem("Processing")}
        >
          Processing
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === "Delivering" ? "active" : ""
          }`}
          style={{ borderColor: "#212529" }}
          onClick={() => setSelectedNavItem("Delivering")}
        >
          Delivering
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === "Has received the goods" ? "active" : ""
          }`}
          style={{ borderColor: "#212529" }}
          onClick={() => setSelectedNavItem("Has received the goods")}
        >
          Has received the goods
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${
            selectedNavItem === "Cancelled" ? "active" : ""
          }`}
          style={{ borderColor: "273547" }}
          onClick={() => setSelectedNavItem("Cancelled")}
        >
          Cancelled
        </button>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteOrder(orderId)}
        title="Are you sure you want to delete this order?"
      />
    </div>
  );
};

export default Orders;

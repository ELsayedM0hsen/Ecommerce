/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { RiCoupon5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAProduct, getProducts, resetState } from '../features/product/productSlice';
import CustomModal from '../components/CustomModal';
import { getAllCoupons } from "../features/coupon/couponSlice";
import { SearchOutlined } from '@ant-design/icons';


const Productlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setProductId(e);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const productState = useSelector((state) => state.product?.products?.product);
  const couponState = useSelector((state) => state.coupon?.coupons);


  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
    dispatch(getAllCoupons());
  }, []);


  // Search input of antd start
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps('title'), // search
    },
    {
      title: "BRAND",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
      ...getColumnSearchProps('brand'),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
      ...getColumnSearchProps('category'),

    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      // Filter of antd start
      filters: [
        {
          text: 'Stocking',
          value: '>15',
        },
        {
          text: 'Almost out of stock',
          value: '<=15',
        },
        {
          text: 'Out of stock',
          value: '=0',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>15') {
          return record.quantity > 15;
        }
        else if (value === '<=15') {
          return record.quantity <= 15;
        }
        return record.quantity === 0;
      }
      // Filter of antd end
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      // Filter of antd start
      filters: [
        {
          text: '<= 3000000',
          value: '<=',
        },
        {
          text: '> 3000000',
          value: '>',
        }
      ],
      onFilter: (value, record) => {
        const price = Number((record.price).replace(/[^\d]/g, ''));
        if (value === '>') {
          return price > 3000000;
        }
        return price <= 3000000;
      }
      // Filter of antd end
    },
    {
      title: "Coupons",
      dataIndex: "coupons",
      sorter: (a, b) => a.coupons - b.coupons,
      // Filter of antd start
      filters: [
        {
          text: '<= 30 %',
          value: '<=',
        },
        {
          text: '> 30 %',
          value: '>',
        }
      ],
      onFilter: (value, record) => {
        console.log('value: ', { value, record }, Number((record.coupons).replace(/[^\d]/g, '')))
        const coupons = Number((record.coupons).replace(/[^\d]/g, ''));
        if (value === '>') {
          return coupons > 30;
        }
        return coupons <= 30;
      }
      // Filter of antd end
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      sorter: (a, b) => a.warranty - b.warranty,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  // Search input of antd end


  const data1 = [];
  for (let i = 0; i < productState?.length; i++) {
    let price = productState[i].price;
    let discountPercent = 0;
    for (let j = 0; j < couponState.length; j++) {
      if (productState[i]._id === couponState[j].product?._id) { 
        const currentDate = new Date();
        const startDate = new Date(couponState[j].start);
        const endDate = new Date(couponState[j].expiry);
        if (currentDate >= startDate && currentDate <= endDate) {
          discountPercent = couponState[j].discount;
          price *= (100 - discountPercent) / 100;
        }
        break;
      }
    }

    data1.push({
      key: i + 1,
      image: (
        <div className='product-image'>
          <img
            src={productState[i]?.images[0]?.url}
            className='img-fluid mx-auto'
            alt='product image'
            width={160}
          />
        </div>
      ),
      title: productState[i].title,
      brand: productState[i].brand,
      category: productState[i].category,
      quantity: productState[i].quantity,
      price: price.toLocaleString("en-US", { style: "currency", currency: "EGP" }),
      coupons: `${discountPercent} %`,
      warranty: `${productState[i].warranty}`,
      action: (
        <>
          <Link to={`/admin/coupon/${productState[i]._id}`}
            className='fs-4'>
            <RiCoupon5Line />
          </Link>
          <div className="d-flex gap-1 align-items-center">
            <Link to={`/admin/product/${productState[i]._id}`}
              className='fs-4' style={{ color: "#2f2222" }}>
              <BiEdit />
            </Link>
            <button
              className='fs-4 text-danger bg-transparent border-0'
              onClick={() => showModal(productState[i]._id)}
            >
              <AiFillDelete />
            </button>
          </div>
        </>
      ),
    });
  }

  const deleteProduct = (e) => {
    dispatch(deleteAProduct(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 300);
  }
  return (
    <div className="products">
      <h3 className="mb-4 title">Product List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteProduct(productId)}
        title="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Productlist;
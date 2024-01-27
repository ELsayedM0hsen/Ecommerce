import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/customers/customerSlice';
import { blockUser, unBlockUser } from '../features/auth/authSlice';
import { SearchOutlined } from '@ant-design/icons';


const Customer = () => {
  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
        }`,
      Accept: "application/json",
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [])

  const customerstate = useSelector((state) => state?.customer?.customers);


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
  });

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'), // search
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps('email'),
    },
    {
      title: "Phone number",
      dataIndex: "mobile",
      ...getColumnSearchProps('mobile'),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps('address'),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  // Search input of antd end


  const data1 = [];
  for (let i = 0; i < customerstate.length; i++) {
    if (customerstate[i].role !== 'admin') {
      data1.push({
        key: i + 1,
        name:  customerstate[i].firstName + " " + customerstate[i].lastName ,
        email: customerstate[i].email,
        mobile: customerstate[i].mobile,
        address: customerstate[i].address,
        status: (
          <>
            <select name='' defaultValue={customerstate[i]?.isBlocked} onChange={(e) => updateUserStatus(customerstate[i]?._id, e.target.value)} id='' className='form-control form-select'>
              <option value="false">Open</option>
              <option value="true">lock up</option>
            </select>
          </>
        ),
      });
    }
  }
  const updateUserStatus = (id, status) => {
    if (status === "true") {
      dispatch(blockUser(id));
    }
    else {
      dispatch(unBlockUser(id));
    }
  }
  return (
    <div className='customer'>
      <h3 className='mb-4 title'>Clients</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Customer

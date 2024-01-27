import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteASupplier, getSuppliers, resetState } from '../features/supplier/supplierSlice';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import CustomModal from '../components/CustomModal';
import { SearchOutlined } from '@ant-design/icons';


const Supplierlist = () => {
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setSupplierId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getSuppliers());
  }, [])

  const supplierState = useSelector((state) => state.supplier.suppliers);


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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'), // search
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps('email'), // search
    },
    {
      title: "Phone number",
      dataIndex: "mobile",
      ...getColumnSearchProps('mobile'), // search
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps('address'), // search
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const data1 = [];
  for (let i = 0; i < supplierState.length; i++) {
    data1.push({
      key: i + 1,
      name: supplierState[i].name,
      email: supplierState[i].email,
      mobile: supplierState[i].mobile,
      address: supplierState[i].address,
      action: (
        <>
          <Link
            to={`/admin/supplier/${supplierState[i]._id}`}
            className='fs-4'
            style={{ color: "rgb(47, 34, 34)" }}
          >
            <BiEdit />
          </Link>
          <button
            className='fs-4 text-dark bg-transparent border-0'
            onClick={() => showModal(supplierState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const deleteSupplier = (e) => {
    dispatch(deleteASupplier(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getSuppliers());
    }, 100);
  }
  return (
    <div className='suppliers'>
      <h3 className='mb-4 title'>Supplier</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteSupplier(supplierId)}
        title="Are you sure you want to delete this Provider?"
      />
    </div>
  )
}

export default Supplierlist

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAProductCategory,
  getCategories,
  resetState,
} from "../features/pcategory/pcategorySlice";
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    itle: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setPCatId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setPCatId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, []);

  const pCatstate = useSelector((state) => state?.pCategory?.pCategories);
  const data1 = [];
  for (let i = 0; i < pCatstate.length; i++) {
    data1.push({
      key: i + 1,
      name: pCatstate[i].title,
      action: (
        <>
          <Link
            to={`/admin/category/${pCatstate[i]._id}`}
            className="fs-4"
            style={{ color: "rgb(47, 34, 34)" }}
          >
            <BiEdit />
          </Link>
          <button
            className="ms-1 fs-4 text-dark bg-transparent border-0"
            onClick={() => showModal(pCatstate[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteProductCategory = (e) => {
    dispatch(deleteAProductCategory(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };
  return (
    <div className="productCategories">
      <h3 className="mb-4 title">Product Category List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteProductCategory(pCatId)}
        title="Are you sure you want to delete this Category?"
      />
    </div>
  );
};

export default Categorylist;

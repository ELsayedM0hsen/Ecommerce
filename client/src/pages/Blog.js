import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "./../components/BlogCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";

const Blog = () => {
  const [category, setCategory] = useState([]);
  const [bcategory, setBCategory] = useState([]);

  const blogState = useSelector((state) => state?.blog?.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBlogs({ category }));
  }, [category]);

  useEffect(() => {
    let bcategory = [];
    for (let index = 0; index < blogState?.length; index++) {
      const element = blogState[index];
      bcategory.push(element.category);
    }
    setBCategory(bcategory);
  }, [blogState]);

  return (
    <>
      <Meta title="Blogs" />
      <BreadCrumb title="Blogs" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Find By Categories</h3>
              <div>
                <ul className="ps-0">
                  {bcategory &&
                    [...new Set(bcategory)].map((item, index) => {
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            setCategory(item);
                          }}
                        >
                          {item}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            {category !== null && (
              <div className="filter-sort-grid mb-3">
                <div className="filter-title mb-2">Filtered By</div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {category !== null && (
                    <button
                      className="btn-filter"
                      onClick={() => {
                        setCategory(null);
                      }}
                    >
                      × {category}
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="row">
              {blogState &&
                blogState?.map((item, index) => {
                  return (
                    <div className="col-6 mb-3" key={index}>
                      <BlogCard
                        id={item?._id}
                        title={item?.title}
                        description={item?.description}
                        image={item?.images[0]?.url}
                        date={moment(item?.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;

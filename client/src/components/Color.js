import React from "react";

const Color = (props) => {
  const { colorData, setColor } = props;
  return (
    <>
      <ul className="colors ps-0 mb-0">
        <li
          onClick={() => setColor(colorData)}
          style={{ backgroundColor: colorData, border: "1px solid #333" }}
        ></li>
      </ul>
    </>
  );
};

export default Color;

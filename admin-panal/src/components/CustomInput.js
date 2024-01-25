import React from "react";

const CustomInput = (props) => {
  // name, val, onChng, onBlr
  const { type, label, i_id, i_class, name, val, onChng, onBlr, disabled, min } = props;
  return (
    <div className="form-floating mt-3 mb-2">
      <input
        style={{ borderColor: "#777777" }}
        type={type}
        className={`form-control ${i_class}`}
        id={i_id}
        placeholder={label}
        name={name}
        value={val}
        onChange={onChng}
        onBlur={onBlr}
        disabled={disabled}
        min={min}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomInput;
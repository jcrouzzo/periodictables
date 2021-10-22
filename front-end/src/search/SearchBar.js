import React from "react";


export default function SearchBar({
  label = "",
  name = "",
  value = "",
  onChange = () => null,
  required = false,
}) {
  const placeholder = `Enter a customer's ${label.toLowerCase()}`;
  return (
    <div className="form-group my-2 col-12 ">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type="text"
        name={name}
        placeholder={placeholder}
        title={placeholder}
        className="form-control my-2"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

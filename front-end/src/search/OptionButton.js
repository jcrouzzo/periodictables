import React from "react";

export default function OptionButton({
  label = "",
  propName = "",
  checked = false,
  onChange = () => null,
}) {
  return (
    <>
      <input
        type="checkbox"
        className="btn-check"
        id={`${propName}-btn`}
        autoComplete="off"
        onChange={onChange}
        name={label}
        checked={checked}
      />
      <label className="btn btn-outline-secondary" htmlFor={`${propName}-btn`}>
        {label}
      </label>
    </>
  );
}

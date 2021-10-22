import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

export default function DateNavigationButton({ type, currentDate }) {
  const text = type.slice(0, 1).toUpperCase() + type.slice(1);
  const dateChangeUtils = { previous, next, today };
  const newDate = dateChangeUtils[type](currentDate);
  const destination = `/dashboard?date=${newDate}`;
  const history = useHistory();

  const onClickHandler = () => {
    history.push(destination);
  };

  const buttonStyle = text === "Today" ? "btn-secondary" : "btn-outline-secondary";

  return (
    <button className={`btn ${buttonStyle}`} onClick={onClickHandler}>
      {text}
    </button>
  );
}

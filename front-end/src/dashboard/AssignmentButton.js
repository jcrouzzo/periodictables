import React from "react";
import { Link } from "react-router-dom";


function SeatButton({ reservation }) {
  const { reservation_id: id, status } = reservation;
  const href = `/reservations/${id}/seat`;

  const disabled = status === "booked" ? false : true;

  return disabled ? (
    <button className="btn btn-light" disabled>
      Seat
    </button>
  ) : (
    <Link className="btn btn-secondary" to={href}>
      Seat
    </Link>
  );
}

function CancelButton({ reservation, cancelReservation }) {
  const { reservation_id: id, status } = reservation;

  const disabled = status === "booked" ? false : true;

  const onClick = () => {
    const abortController = new AbortController();

    if (
      !window.confirm(
        "Do you want to cancel this reservation?\nThis cannot be undone."
      )
    )
      return () => abortController.abort();

    cancelReservation(id, abortController);
  };

  return disabled ? (
    <button type="button" className="btn btn-light" disabled>
      Cancel
    </button>
  ) : (

    <button
      type="button"
      onClick={onClick}
      className="btn btn-secondary"
      data-reservation-id-cancel={id}
    >
      Cancel
    </button>
  );
}

function EditButton({ reservation }) {
  const { reservation_id: id, status } = reservation;
  const href = `/reservations/${id}/edit`;

  const disabled = status === "booked" ? false : true;

  return disabled ? (
    <button className="btn btn-light" disabled>
      Edit
    </button>
  ) : (

    <Link className="btn btn-dark" to={href}>
      Edit
    </Link>
  );
}


function FinishButton({ table, finishTable }) {
  const { table_id: id, occupied } = table;

  const buttonStyle = occupied ? "btn-light" : "btn-secondary";

  const onClick = () => {
    finishTable(id);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn ${buttonStyle}`}
      disabled={!occupied}
      data-table-id-finish={id}
    >
      Finish
    </button>
  );
}



export default function AssignmentButton({ rowObject, buttonFunction, type }) {
  switch (type) {
    case "seatButton":
      return <SeatButton reservation={rowObject} />;
    case "editButton":
      return <EditButton reservation={rowObject} />;
    case "cancelButton":
      return (
        <CancelButton
          reservation={rowObject}
          cancelReservation={buttonFunction}
        />
      );
    default:
      return <FinishButton table={rowObject} finishTable={buttonFunction} />;
  }
}

import React from "react";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function NewReservation() {
  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const APICall = (reservation) => {
    return createReservation(reservation);
  };

  return (
    <ReservationForm
      type="New"
      defaultFormData={defaultFormData}
      APICall={APICall}
    />
  );
}

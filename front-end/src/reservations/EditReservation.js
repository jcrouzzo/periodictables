import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const { reservationId } = useParams();
  const [defaultFormData, setDefaultFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  useEffect(() => {
    readReservation(reservationId)
      .then((reservation) => {
        reservation.reservation_date = formatAsDate(
          reservation.reservation_date
        );
        return reservation;
      })
      .then(setDefaultFormData);
  }, [reservationId]);


  const APICall = (reservation) => {
    return updateReservation(reservationId, reservation);
  };

  return (
    <ReservationForm type="Edit" defaultFormData={defaultFormData} APICall={APICall} />
  );
}

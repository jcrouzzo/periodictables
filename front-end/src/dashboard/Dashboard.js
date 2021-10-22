import React, { useEffect, useState } from "react";
import {
  finishReservation,
  setReservationStatus,
  listReservations,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DisplayTable from "./DisplayTable";
import DateNavigationButton from "./DateNavigationButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const reservationsCols = {
    seatButton: "",
    first_name: "First Name",
    last_name: "Last Name",
    mobile_number: "Mobile Number",
    reservation_time: "Time of Reservation",
    people: "Party Size",
    status: "Current Status",
    editButton: "",
    cancelButton: "",
  };

  const tableCols = {
    finishButton: "",
    table_name: "Table Name",
    capacity: "Maximum Capacity",
    occupied: "Availability",
  };

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadReservations, [date]);
  useEffect(loadTables, []);

  /**
   * API call to listReservations
   * Retrieves the data necessary to render the tables and stores it in useStatevariables
   */
  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    setReservations([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    setTables([]);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }


  function loadDashboard() {
    loadReservations();
    loadTables();
  }


  async function finishTable(id) {
    setTablesError(null);
    const abortController = new AbortController();

    // Window confirmation dialogue
    if (
      !window.confirm(
        "Is this table ready to seat new guests?\nThis cannot be undone."
      )
    )
      return () => abortController.abort();

    // After confirmation, finishReservation then loadDashboard again
    try {
      await finishReservation(id, abortController.signal);
      loadDashboard();
    } catch (error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  }

  async function cancelReservation(id, controller) {
    setReservationsError(null);
    try {
      await setReservationStatus(id, "cancelled", controller.signal);
      loadDashboard();
    } catch (error) {
      setReservationsError(error);
    }
    return () => controller.abort();
  }

  return (
    <main>
      <div className="d-flex flex-column mb-3">
        <div className='text-light bg-secondary pl-3'>
        <h1 className="h3"> Dashboard</h1>
        </div>
        <div className="container-lg d-flex flex-column align-items-center justify-content-center px-0">
          <div className="col-12">
            <ErrorAlert error={reservationsError} />
            <ErrorAlert error={tablesError} />
          </div>
          <h4 className="h4 py-4">Reservations for {date}</h4>
          <div class='btn-group'>
            <DateNavigationButton type="previous" currentDate={date} />
            <DateNavigationButton type="today" currentDate={date} />
            <DateNavigationButton type="next" currentDate={date} />
          </div>
          <div className="col-11">
            <DisplayTable
              data={reservations}
              objCols={reservationsCols}
              buttonFunction={cancelReservation}
            />
          </div>
          <h4 className="h4 mt-5">Tables in the Restaurant</h4>
          <div className="col-12">
            <DisplayTable
              data={tables}
              objCols={tableCols}
              buttonFunction={finishTable}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

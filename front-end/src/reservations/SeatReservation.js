import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import LoadingPrompt from "../loading/LoadingPrompt";
import { listTables, readReservation, seatReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import DisplayReservation from "./DisplayReservation";


export default function SeatReservation() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(); 
  const [tables, setTables] = useState([]);
  const [tableSelection, setTableSelection] = useState("");
  const [tableOptions, setTableOptions] = useState(""); 
  const [errorsArray, setErrorsArray] = useState([]); 
  const history = useHistory();

  useEffect(loadTables, []); 
  useEffect(loadReservation, [reservationId]); 
  useEffect(loadTableSelection, [tables]); 

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch((errorObj) => setErrorsArray((errors) => [...errors, errorObj]));
    return () => abortController.abort();
  }

  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservationId)
      .then(setReservation)
      .catch((errorObj) => setErrorsArray((errors) => [...errors, errorObj]));
    return () => abortController.abort();
  }

  function loadTableSelection() {
    const loadedOptions = tables?.map((table, index) => (
      <option key={index} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
    setTableOptions(loadedOptions);
  }

  const selectionIsValid = () => {
    let validSelection = true;
    const table = tables.find(
      (currentTable) => currentTable.table_id === Number(tableSelection)
    );
    if (table.occupied) {
      validSelection = false;
      setErrorsArray((subErrors) => [
        ...subErrors,
        {
          message: `"${table?.table_name}" is currently occupied, and cannot be seated.`,
        },
      ]);
    }

    if (table.capacity < reservation.people) {
      validSelection = false;
      setErrorsArray((subErrors) => [
        ...subErrors,
        {
          message: `"${table?.table_name}" has a maximum capacity of ${table?.capacity}. This table cannot accomodate the ${reservation.people} people in reservation #${reservation.reservation_id}.`,
        },
      ]);
    }

    return validSelection;
  };

  const selectTableHandler = ({ target }) => {
    setTableSelection(target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setErrorsArray([]);
    if (selectionIsValid())
      seatReservation(reservationId, tableSelection)
        .then(() =>
          history.push(
            `/dashboard?date=${formatAsDate(reservation.reservation_date)}`
          )
        )
        .catch((errorObj) =>
          setErrorsArray((subErrors) => [...subErrors, errorObj])
        );
  };

  const cancelHandler = () => {
    history.goBack();
  };

  const errorDisplay = errorsArray.map((error, index) => (
    <ErrorAlert key={index} error={error} />
  ));

  return (
    <main>
      <div className="d-flex flex-column mb-3 justify-content-around ">
      <div className='text-light bg-secondary pl-3'>
        <h1 className="h3">Seating Reservation #{reservationId} Info</h1>
        </div>
        <LoadingPrompt
          component={
            <div className="col-8 col-xl-10 align-self-center">
              {errorDisplay}
              <div className="d-flex flex-column flex-xl-row">
                <form onSubmit={submitHandler} className="col mx-4 mb-4">
                  <fieldset>
                    <div className="form-group my-2">
                      <label htmlFor="table_id">
                        Please assign a table for reservation #{reservationId}
                      </label>
                      {
                        <select
                          id="table_id"
                          name="table_id"
                          title="Select a table to assign to this reservation"
                          className="form-select my-2"
                          value={tableSelection}
                          onChange={selectTableHandler}
                          required
                        >
                          <option value="">Please Select a Table</option>
                          {tableOptions}
                        </select>
                      }
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={cancelHandler}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary ms-4 mt-2">
                      Submit
                    </button>
                  </fieldset>
                </form>
                <div className="col mx-4">
                  <DisplayReservation reservation={reservation} />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </main>
  );
}

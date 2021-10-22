import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { convert12HourTime } from "../utils/date-time";


export default function ReservationForm({ type, defaultFormData, APICall }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  useEffect(() => {
    setFormData(defaultFormData);
  }, [defaultFormData]);

  const history = useHistory();

  const formChangeHandler = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const formIsValid = () => {
    let validForm = true;
    const closedDays = { 2: "Tuesday" }; 
    const startTime = "10:30"; 
    const closeTime = "21:30"; 

    const date = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );
    const today = new Date();
   
    if (Date.parse(date) <= Date.parse(today)) {
      validForm = false;
      setSubmissionErrors((subErrors) => [
        ...subErrors,
        {
          message: `Your reservation cannot be made for a date or time of the past. Please select a future date.`,
        },
      ]);
    }

    if (closedDays[date.getDay()]) {
      validForm = false;
      setSubmissionErrors((subErrors) => [
        ...subErrors,
        {
          message: _generateClosedMessage(closedDays, date.getDay()),
        },
      ]);
    }

    const startDateTime = new Date(`${formData.reservation_date}T${startTime}`); // Date-time with target date and startTime
    const closeDateTime = new Date(`${formData.reservation_date}T${closeTime}`); //

    if (
      Date.parse(date) < Date.parse(startDateTime) ||
      Date.parse(date) > Date.parse(closeDateTime)
    ) {
      validForm = false;
      setSubmissionErrors((subErrors) => [
        ...subErrors,
        {
          message: `The restaurant is only taking reservations between ${convert12HourTime(
            startTime
          )} and ${convert12HourTime(closeTime)}.`,
        },
      ]);
    }

    return validForm;
  };

  const submitHandler = (event) => {
    event.preventDefault(); 
    setSubmissionErrors([]);

    formData.people = parseInt(formData.people); 


    if (formIsValid())
      APICall(formData)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch((errorObj) =>
          setSubmissionErrors((subErrors) => [...subErrors, errorObj])
        );
  };

  function _generateClosedMessage(closedDays, selectedDay) {

    const closedDayNames = Object.values(closedDays);

  
    let closedMessage = `The date you have selected is a ${closedDays[selectedDay]}. `;

    closedMessage += "The restaurant is closed on ";

    if (closedDayNames.length > 1)
      closedMessage += closedDayNames.slice(0, -1).join("s, ");

    if (closedDayNames.length > 2) closedMessage += "s,";

    if (closedDayNames.length === 2) closedMessage += "s";

    if (closedDayNames.length > 1) closedMessage += " and ";

    closedMessage += closedDayNames.slice(-1);

    return closedMessage + "s."; 
  }

  const cancelHandler = () => {

    history.goBack();
  };

  const errorDisplay = submissionErrors.map((error, index) => (
    <ErrorAlert key={index} error={error} />
  ));


  return (
    <main>
      <div className="d-flex flex-column mb-3">
      <div className='text-light bg-secondary pl-3'>
        <h1 className="h3">{type} Reservation</h1>
        </div>
        <form
          onSubmit={submitHandler}
          className="align-self-center col-10 col-xl-5"
        >
          {errorDisplay}
          <fieldset className="d-flex flex-column ">
            <div className="form-group my-2">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                title="Enter your first name"
                className="form-control my-2"
                value={formData.first_name}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                title="Enter your last name"
                className="form-control my-2"
                value={formData.last_name}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="mobile_number">Mobile number</label>
              <input
                id="mobile_number"
                type="text"
                name="mobile_number"
                placeholder="Enter your mobile phone number"
                title="Enter your mobile phone number"
                className="form-control my-2"
                value={formData.mobile_number}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="reservation_date">Date of Reservation</label>
              <input
                id="reservation_date"
                type="date"
                name="reservation_date"
                title="Please select the date you wish to reserve"
                className="form-control my-2"
                value={formData.reservation_date}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="reservation_time">Time of Reservation</label>
              <input
                id="reservation_time"
                type="time"
                name="reservation_time"
                title="Please select the time you wish to reserve"
                className="form-control my-2"
                value={formData.reservation_time}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="people">Size of Party</label>
              <input
                id="people"
                type="number"
                name="people"
                placeholder="Please enter the size of your party"
                title="Please enter the size of your party"
                className="form-control my-2"
                min="1"
                value={formData.people}
                onChange={formChangeHandler}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary btn-lg col-5"
                onClick={cancelHandler}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-outline-secondary btn-lg col-5">
                Submit
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

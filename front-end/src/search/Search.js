import React, { useCallback, useEffect, useState } from "react";
import DisplayTable from "../dashboard/DisplayTable";
import ErrorAlert from "../layout/ErrorAlert";
import LoadingPrompt from "../loading/LoadingPrompt";
import { listReservations, setReservationStatus } from "../utils/api";
import OptionButton from "./OptionButton";
import SearchBar from "./SearchBar";


export function Search() {
  const [reservations, setReservations] = useState(null); 
  const [searchQueries, setSearchQueries] = useState({}); 
  const [searchResult, setSearchResult] = useState(""); 
  const [errorsArray, setErrorsArray] = useState([]); 
  
  const defaultSearchOptions = {
    first_name: { label: "First Name", checked: false },
    last_name: { label: "Last Name", checked: false },
    mobile_number: { label: "Phone Number", checked: true },
    reservation_time: { label: "Time of Reservation", checked: false },
    people: { label: "Size of Party", checked: false },
    status: { label: "Status", checked: false },
  };
  const defaultSearchBars = [
    {
      label: "Phone Number",
      name: "mobile_number",
    },
  ];

  const [searchOptions, setSearchOptions] = useState(defaultSearchOptions); 
  const [searchBars, setSearchBars] = useState(defaultSearchBars); 

  const loadSearchResults = useCallback(() => {
    const abortController = new AbortController();
    setReservations([]);
    listReservations(searchQueries, abortController.signal)
      .then(setReservations)
      .catch((errorObj) => setErrorsArray((errors) => [...errors, errorObj]));
    return () => abortController.abort();
  }, [searchQueries]);

  const cancelReservation = useCallback(
    async (id, controller) => {
      setErrorsArray([]);
      try {
        await setReservationStatus(id, "cancelled", controller.signal);
        loadSearchResults();
      } catch (error) {
        setErrorsArray(error);
      }
      return () => controller.abort();
    },
    [loadSearchResults]
  );

  useEffect(() => {
    const resultTableCols = {
      reservation_id: "Id #",
      first_name: "First Name",
      last_name: "Last Name",
      mobile_number: "Mobile Number",
      reservation_date: "Date of Reservation",
      reservation_time: "Time of Reservation",
      people: "Party Size",
      status: "Current Status",
      editButton: "",
      cancelButton: "",
    };

    if (!reservations) setSearchResult(null);
    else if (!reservations.length)
      setSearchResult(
        <LoadingPrompt
          component={
            <h3 className="text-center mt-4">No reservations found!</h3>
          }
        />
      );

    else
      setSearchResult(
        <DisplayTable
          data={reservations}
          objCols={resultTableCols}
          buttonFunction={cancelReservation}
        />
      );
  }, [reservations, cancelReservation]);

  const submitHandler = (event) => {
    event.preventDefault();
    setErrorsArray([]);
    return loadSearchResults();
  };



  const optionClickHandler = ({ target }) => {
    const propName = target.id.replace(/-btn$/, "");


    setSearchOptions((options) => ({
      ...options,
      [propName]: { ...options[propName], checked: target.checked },
    }));

    if (target.checked)
      return setSearchBars((options) => [
        ...options,
        {
          label: target.name,
          name: propName,
        },
      ]);

    setSearchBars((options) => options.filter(({ name }) => name !== propName));
    return setSearchQueries((queries) => ({
      ...queries,
      [propName]: "",
    }));
  };

  const optionsPicker = (
    <div
      className="btn-group flex-wrap "
      role="group"
      aria-label="Search options toggle button group"
    >
      {Object.entries(searchOptions).map(
        ([propName, { label, checked }], index) => (
          <OptionButton
            label={label}
            propName={propName}
            checked={checked}
            key={index}
            onChange={optionClickHandler}
          />
        )
      )}
    </div>
  );

  const queriesChangeHandler = ({ target: { name, value } }) =>
    setSearchQueries((queries) => ({
      ...queries,
      [name]: value,
    }));


  const searchBarsDisplay = searchBars.map(
    ({ label, name, placeholder }, index) => (
      <SearchBar
        label={label}
        name={name}
        placeholder={placeholder}
        value={searchQueries[name]}
        onChange={queriesChangeHandler}
        key={index}
        required={index === 0}
      />
    )
  );


  const errorDisplay = errorsArray.map((error, index) => (
    <ErrorAlert key={index} error={error} />
  ));

  return (
    <main>
      <div className="d-flex mb-3 flex-column">
      <div className='text-light bg-secondary pl-3'>
        <h1 className="h3">Search for Reservation</h1>
        </div>
        <form onSubmit={submitHandler} className="align-self-center pt-3">
          {errorDisplay}
          <fieldset className="d-flex flex-column">
            <div className="col align-self-center">{optionsPicker}</div>
            <div className="col">{searchBarsDisplay}</div>
          </fieldset>
          <button type="submit" className="btn btn-secondary px-3 mt-2">
            Find
          </button>
        </form>
        <div className="align-self-center col-12 col-xl-10 mt-4">
          {searchResult}
        </div>
      </div>
    </main>
  );
}

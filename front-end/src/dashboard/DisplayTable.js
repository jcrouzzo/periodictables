import React from "react";
import { Link } from "react-router-dom";
import LoadingPrompt from "../loading/LoadingPrompt";
import { convert12HourTime } from "../utils/date-time";
import AssignmentButton from "./AssignmentButton";

function TableHead({ columnLabels }) {
  const tableHeader = columnLabels.map((columnName, index) => (
    <th className="text-center" key={index} scope="col">
      {columnName}
    </th>
  ));

  return (
    <thead>
      <tr>{tableHeader}</tr>
    </thead>
  );
  }
  
  function TableRow({ rowObject, propNames, buttonFunction }) {
    const row = [];
    const dataStyle = "text-center align-middle";
    for (let index in propNames) {
      const propName = propNames[index];
      // data is the value of the rowObject at that property name
      const data = rowObject[propName];
  
      // if data is a boolean, we will need to disply a status string based on the boolean value
      const isBoolean = typeof data === "boolean";
      const status = data ? "Occupied" : "Free";
  
      // if data is a boolean, then it's a table status that we push into the row instead
      if (isBoolean)
        row.push(
          <td
            className={dataStyle}
            key={index}
            data-table-id-status={rowObject.table_id}
          >
            {status}
          </td>
        );
      // if data is undefined, we render a button of the matching propName type instead
      else if (!data) {
        row.push(
          <td className={dataStyle} key={index}>
            <AssignmentButton
              rowObject={rowObject}
              buttonFunction={buttonFunction}
              type={propName}
            />
          </td>
        );
      }
      // if data is a reservation status, give it a special attribute for the unit test to find it
      else if (["booked", "seated", "finished", "cancelled"].includes(data))
        row.push(
          <td
            className={dataStyle}
            key={index}
            data-reservation-id-status={rowObject.reservation_id}
          >
            {data}
          </td>
        );
  
      else if (propName.match(/time/gi)) {
        row.push(
          <td className={dataStyle} key={index}>
            {convert12HourTime(data)}
          </td>
        );
      }
  
      else
        row.push(
          <td className={dataStyle} key={index}>
            {data}
          </td>
        );
    }
  
    return <tr>{row}</tr>;
  }
  
export default function DisplayTable({
  data,
  objCols = {},
  buttonFunction = () => null,
}) {
  const rows = data?.map((object, index) => (
    <TableRow
      key={index}
      rowObject={object}
      propNames={Object.keys(objCols)}
      buttonFunction={buttonFunction}
    />
  ));
  const emptyMessage = Object.keys(objCols).includes("table_name") ? (
    <>
      <p>There are no tables in the restaurant.</p>
      <Link className="btn btn-light" to="/tables/new">
        Click here to add a Table!
      </Link>
    </>
  ) : (
    <>
      <p>No reservations scheduled today.</p>
      <Link className="btn btn-light" to="/reservations/new">
        Click here to add a Reservation!
      </Link>
    </>
  );

  return rows?.length ? (
    <div className="table-responsive">
      <table className="table table-hover">
        <TableHead columnLabels={Object.values(objCols)} />
        <tbody>{rows}</tbody>
      </table>
    </div>
  ) : (
    <div className="my-3">
      <LoadingPrompt
        component={<h5 className="h5 text-center">{emptyMessage}</h5>}
      />
    </div>
  );
}
